import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ListPostsQueryDto } from './dto/list-posts-query.dto';
import { Author } from './entities/author.entity';
import { Category } from './entities/category.entity';
import { Post, PostStatus } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    @InjectRepository(Author)
    private readonly authorsRepository: Repository<Author>,
  ) {}

  async create(dto: CreatePostDto) {
    await this.assertSlugAvailable(dto.slug);
    const post = this.postsRepository.create({
      ...dto,
      status: dto.status ?? PostStatus.DRAFT,
      publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined,
    });
    if (dto.authorId) {
      post.author = await this.getAuthor(dto.authorId);
    }
    if (dto.categoryId) {
      post.category = await this.getCategory(dto.categoryId);
    }
    return this.postsRepository.save(post);
  }

  async findAll(query: ListPostsQueryDto = {}) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 20, 100);
    const skip = (page - 1) * limit;
    const where: FindOptionsWhere<Post> = {};
    if (query.status) {
      where.status = query.status;
    }
    if (query.authorId) {
      where.author = { id: query.authorId } as Author;
    }
    if (query.categoryId) {
      where.category = { id: query.categoryId } as Category;
    }
    const [data, total] = await this.postsRepository.findAndCount({
      where,
      order: {
        publishedAt: 'DESC',
        createdAt: 'DESC',
      },
      take: limit,
      skip,
    });
    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async findOne(id: string) {
    const post = await this.postsRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException(`Post ${id} not found`);
    }
    return post;
  }

  async update(id: string, dto: UpdatePostDto) {
    if (dto.slug) {
      await this.assertSlugAvailable(dto.slug, id);
    }
    const post = await this.findOne(id);
    const next = this.postsRepository.merge(post, {
      ...dto,
      publishedAt: dto.publishedAt
        ? new Date(dto.publishedAt)
        : post.publishedAt,
    });

    if (Object.prototype.hasOwnProperty.call(dto, 'authorId')) {
      next.author = dto.authorId
        ? await this.getAuthor(dto.authorId)
        : undefined;
    }

    if (Object.prototype.hasOwnProperty.call(dto, 'categoryId')) {
      next.category = dto.categoryId
        ? await this.getCategory(dto.categoryId)
        : undefined;
    }

    return this.postsRepository.save(next);
  }

  async remove(id: string) {
    const post = await this.findOne(id);
    await this.postsRepository.remove(post);
  }

  async findBySlug(slug: string) {
    return this.postsRepository.findOne({
      where: { slug },
    });
  }

  async findPublished(limit = 20) {
    return this.postsRepository.find({
      where: { status: PostStatus.PUBLISHED },
      order: { publishedAt: 'DESC', createdAt: 'DESC' },
      take: limit,
    });
  }

  private async assertSlugAvailable(slug: string, currentId?: string) {
    const existing = await this.postsRepository.findOne({
      where: { slug },
    });
    if (existing && existing.id !== currentId) {
      throw new BadRequestException(`Slug "${slug}" sudah digunakan`);
    }
  }

  private async getAuthor(id: string) {
    const author = await this.authorsRepository.findOne({ where: { id } });
    if (!author) {
      throw new NotFoundException(`Author ${id} not found`);
    }
    return author;
  }

  private async getCategory(id: string) {
    const category = await this.categoriesRepository.findOne({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException(`Category ${id} not found`);
    }
    return category;
  }
}
