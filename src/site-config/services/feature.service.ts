import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feature } from '../entities/feature.entity';
import { CreateFeatureDto } from '../dto/create-feature.dto';
import { UpdateFeatureDto } from '../dto/update-feature.dto';

@Injectable()
export class FeatureService {
  constructor(
    @InjectRepository(Feature)
    private readonly featureRepository: Repository<Feature>,
  ) {}

  async listFeatures(): Promise<Feature[]> {
    return this.featureRepository.find({
      order: { highlightOrder: 'ASC', title: 'ASC' },
    });
  }

  async createFeature(dto: CreateFeatureDto): Promise<Feature> {
    const feature = this.featureRepository.create({
      highlightOrder: dto.highlightOrder ?? 0,
      ...dto,
    });
    return this.featureRepository.save(feature);
  }

  async updateFeature(id: string, dto: UpdateFeatureDto): Promise<Feature> {
    const feature = await this.featureRepository.preload({
      id,
      ...dto,
    });
    if (!feature) {
      throw new NotFoundException(`Feature ${id} not found`);
    }
    return this.featureRepository.save(feature);
  }

  async removeFeature(id: string): Promise<void> {
    const feature = await this.featureRepository.findOne({ where: { id } });
    if (!feature) {
      throw new NotFoundException(`Feature ${id} not found`);
    }
    await this.featureRepository.remove(feature);
  }
}

