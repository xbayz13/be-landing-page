import { IsEnum, IsOptional, IsString, IsUrl, Length } from 'class-validator';
import { HeroMediaType } from '../entities/hero-section.entity';

export class UpsertHeroSectionDto {
  @IsOptional()
  @IsString()
  @Length(2, 60)
  eyebrow?: string;

  @IsString()
  @Length(4, 160)
  heading: string;

  @IsOptional()
  @IsString()
  subheading?: string;

  @IsOptional()
  @IsString()
  @Length(2, 60)
  primaryCtaLabel?: string;

  @IsOptional()
  @IsUrl()
  primaryCtaUrl?: string;

  @IsOptional()
  @IsString()
  @Length(2, 60)
  secondaryCtaLabel?: string;

  @IsOptional()
  @IsUrl()
  secondaryCtaUrl?: string;

  @IsOptional()
  @IsEnum(HeroMediaType)
  mediaType?: HeroMediaType;

  @IsOptional()
  @IsUrl()
  mediaUrl?: string;
}
