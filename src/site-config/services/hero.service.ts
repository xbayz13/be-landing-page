import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HeroSection, HeroMediaType } from '../entities/hero-section.entity';
import { UpsertHeroSectionDto } from '../dto/upsert-hero-section.dto';

@Injectable()
export class HeroService {
  constructor(
    @InjectRepository(HeroSection)
    private readonly heroRepository: Repository<HeroSection>,
  ) {}

  async getHero(): Promise<HeroSection | null> {
    const [record] = await this.heroRepository.find({ take: 1 });
    return record ?? null;
  }

  async upsertHero(dto: UpsertHeroSectionDto): Promise<HeroSection> {
    const existing = await this.getHero();
    if (existing) {
      const updated = this.heroRepository.merge(existing, dto);
      return this.heroRepository.save(updated);
    }
    const hero = this.heroRepository.create({
      mediaType: dto.mediaType ?? HeroMediaType.IMAGE,
      ...dto,
    });
    return this.heroRepository.save(hero);
  }
}

