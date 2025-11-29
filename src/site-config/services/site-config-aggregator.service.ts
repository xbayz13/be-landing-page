import { Injectable } from '@nestjs/common';
import { BrandService } from './brand.service';
import { HeroService } from './hero.service';
import { NavigationService } from './navigation.service';
import { FeatureService } from './feature.service';
import { TestimonialService } from './testimonial.service';
import { CtaService } from './cta.service';
import { FooterLinkService } from './footer-link.service';
import type { BrandSetting } from '../entities/brand-setting.entity';
import type { HeroSection } from '../entities/hero-section.entity';
import type { NavigationLink } from '../entities/navigation-link.entity';
import type { Feature } from '../entities/feature.entity';
import type { Testimonial } from '../entities/testimonial.entity';
import type { CallToActionBlock } from '../entities/call-to-action-block.entity';
import type { FooterLink } from '../entities/footer-link.entity';

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
export class SiteConfigAggregatorService {
  constructor(
    private readonly brandService: BrandService,
    private readonly heroService: HeroService,
    private readonly navigationService: NavigationService,
    private readonly featureService: FeatureService,
    private readonly testimonialService: TestimonialService,
    private readonly ctaService: CtaService,
    private readonly footerLinkService: FooterLinkService,
  ) {}

  async getLandingConfig(): Promise<LandingConfig> {
    const [brand, hero, navigation, features, testimonials, callsToAction, footerLinks] =
      await Promise.all([
        this.brandService.getBrand(),
        this.heroService.getHero(),
        this.navigationService.listNavigation(),
        this.featureService.listFeatures(),
        this.testimonialService.listTestimonials(),
        this.ctaService.listCtas(),
        this.footerLinkService.listFooterLinks(),
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
}

