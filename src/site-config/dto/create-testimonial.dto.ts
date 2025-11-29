import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

export class CreateTestimonialDto {
  @IsString()
  quote: string;

  @IsString()
  @Length(2, 80)
  authorName: string;

  @IsOptional()
  @IsString()
  @Length(2, 80)
  authorRole?: string;

  @IsOptional()
  @IsString()
  @Length(2, 80)
  company?: string;

  @IsOptional()
  @IsString()
  @Length(4, 255)
  avatarUrl?: string;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;
}
