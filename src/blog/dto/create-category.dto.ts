import { IsOptional, IsString, Length, Matches } from 'class-validator';

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export class CreateCategoryDto {
  @IsString()
  @Length(2, 80)
  name: string;

  @IsString()
  @Length(2, 80)
  @Matches(SLUG_REGEX, {
    message:
      'Slug hanya boleh huruf kecil, angka, dan tanda hubung tanpa spasi',
  })
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;
}
