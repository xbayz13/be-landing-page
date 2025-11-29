import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
import { SiteConfigService } from './site-config.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Site Config')
@Controller('site-config')
export class SiteConfigController {
  constructor(private readonly siteConfigService: SiteConfigService) {}

  @Get()
  getLandingConfig() {
    return this.siteConfigService.getLandingConfig();
  }

  @Get('brand')
  getBrand() {
    return this.siteConfigService.getBrand();
  }

  @UseGuards(JwtAuthGuard)
  @Put('brand')
  upsertBrand(@Body() dto: UpsertBrandSettingDto) {
    return this.siteConfigService.upsertBrand(dto);
  }

  @Get('hero')
  getHero() {
    return this.siteConfigService.getHero();
  }

  @UseGuards(JwtAuthGuard)
  @Put('hero')
  upsertHero(@Body() dto: UpsertHeroSectionDto) {
    return this.siteConfigService.upsertHero(dto);
  }

  @Get('navigation')
  listNavigation() {
    return this.siteConfigService.listNavigation();
  }

  @UseGuards(JwtAuthGuard)
  @Post('navigation')
  createNavigation(@Body() dto: CreateNavigationLinkDto) {
    return this.siteConfigService.createNavigation(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('navigation/:id')
  updateNavigation(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateNavigationLinkDto,
  ) {
    return this.siteConfigService.updateNavigation(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('navigation/:id')
  removeNavigation(@Param('id', ParseUUIDPipe) id: string) {
    return this.siteConfigService.removeNavigation(id);
  }

  @Get('features')
  listFeatures() {
    return this.siteConfigService.listFeatures();
  }

  @UseGuards(JwtAuthGuard)
  @Post('features')
  createFeature(@Body() dto: CreateFeatureDto) {
    return this.siteConfigService.createFeature(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('features/:id')
  updateFeature(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateFeatureDto,
  ) {
    return this.siteConfigService.updateFeature(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('features/:id')
  removeFeature(@Param('id', ParseUUIDPipe) id: string) {
    return this.siteConfigService.removeFeature(id);
  }

  @Get('testimonials')
  listTestimonials() {
    return this.siteConfigService.listTestimonials();
  }

  @UseGuards(JwtAuthGuard)
  @Post('testimonials')
  createTestimonial(@Body() dto: CreateTestimonialDto) {
    return this.siteConfigService.createTestimonial(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('testimonials/:id')
  updateTestimonial(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTestimonialDto,
  ) {
    return this.siteConfigService.updateTestimonial(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('testimonials/:id')
  removeTestimonial(@Param('id', ParseUUIDPipe) id: string) {
    return this.siteConfigService.removeTestimonial(id);
  }

  @Get('cta-blocks')
  listCtas() {
    return this.siteConfigService.listCtas();
  }

  @UseGuards(JwtAuthGuard)
  @Post('cta-blocks')
  createCta(@Body() dto: CreateCtaBlockDto) {
    return this.siteConfigService.createCta(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('cta-blocks/:id')
  updateCta(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCtaBlockDto,
  ) {
    return this.siteConfigService.updateCta(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('cta-blocks/:id')
  removeCta(@Param('id', ParseUUIDPipe) id: string) {
    return this.siteConfigService.removeCta(id);
  }

  @Get('footer-links')
  listFooterLinks() {
    return this.siteConfigService.listFooterLinks();
  }

  @UseGuards(JwtAuthGuard)
  @Post('footer-links')
  createFooterLink(@Body() dto: CreateFooterLinkDto) {
    return this.siteConfigService.createFooterLink(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('footer-links/:id')
  updateFooterLink(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateFooterLinkDto,
  ) {
    return this.siteConfigService.updateFooterLink(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('footer-links/:id')
  removeFooterLink(@Param('id', ParseUUIDPipe) id: string) {
    return this.siteConfigService.removeFooterLink(id);
  }
}
