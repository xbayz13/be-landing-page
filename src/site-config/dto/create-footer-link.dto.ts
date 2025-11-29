import { IsInt, IsOptional, IsString, Length, Min } from 'class-validator';

export class CreateFooterLinkDto {
  @IsString()
  @Length(2, 60)
  label: string;

  @IsString()
  @Length(1, 255)
  url: string;

  @IsString()
  @Length(2, 60)
  groupName: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;
}
