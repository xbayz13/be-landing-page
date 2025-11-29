import { SiteConfigService } from './site-config.service';
import type { LandingConfig } from './site-config.service';

const createMock = <T extends object>(methods: (keyof T)[]): T => {
  const mock: Partial<Record<keyof T, jest.Mock>> = {};
  methods.forEach((method) => {
    mock[method] = jest.fn();
  });
  return mock as T;
};

describe('SiteConfigService', () => {
  const aggregatorService = createMock<{ getLandingConfig: () => Promise<LandingConfig> }>([
    'getLandingConfig',
  ]);
  const brandService = createMock<{ getBrand: () => Promise<unknown>; upsertBrand: (dto: unknown) => Promise<unknown> }>([
    'getBrand',
    'upsertBrand',
  ]);
  const heroService = createMock<{ getHero: () => Promise<unknown>; upsertHero: (dto: unknown) => Promise<unknown> }>([
    'getHero',
    'upsertHero',
  ]);
  const navigationService = createMock<{
    listNavigation: () => Promise<unknown>;
    createNavigation: (dto: unknown) => Promise<unknown>;
    updateNavigation: (id: string, dto: unknown) => Promise<unknown>;
    removeNavigation: (id: string) => Promise<void>;
  }>(['listNavigation', 'createNavigation', 'updateNavigation', 'removeNavigation']);
  const featureService = createMock<{
    listFeatures: () => Promise<unknown>;
    createFeature: (dto: unknown) => Promise<unknown>;
    updateFeature: (id: string, dto: unknown) => Promise<unknown>;
    removeFeature: (id: string) => Promise<void>;
  }>(['listFeatures', 'createFeature', 'updateFeature', 'removeFeature']);
  const testimonialService = createMock<{
    listTestimonials: () => Promise<unknown>;
    createTestimonial: (dto: unknown) => Promise<unknown>;
    updateTestimonial: (id: string, dto: unknown) => Promise<unknown>;
    removeTestimonial: (id: string) => Promise<void>;
  }>(['listTestimonials', 'createTestimonial', 'updateTestimonial', 'removeTestimonial']);
  const ctaService = createMock<{
    listCtas: () => Promise<unknown>;
    createCta: (dto: unknown) => Promise<unknown>;
    updateCta: (id: string, dto: unknown) => Promise<unknown>;
    removeCta: (id: string) => Promise<void>;
  }>(['listCtas', 'createCta', 'updateCta', 'removeCta']);
  const footerLinkService = createMock<{
    listFooterLinks: () => Promise<unknown>;
    createFooterLink: (dto: unknown) => Promise<unknown>;
    updateFooterLink: (id: string, dto: unknown) => Promise<unknown>;
    removeFooterLink: (id: string) => Promise<void>;
  }>(['listFooterLinks', 'createFooterLink', 'updateFooterLink', 'removeFooterLink']);

  let service: SiteConfigService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new SiteConfigService(
      aggregatorService,
      brandService,
      heroService,
      navigationService,
      featureService,
      testimonialService,
      ctaService,
      footerLinkService,
    );
  });

  it('mengambil landing config dari aggregator', async () => {
    const config = {
      brand: null,
      hero: null,
      navigation: [],
      features: [],
      testimonials: [],
      callsToAction: [],
      footerLinks: [],
    } satisfies LandingConfig;
    aggregatorService.getLandingConfig.mockResolvedValue(config);

    const result = await service.getLandingConfig();

    expect(aggregatorService.getLandingConfig).toHaveBeenCalled();
    expect(result).toBe(config);
  });

  it('mendelegasikan operasi brand', async () => {
    const dto = { companyName: 'New Brand' };
    await service.upsertBrand(dto);
    expect(brandService.upsertBrand).toHaveBeenCalledWith(dto);

    await service.getBrand();
    expect(brandService.getBrand).toHaveBeenCalled();
  });

  it('mendelegasikan operasi hero', async () => {
    const dto = { heading: 'Grow' };
    await service.upsertHero(dto);
    expect(heroService.upsertHero).toHaveBeenCalledWith(dto);

    await service.getHero();
    expect(heroService.getHero).toHaveBeenCalled();
  });

  it('mendelegasikan operasi navigation', async () => {
    await service.listNavigation();
    expect(navigationService.listNavigation).toHaveBeenCalled();

    const createDto = { label: 'Home' };
    await service.createNavigation(createDto as never);
    expect(navigationService.createNavigation).toHaveBeenCalledWith(createDto);

    await service.updateNavigation('nav-id', { label: 'About' } as never);
    expect(navigationService.updateNavigation).toHaveBeenCalledWith('nav-id', { label: 'About' });

    await service.removeNavigation('nav-id');
    expect(navigationService.removeNavigation).toHaveBeenCalledWith('nav-id');
  });

  it('mendelegasikan operasi features', async () => {
    await service.listFeatures();
    expect(featureService.listFeatures).toHaveBeenCalled();

    await service.createFeature({ title: 'Automation' } as never);
    expect(featureService.createFeature).toHaveBeenCalled();

    await service.updateFeature('feature-id', { title: 'AI' } as never);
    expect(featureService.updateFeature).toHaveBeenCalledWith('feature-id', { title: 'AI' });

    await service.removeFeature('feature-id');
    expect(featureService.removeFeature).toHaveBeenCalledWith('feature-id');
  });

  it('mendelegasikan operasi testimonials, CTA, dan footer links', async () => {
    await service.listTestimonials();
    expect(testimonialService.listTestimonials).toHaveBeenCalled();
    await service.createTestimonial({ quote: 'Great!' } as never);
    expect(testimonialService.createTestimonial).toHaveBeenCalled();

    await service.listCtas();
    expect(ctaService.listCtas).toHaveBeenCalled();
    await service.createCta({ heading: 'Get started' } as never);
    expect(ctaService.createCta).toHaveBeenCalled();

    await service.listFooterLinks();
    expect(footerLinkService.listFooterLinks).toHaveBeenCalled();
    await service.createFooterLink({ label: 'Docs' } as never);
    expect(footerLinkService.createFooterLink).toHaveBeenCalled();
  });
});
