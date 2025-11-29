import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BlogModule } from '../blog/blog.module';
import { SiteConfigModule } from '../site-config/site-config.module';
import { SeoController } from './seo.controller';
import { SeoService } from './seo.service';

@Module({
  imports: [ConfigModule, SiteConfigModule, BlogModule],
  controllers: [SeoController],
  providers: [SeoService],
})
export class SeoModule {}
