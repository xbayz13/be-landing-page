import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FooterLink } from '../entities/footer-link.entity';
import { CreateFooterLinkDto } from '../dto/create-footer-link.dto';
import { UpdateFooterLinkDto } from '../dto/update-footer-link.dto';

@Injectable()
export class FooterLinkService {
  constructor(
    @InjectRepository(FooterLink)
    private readonly footerRepository: Repository<FooterLink>,
  ) {}

  async listFooterLinks(): Promise<FooterLink[]> {
    return this.footerRepository.find({
      order: { groupName: 'ASC', position: 'ASC' },
    });
  }

  async createFooterLink(dto: CreateFooterLinkDto): Promise<FooterLink> {
    const link = this.footerRepository.create({
      position: dto.position ?? 0,
      ...dto,
    });
    return this.footerRepository.save(link);
  }

  async updateFooterLink(
    id: string,
    dto: UpdateFooterLinkDto,
  ): Promise<FooterLink> {
    const link = await this.footerRepository.preload({
      id,
      ...dto,
    });
    if (!link) {
      throw new NotFoundException(`Footer link ${id} not found`);
    }
    return this.footerRepository.save(link);
  }

  async removeFooterLink(id: string): Promise<void> {
    const link = await this.footerRepository.findOne({ where: { id } });
    if (!link) {
      throw new NotFoundException(`Footer link ${id} not found`);
    }
    await this.footerRepository.remove(link);
  }
}

