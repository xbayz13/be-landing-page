import { PartialType } from '@nestjs/mapped-types';
import { CreateCtaBlockDto } from './create-cta-block.dto';

export class UpdateCtaBlockDto extends PartialType(CreateCtaBlockDto) {}
