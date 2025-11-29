import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Author } from './author.entity';
import { Category } from './category.entity';

export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

@Entity({ name: 'blog_posts' })
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 160 })
  title: string;

  @Column({ length: 160, unique: true })
  slug: string;

  @Column({ length: 220, nullable: true })
  excerpt?: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ length: 255, nullable: true })
  coverImageUrl?: string;

  @Column({ type: 'enum', enum: PostStatus, default: PostStatus.DRAFT })
  status: PostStatus;

  @Column({ type: 'timestamp with time zone', nullable: true })
  publishedAt?: Date;

  @Column({ type: 'int', nullable: true })
  readingTimeMinutes?: number;

  @Column({ length: 160, nullable: true })
  seoTitle?: string;

  @Column({ length: 220, nullable: true })
  seoDescription?: string;

  @ManyToOne(() => Category, (category) => category.posts, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'category_id' })
  category?: Category;

  @ManyToOne(() => Author, (author) => author.posts, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'author_id' })
  author?: Author;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
