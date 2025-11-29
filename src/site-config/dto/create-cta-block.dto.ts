import { IsEnum, IsOptional, IsString, IsUrl, Length } from 'class-validator';
import { CtaVariant } from '../entities/call-to-action-block.entity';

export class CreateCtaBlockDto {
  @IsOptional()
  @IsString()
  @Length(2, 60)
  eyebrow?: string;

  @IsString()
  @Length(4, 160)
  heading: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsString()
  @Length(2, 60)
  buttonLabel?: string;

  @IsOptional()
  @IsUrl()
  buttonUrl?: string;

  @IsOptional()
  @IsEnum(CtaVariant)
  variant?: CtaVariant;
}
