import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class CreateNavigationLinkDto {
  @IsString()
  @Length(2, 60)
  label: string;

  @IsString()
  @Length(1, 255)
  url: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @IsOptional()
  @IsBoolean()
  isExternal?: boolean;
}
