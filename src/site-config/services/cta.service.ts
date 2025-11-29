import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CallToActionBlock,
  CtaVariant,
} from '../entities/call-to-action-block.entity';
import { CreateCtaBlockDto } from '../dto/create-cta-block.dto';
import { UpdateCtaBlockDto } from '../dto/update-cta-block.dto';

@Injectable()
export class CtaService {
  constructor(
    @InjectRepository(CallToActionBlock)
    private readonly ctaRepository: Repository<CallToActionBlock>,
  ) {}

  async listCtas(): Promise<CallToActionBlock[]> {
    return this.ctaRepository.find();
  }

  async createCta(dto: CreateCtaBlockDto): Promise<CallToActionBlock> {
    const block = this.ctaRepository.create({
      variant: dto.variant ?? CtaVariant.SOLID,
      ...dto,
    });
    return this.ctaRepository.save(block);
  }

  async updateCta(id: string, dto: UpdateCtaBlockDto): Promise<CallToActionBlock> {
    const block = await this.ctaRepository.preload({
      id,
      ...dto,
    });
    if (!block) {
      throw new NotFoundException(`CTA block ${id} not found`);
    }
    return this.ctaRepository.save(block);
  }

  async removeCta(id: string): Promise<void> {
    const block = await this.ctaRepository.findOne({ where: { id } });
    if (!block) {
      throw new NotFoundException(`CTA block ${id} not found`);
    }
    await this.ctaRepository.remove(block);
  }
}

