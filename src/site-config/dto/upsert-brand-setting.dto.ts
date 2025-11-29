import { IsOptional, IsString, IsUrl, Length, Matches } from 'class-validator';

const HEX_COLOR_REGEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export class UpsertBrandSettingDto {
  @IsString()
  @Length(2, 150)
  companyName: string;

  @IsOptional()
  @IsString()
  @Length(2, 160)
  tagline?: string;

  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @IsOptional()
  @IsUrl()
  faviconUrl?: string;

  @IsOptional()
  @Matches(HEX_COLOR_REGEX, {
    message: 'primaryColor must be a valid hex color (e.g. #0f172a)',
  })
  primaryColor?: string;

  @IsOptional()
  @Matches(HEX_COLOR_REGEX, {
    message: 'secondaryColor must be a valid hex color',
  })
  secondaryColor?: string;

  @IsOptional()
  @Matches(HEX_COLOR_REGEX, {
    message: 'accentColor must be a valid hex color',
  })
  accentColor?: string;

  @IsOptional()
  @IsString()
  @Length(2, 80)
  headingFont?: string;

  @IsOptional()
  @IsString()
  @Length(2, 80)
  bodyFont?: string;
}
