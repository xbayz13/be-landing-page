import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NavigationLink } from '../entities/navigation-link.entity';
import { CreateNavigationLinkDto } from '../dto/create-navigation-link.dto';
import { UpdateNavigationLinkDto } from '../dto/update-navigation-link.dto';

@Injectable()
export class NavigationService {
  constructor(
    @InjectRepository(NavigationLink)
    private readonly navigationRepository: Repository<NavigationLink>,
  ) {}

  async listNavigation(): Promise<NavigationLink[]> {
    return this.navigationRepository.find({
      order: { position: 'ASC', label: 'ASC' },
    });
  }

  async createNavigation(dto: CreateNavigationLinkDto): Promise<NavigationLink> {
    const link = this.navigationRepository.create({
      isPrimary: dto.isPrimary ?? false,
      isExternal: dto.isExternal ?? false,
      position: dto.position ?? 0,
      ...dto,
    });
    return this.navigationRepository.save(link);
  }

  async updateNavigation(
    id: string,
    dto: UpdateNavigationLinkDto,
  ): Promise<NavigationLink> {
    const link = await this.navigationRepository.preload({
      id,
      ...dto,
    });
    if (!link) {
      throw new NotFoundException(`Navigation link ${id} not found`);
    }
    return this.navigationRepository.save(link);
  }

  async removeNavigation(id: string): Promise<void> {
    const link = await this.navigationRepository.findOne({ where: { id } });
    if (!link) {
      throw new NotFoundException(`Navigation link ${id} not found`);
    }
    await this.navigationRepository.remove(link);
  }
}

