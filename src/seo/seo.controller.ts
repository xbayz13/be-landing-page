import { Controller, Get, Header, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { SeoService } from './seo.service';

@ApiTags('SEO')
@Controller('seo')
export class SeoController {
  constructor(private readonly seoService: SeoService) {}

  @Get('metadata')
  getMetadata(@Query('postSlug') postSlug?: string) {
    return this.seoService.getMetadata(postSlug);
  }

  @Get('sitemap.xml')
  @Header('Content-Type', 'application/xml')
  async getSitemap(@Res() res: Response) {
    const xml = await this.seoService.buildSitemapXml();
    res.send(xml);
  }

  @Get('rss.xml')
  @Header('Content-Type', 'application/rss+xml')
  async getRss(@Res() res: Response) {
    const xml = await this.seoService.buildRssFeed();
    res.send(xml);
  }
}
