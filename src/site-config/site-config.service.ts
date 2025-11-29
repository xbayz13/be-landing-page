import { Injectable } from '@nestjs/common';
import { BrandService } from './services/brand.service';
import { HeroService } from './services/hero.service';
import { NavigationService } from './services/navigation.service';
import { FeatureService } from './services/feature.service';
import { TestimonialService } from './services/testimonial.service';
import { CtaService } from './services/cta.service';
import { FooterLinkService } from './services/footer-link.service';
import { SiteConfigAggregatorService } from './services/site-config-aggregator.service';
import { UpsertBrandSettingDto } from './dto/upsert-brand-setting.dto';
import { UpsertHeroSectionDto } from './dto/upsert-hero-section.dto';
import { CreateNavigationLinkDto } from './dto/create-navigation-link.dto';
import { UpdateNavigationLinkDto } from './dto/update-navigation-link.dto';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { CreateCtaBlockDto } from './dto/create-cta-block.dto';
import { UpdateCtaBlockDto } from './dto/update-cta-block.dto';
import { CreateFooterLinkDto } from './dto/create-footer-link.dto';
import { UpdateFooterLinkDto } from './dto/update-footer-link.dto';
import type { LandingConfig } from './services/site-config-aggregator.service';

export type { LandingConfig };

/**
 * Facade service that delegates to domain-specific services.
 * Maintains backward compatibility with existing controllers.
 */
@Injectable()
export class SiteConfigService {
  constructor(
    private readonly aggregatorService: SiteConfigAggregatorService,
    private readonly brandService: BrandService,
    private readonly heroService: HeroService,
    private readonly navigationService: NavigationService,
    private readonly featureService: FeatureService,
    private readonly testimonialService: TestimonialService,
    private readonly ctaService: CtaService,
    private readonly footerLinkService: FooterLinkService,
  ) {}

  // Aggregation method
  async getLandingConfig(): Promise<LandingConfig> {
    return this.aggregatorService.getLandingConfig();
  }

  // Brand delegation
  async getBrand() {
    return this.brandService.getBrand();
  }

  async upsertBrand(dto: UpsertBrandSettingDto) {
    return this.brandService.upsertBrand(dto);
  }

  // Hero delegation
  async getHero() {
    return this.heroService.getHero();
  }

  async upsertHero(dto: UpsertHeroSectionDto) {
    return this.heroService.upsertHero(dto);
  }

  // Navigation delegation
  async listNavigation() {
    return this.navigationService.listNavigation();
  }

  async createNavigation(dto: CreateNavigationLinkDto) {
    return this.navigationService.createNavigation(dto);
  }

  async updateNavigation(id: string, dto: UpdateNavigationLinkDto) {
    return this.navigationService.updateNavigation(id, dto);
  }

  async removeNavigation(id: string) {
    return this.navigationService.removeNavigation(id);
  }

  // Feature delegation
  async listFeatures() {
    return this.featureService.listFeatures();
  }

  async createFeature(dto: CreateFeatureDto) {
    return this.featureService.createFeature(dto);
  }

  async updateFeature(id: string, dto: UpdateFeatureDto) {
    return this.featureService.updateFeature(id, dto);
  }

  async removeFeature(id: string) {
    return this.featureService.removeFeature(id);
  }

  // Testimonial delegation
  async listTestimonials() {
    return this.testimonialService.listTestimonials();
  }

  async createTestimonial(dto: CreateTestimonialDto) {
    return this.testimonialService.createTestimonial(dto);
  }

  async updateTestimonial(id: string, dto: UpdateTestimonialDto) {
    return this.testimonialService.updateTestimonial(id, dto);
  }

  async removeTestimonial(id: string) {
    return this.testimonialService.removeTestimonial(id);
  }

  // CTA delegation
  async listCtas() {
    return this.ctaService.listCtas();
  }

  async createCta(dto: CreateCtaBlockDto) {
    return this.ctaService.createCta(dto);
  }

  async updateCta(id: string, dto: UpdateCtaBlockDto) {
    return this.ctaService.updateCta(id, dto);
  }

  async removeCta(id: string) {
    return this.ctaService.removeCta(id);
  }

  // Footer Link delegation
  async listFooterLinks() {
    return this.footerLinkService.listFooterLinks();
  }

  async createFooterLink(dto: CreateFooterLinkDto) {
    return this.footerLinkService.createFooterLink(dto);
  }

  async updateFooterLink(id: string, dto: UpdateFooterLinkDto) {
    return this.footerLinkService.updateFooterLink(id, dto);
  }

  async removeFooterLink(id: string) {
    return this.footerLinkService.removeFooterLink(id);
  }
}
