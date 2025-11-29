import { IsInt, IsOptional, IsString, Length, Min } from 'class-validator';

export class CreateFeatureDto {
  @IsString()
  @Length(3, 80)
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  @Length(2, 60)
  icon?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  highlightOrder?: number;

  @IsOptional()
  @IsString()
  @Length(2, 40)
  pillar?: string;
}
