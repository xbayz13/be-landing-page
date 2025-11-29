import { BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PostsService } from './posts.service';
import { Post, PostStatus } from './entities/post.entity';
import { Author } from './entities/author.entity';
import { Category } from './entities/category.entity';

type MockRepository = {
  create: jest.Mock;
  save: jest.Mock;
  findOne: jest.Mock;
  findAndCount: jest.Mock;
  merge: jest.Mock;
  remove: jest.Mock;
};

const createMockRepository = (): MockRepository => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  findAndCount: jest.fn(),
  merge: jest.fn(),
  remove: jest.fn(),
});

describe('PostsService', () => {
  let service: PostsService;
  let postsRepository: MockRepository;
  let categoriesRepository: MockRepository;
  let authorsRepository: MockRepository;

  beforeEach(() => {
    postsRepository = createMockRepository();
    categoriesRepository = createMockRepository();
    authorsRepository = createMockRepository();

    service = new PostsService(
      postsRepository as unknown as Repository<Post>,
      categoriesRepository as unknown as Repository<Category>,
      authorsRepository as unknown as Repository<Author>,
    );
  });

  it('creates a post with default status and attaches relations', async () => {
    postsRepository.findOne.mockResolvedValueOnce(null);
    const author: Author = { id: 'author-1' } as Author;
    const category: Category = { id: 'category-1' } as Category;
    authorsRepository.findOne.mockResolvedValue(author);
    categoriesRepository.findOne.mockResolvedValue(category);
    postsRepository.create.mockImplementation(
      (payload: Partial<Post>) =>
        ({
          ...payload,
        }) as Post,
    );
    postsRepository.save.mockImplementation((entity: Post) =>
      Promise.resolve({ ...entity, id: 'post-1' } as Post),
    );

    const dto = {
      title: 'Great Post',
      slug: 'great-post',
      content: 'body',
      authorId: author.id,
      categoryId: category.id,
      publishedAt: '2024-01-01T00:00:00.000Z',
    };

    const result = await service.create(dto);

    expect(postsRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        title: dto.title,
        status: PostStatus.DRAFT,
        author,
        category,
        publishedAt: new Date(dto.publishedAt),
      }),
    );
    expect(result.title).toBe(dto.title);
  });

  it('queries posts with optional status filter', async () => {
    postsRepository.findAndCount.mockResolvedValue([[], 0]);

    const query = {
      status: PostStatus.PUBLISHED,
      page: 2,
      limit: 10,
      authorId: 'author-1',
      categoryId: 'category-1',
    };

    const result = await service.findAll(query);

    expect(postsRepository.findAndCount).toHaveBeenCalledWith({
      where: {
        status: PostStatus.PUBLISHED,
        author: { id: 'author-1' },
        category: { id: 'category-1' },
      },
      order: { publishedAt: 'DESC', createdAt: 'DESC' },
      take: 10,
      skip: 10,
    });
    expect(result.meta).toEqual({
      page: 2,
      limit: 10,
      total: 0,
      totalPages: 1,
    });
  });

  it('updates a post and reassigns relations', async () => {
    const existingPost = {
      id: 'post-1',
      title: 'Old title',
      publishedAt: new Date('2024-01-01T00:00:00.000Z'),
    } as Post;
    postsRepository.findOne.mockResolvedValue(existingPost);
    postsRepository.merge.mockImplementation(
      (entity: Post, payload: Partial<Post>) => ({
        ...entity,
        ...payload,
      }),
    );
    postsRepository.save.mockImplementation((entity: Post) =>
      Promise.resolve(entity),
    );

    const newAuthor: Author = { id: 'author-2' } as Author;
    const newCategory: Category = { id: 'category-2' } as Category;
    authorsRepository.findOne.mockResolvedValue(newAuthor);
    categoriesRepository.findOne.mockResolvedValue(newCategory);

    const dto = {
      title: 'Updated title',
      authorId: newAuthor.id,
      categoryId: newCategory.id,
      publishedAt: '2024-02-02T00:00:00.000Z',
    };

    const result = await service.update(existingPost.id, dto);

    expect(postsRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        title: dto.title,
        author: newAuthor,
        category: newCategory,
        publishedAt: new Date(dto.publishedAt),
      }),
    );
    expect(result.title).toBe(dto.title);
  });

  it('rejects duplicated slug on create', async () => {
    postsRepository.findOne.mockResolvedValue({
      id: 'other',
      slug: 'dup-slug',
    } as Post);

    await expect(
      service.create({
        title: 'Duplicate slug',
        slug: 'dup-slug',
        content: 'body',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
