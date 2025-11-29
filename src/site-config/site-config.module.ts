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
import { ApiKeyGuard } from '../common/guards/api-key.guard';

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
  providers: [SiteConfigService, ApiKeyGuard],
  exports: [SiteConfigService],
})
export class SiteConfigModule {}
