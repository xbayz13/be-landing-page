import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Length,
  Matches,
  Min,
} from 'class-validator';
import { PostStatus } from '../entities/post.entity';

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export class CreatePostDto {
  @IsString()
  @Length(4, 160)
  title: string;

  @IsString()
  @Length(4, 160)
  @Matches(SLUG_REGEX)
  slug: string;

  @IsOptional()
  @IsString()
  @Length(10, 220)
  excerpt?: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsUrl()
  coverImageUrl?: string;

  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;

  @IsOptional()
  @IsDateString()
  publishedAt?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  readingTimeMinutes?: number;

  @IsOptional()
  @IsString()
  @Length(4, 160)
  seoTitle?: string;

  @IsOptional()
  @IsString()
  @Length(10, 220)
  seoDescription?: string;

  @IsOptional()
  @IsUUID('4')
  authorId?: string;

  @IsOptional()
  @IsUUID('4')
  categoryId?: string;
}
