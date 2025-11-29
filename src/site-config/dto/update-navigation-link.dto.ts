import { PartialType } from '@nestjs/mapped-types';
import { CreateNavigationLinkDto } from './create-navigation-link.dto';

export class UpdateNavigationLinkDto extends PartialType(
  CreateNavigationLinkDto,
) {}
