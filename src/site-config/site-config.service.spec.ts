import { Repository } from 'typeorm';
import { SiteConfigService } from './site-config.service';
import { BrandSetting } from './entities/brand-setting.entity';
import { HeroMediaType, HeroSection } from './entities/hero-section.entity';
import { NavigationLink } from './entities/navigation-link.entity';
import { Feature } from './entities/feature.entity';
import { Testimonial } from './entities/testimonial.entity';
import { CallToActionBlock } from './entities/call-to-action-block.entity';
import { FooterLink } from './entities/footer-link.entity';

type MockRepository = {
  find: jest.Mock;
  create: jest.Mock;
  save: jest.Mock;
  merge: jest.Mock;
  remove: jest.Mock;
};

const createMockRepository = (): MockRepository => ({
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  merge: jest.fn(),
  remove: jest.fn(),
});

describe('SiteConfigService', () => {
  let service: SiteConfigService;
  let brandRepository: MockRepository;
  let navigationRepository: MockRepository;
  let heroRepository: MockRepository;
  let featureRepository: MockRepository;
  let testimonialRepository: MockRepository;
  let ctaRepository: MockRepository;
  let footerRepository: MockRepository;

  beforeEach(() => {
    brandRepository = createMockRepository();
    navigationRepository = createMockRepository();
    heroRepository = createMockRepository();
    featureRepository = createMockRepository();
    testimonialRepository = createMockRepository();
    ctaRepository = createMockRepository();
    footerRepository = createMockRepository();

    service = new SiteConfigService(
      brandRepository as unknown as Repository<BrandSetting>,
      navigationRepository as unknown as Repository<NavigationLink>,
      heroRepository as unknown as Repository<HeroSection>,
      featureRepository as unknown as Repository<Feature>,
      testimonialRepository as unknown as Repository<Testimonial>,
      ctaRepository as unknown as Repository<CallToActionBlock>,
      footerRepository as unknown as Repository<FooterLink>,
    );
  });

  it('upserts brand by updating existing record', async () => {
    const existingBrand = {
      id: 'brand-1',
      companyName: 'Old Brand',
    } as BrandSetting;
    const dto = {
      companyName: 'New Brand',
      headingFont: 'Inter',
    };

    brandRepository.find.mockResolvedValue([existingBrand]);
    const mergedBrand = { ...existingBrand, ...dto } as BrandSetting;
    brandRepository.merge.mockReturnValue(mergedBrand);
    brandRepository.save.mockResolvedValue(mergedBrand);

    const result = await service.upsertBrand(dto);

    expect(brandRepository.merge).toHaveBeenCalledWith(existingBrand, dto);
    expect(result).toEqual(mergedBrand);
  });

  it('creates navigation link with sane defaults', async () => {
    const createdLink = { id: 'nav-1' } as NavigationLink;
    navigationRepository.create.mockImplementation(
      (payload: Partial<NavigationLink>) =>
        ({
          ...payload,
        }) as NavigationLink,
    );
    navigationRepository.save.mockResolvedValue(createdLink);

    const dto = { label: 'Home', url: '/' };
    const result = await service.createNavigation(dto);

    expect(navigationRepository.create).toHaveBeenCalledWith({
      label: dto.label,
      url: dto.url,
      position: 0,
      isPrimary: false,
      isExternal: false,
    });
    expect(result).toEqual(createdLink);
  });

  it('upserts hero section with image as default media type', async () => {
    heroRepository.find.mockResolvedValue([]);
    const createdHero = {
      id: 'hero-1',
      heading: 'Grow faster',
      mediaType: HeroMediaType.IMAGE,
    } as HeroSection;
    heroRepository.create.mockImplementation(
      (payload: Partial<HeroSection>) =>
        ({
          ...payload,
        }) as HeroSection,
    );
    heroRepository.save.mockResolvedValue(createdHero);

    const result = await service.upsertHero({
      heading: 'Grow faster',
    });

    expect(heroRepository.create).toHaveBeenCalledWith({
      heading: 'Grow faster',
      mediaType: HeroMediaType.IMAGE,
    });
    expect(result).toEqual(createdHero);
  });
});
