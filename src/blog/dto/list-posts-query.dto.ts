import { IsEnum, IsInt, IsOptional, IsUUID, Min } from 'class-validator';
import { PostStatus } from '../entities/post.entity';

export class ListPostsQueryDto {
  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;

  @IsOptional()
  @IsUUID('4')
  authorId?: string;

  @IsOptional()
  @IsUUID('4')
  categoryId?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;
}
