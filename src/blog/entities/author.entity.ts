import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from './post.entity';

@Entity({ name: 'blog_authors' })
export class Author {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 120 })
  name: string;

  @Column({ length: 120, nullable: true })
  title?: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ length: 255, nullable: true })
  avatarUrl?: string;

  @Column({ length: 255, nullable: true })
  websiteUrl?: string;

  @Column({ length: 255, nullable: true })
  linkedinUrl?: string;

  @Column({ length: 255, nullable: true })
  twitterUrl?: string;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
