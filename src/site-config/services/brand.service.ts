import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BrandSetting } from '../entities/brand-setting.entity';
import { UpsertBrandSettingDto } from '../dto/upsert-brand-setting.dto';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(BrandSetting)
    private readonly brandRepository: Repository<BrandSetting>,
  ) {}

  async getBrand(): Promise<BrandSetting | null> {
    const [record] = await this.brandRepository.find({ take: 1 });
    return record ?? null;
  }

  async upsertBrand(dto: UpsertBrandSettingDto): Promise<BrandSetting> {
    const existing = await this.getBrand();
    if (existing) {
      const updated = this.brandRepository.merge(existing, dto);
      return this.brandRepository.save(updated);
    }
    const brand = this.brandRepository.create(dto);
    return this.brandRepository.save(brand);
  }
}

