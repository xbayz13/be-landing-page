import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteConfigController } from './site-config.controller';
import { SiteConfigService } from './site-config.service';
import { BrandSetting } from './entities/brand-setting.entity';
import { NavigationLink } from './entities/navigation-link.entity';
import { HeroSection } from './entities/hero-section.entity';
import { Feature } from './entities/feature.entity';
import { Testimonial } from './entities/testimonial.entity';
import { CallToActionBlock } from './entities/call-to-action-block.entity';
import { FooterLink } from './entities/footer-link.entity';
import { BrandService } from './services/brand.service';
import { HeroService } from './services/hero.service';
import { NavigationService } from './services/navigation.service';
import { FeatureService } from './services/feature.service';
import { TestimonialService } from './services/testimonial.service';
import { CtaService } from './services/cta.service';
import { FooterLinkService } from './services/footer-link.service';
import { SiteConfigAggregatorService } from './services/site-config-aggregator.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BrandSetting,
      NavigationLink,
      HeroSection,
      Feature,
      Testimonial,
      CallToActionBlock,
      FooterLink,
    ]),
  ],
  controllers: [SiteConfigController],
  providers: [
    // Domain services
    BrandService,
    HeroService,
    NavigationService,
    FeatureService,
    TestimonialService,
    CtaService,
    FooterLinkService,
    // Aggregator
    SiteConfigAggregatorService,
    // Facade (backward compatibility)
    SiteConfigService,
  ],
  exports: [
    SiteConfigService,
    BrandService,
    HeroService,
    NavigationService,
    FeatureService,
    TestimonialService,
    CtaService,
    FooterLinkService,
  ],
})
export class SiteConfigModule {}
