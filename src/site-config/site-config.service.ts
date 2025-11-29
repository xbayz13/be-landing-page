import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCtaBlockDto } from './dto/create-cta-block.dto';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { CreateFooterLinkDto } from './dto/create-footer-link.dto';
import { CreateNavigationLinkDto } from './dto/create-navigation-link.dto';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateCtaBlockDto } from './dto/update-cta-block.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { UpdateFooterLinkDto } from './dto/update-footer-link.dto';
import { UpdateNavigationLinkDto } from './dto/update-navigation-link.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { UpsertBrandSettingDto } from './dto/upsert-brand-setting.dto';
import { UpsertHeroSectionDto } from './dto/upsert-hero-section.dto';
import { BrandSetting } from './entities/brand-setting.entity';
import {
  CallToActionBlock,
  CtaVariant,
} from './entities/call-to-action-block.entity';
import { Feature } from './entities/feature.entity';
import { FooterLink } from './entities/footer-link.entity';
import { HeroMediaType, HeroSection } from './entities/hero-section.entity';
import { NavigationLink } from './entities/navigation-link.entity';
import { Testimonial } from './entities/testimonial.entity';

export type LandingConfig = {
  brand: BrandSetting | null;
  hero: HeroSection | null;
  navigation: NavigationLink[];
  features: Feature[];
  testimonials: Testimonial[];
  callsToAction: CallToActionBlock[];
  footerLinks: FooterLink[];
};

@Injectable()
export class SiteConfigService {
  constructor(
    @InjectRepository(BrandSetting)
    private readonly brandRepository: Repository<BrandSetting>,
    @InjectRepository(NavigationLink)
    private readonly navigationRepository: Repository<NavigationLink>,
    @InjectRepository(HeroSection)
    private readonly heroRepository: Repository<HeroSection>,
    @InjectRepository(Feature)
    private readonly featureRepository: Repository<Feature>,
    @InjectRepository(Testimonial)
    private readonly testimonialRepository: Repository<Testimonial>,
    @InjectRepository(CallToActionBlock)
    private readonly ctaRepository: Repository<CallToActionBlock>,
    @InjectRepository(FooterLink)
    private readonly footerRepository: Repository<FooterLink>,
  ) {}

  async getLandingConfig(): Promise<LandingConfig> {
    const [brand, hero] = await Promise.all([this.getBrand(), this.getHero()]);

    const [navigation, features, testimonials, callsToAction, footerLinks] =
      await Promise.all([
        this.navigationRepository.find({
          order: { position: 'ASC', label: 'ASC' },
        }),
        this.featureRepository.find({
          order: { highlightOrder: 'ASC', title: 'ASC' },
        }),
        this.testimonialRepository.find({
          order: { featured: 'DESC', authorName: 'ASC' },
        }),
        this.ctaRepository.find(),
        this.footerRepository.find({
          order: { groupName: 'ASC', position: 'ASC' },
        }),
      ]);

    return {
      brand,
      hero,
      navigation,
      features,
      testimonials,
      callsToAction,
      footerLinks,
    };
  }

  async getBrand(): Promise<BrandSetting | null> {
    const [record] = await this.brandRepository.find({ take: 1 });
    return record ?? null;
  }

  async upsertBrand(dto: UpsertBrandSettingDto) {
    const existing = await this.getBrand();
    if (existing) {
      const updated = this.brandRepository.merge(existing, dto);
      return this.brandRepository.save(updated);
    }
    const brand = this.brandRepository.create(dto);
    return this.brandRepository.save(brand);
  }

  async getHero(): Promise<HeroSection | null> {
    const [record] = await this.heroRepository.find({ take: 1 });
    return record ?? null;
  }

  async upsertHero(dto: UpsertHeroSectionDto) {
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

  async listNavigation() {
    return this.navigationRepository.find({
      order: { position: 'ASC', label: 'ASC' },
    });
  }

  async createNavigation(dto: CreateNavigationLinkDto) {
    const link = this.navigationRepository.create({
      isPrimary: dto.isPrimary ?? false,
      isExternal: dto.isExternal ?? false,
      position: dto.position ?? 0,
      ...dto,
    });
    return this.navigationRepository.save(link);
  }

  async updateNavigation(id: string, dto: UpdateNavigationLinkDto) {
    const link = await this.navigationRepository.preload({
      id,
      ...dto,
    });
    if (!link) {
      throw new NotFoundException(`Navigation link ${id} not found`);
    }
    return this.navigationRepository.save(link);
  }

  async removeNavigation(id: string) {
    const link = await this.navigationRepository.findOne({ where: { id } });
    if (!link) {
      throw new NotFoundException(`Navigation link ${id} not found`);
    }
    await this.navigationRepository.remove(link);
  }

  async listFeatures() {
    return this.featureRepository.find({
      order: { highlightOrder: 'ASC', title: 'ASC' },
    });
  }

  async createFeature(dto: CreateFeatureDto) {
    const feature = this.featureRepository.create({
      highlightOrder: dto.highlightOrder ?? 0,
      ...dto,
    });
    return this.featureRepository.save(feature);
  }

  async updateFeature(id: string, dto: UpdateFeatureDto) {
    const feature = await this.featureRepository.preload({
      id,
      ...dto,
    });
    if (!feature) {
      throw new NotFoundException(`Feature ${id} not found`);
    }
    return this.featureRepository.save(feature);
  }

  async removeFeature(id: string) {
    const feature = await this.featureRepository.findOne({ where: { id } });
    if (!feature) {
      throw new NotFoundException(`Feature ${id} not found`);
    }
    await this.featureRepository.remove(feature);
  }

  async listTestimonials() {
    return this.testimonialRepository.find({
      order: { featured: 'DESC', authorName: 'ASC' },
    });
  }

  async createTestimonial(dto: CreateTestimonialDto) {
    const testimonial = this.testimonialRepository.create({
      featured: dto.featured ?? false,
      ...dto,
    });
    return this.testimonialRepository.save(testimonial);
  }

  async updateTestimonial(id: string, dto: UpdateTestimonialDto) {
    const testimonial = await this.testimonialRepository.preload({
      id,
      ...dto,
    });
    if (!testimonial) {
      throw new NotFoundException(`Testimonial ${id} not found`);
    }
    return this.testimonialRepository.save(testimonial);
  }

  async removeTestimonial(id: string) {
    const testimonial = await this.testimonialRepository.findOne({
      where: { id },
    });
    if (!testimonial) {
      throw new NotFoundException(`Testimonial ${id} not found`);
    }
    await this.testimonialRepository.remove(testimonial);
  }

  async listCtas() {
    return this.ctaRepository.find();
  }

  async createCta(dto: CreateCtaBlockDto) {
    const block = this.ctaRepository.create({
      variant: dto.variant ?? CtaVariant.SOLID,
      ...dto,
    });
    return this.ctaRepository.save(block);
  }

  async updateCta(id: string, dto: UpdateCtaBlockDto) {
    const block = await this.ctaRepository.preload({
      id,
      ...dto,
    });
    if (!block) {
      throw new NotFoundException(`CTA block ${id} not found`);
    }
    return this.ctaRepository.save(block);
  }

  async removeCta(id: string) {
    const block = await this.ctaRepository.findOne({ where: { id } });
    if (!block) {
      throw new NotFoundException(`CTA block ${id} not found`);
    }
    await this.ctaRepository.remove(block);
  }

  async listFooterLinks() {
    return this.footerRepository.find({
      order: { groupName: 'ASC', position: 'ASC' },
    });
  }

  async createFooterLink(dto: CreateFooterLinkDto) {
    const link = this.footerRepository.create({
      position: dto.position ?? 0,
      ...dto,
    });
    return this.footerRepository.save(link);
  }

  async updateFooterLink(id: string, dto: UpdateFooterLinkDto) {
    const link = await this.footerRepository.preload({
      id,
      ...dto,
    });
    if (!link) {
      throw new NotFoundException(`Footer link ${id} not found`);
    }
    return this.footerRepository.save(link);
  }

  async removeFooterLink(id: string) {
    const link = await this.footerRepository.findOne({ where: { id } });
    if (!link) {
      throw new NotFoundException(`Footer link ${id} not found`);
    }
    await this.footerRepository.remove(link);
  }
}
