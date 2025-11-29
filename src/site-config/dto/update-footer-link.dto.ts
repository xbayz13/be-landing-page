import { PartialType } from '@nestjs/mapped-types';
import { CreateFooterLinkDto } from './create-footer-link.dto';

export class UpdateFooterLinkDto extends PartialType(CreateFooterLinkDto) {}
