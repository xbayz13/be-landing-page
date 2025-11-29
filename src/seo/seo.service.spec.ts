import { ConfigService } from '@nestjs/config';
import { PostStatus } from '../blog/entities/post.entity';
import { SeoService } from './seo.service';

describe('SeoService', () => {
  let service: SeoService;
  let configService: ConfigService;
  let siteConfigService: {
    getLandingConfig: jest.Mock;
  };
  let postsService: {
    findBySlug: jest.Mock;
    findPublished: jest.Mock;
  };

  const landingConfigMock = {
    brand: {
      companyName: 'Acme Corp',
      tagline: 'Innovate daily',
      logoUrl: 'https://cdn.example.com/logo.png',
    },
    hero: {
      heading: 'Level up',
      subheading: 'Build faster',
      mediaUrl: 'https://cdn.example.com/hero.png',
    },
    navigation: [
      { url: '/', isExternal: false },
      { url: '/about', isExternal: false },
      { url: 'https://external.com', isExternal: true },
    ],
    features: [],
    testimonials: [],
    callsToAction: [],
    footerLinks: [],
  };

  beforeEach(() => {
    configService = {
      get: jest.fn().mockReturnValue('http://localhost:3000'),
    } as unknown as ConfigService;
    siteConfigService = {
      getLandingConfig: jest.fn().mockResolvedValue(landingConfigMock),
    };
    postsService = {
      findBySlug: jest.fn(),
      findPublished: jest.fn().mockResolvedValue([
        {
          id: 'post-1',
          slug: 'hello-world',
          title: 'Hello World',
          status: PostStatus.PUBLISHED,
          seoDescription: 'desc',
          createdAt: new Date('2024-01-01T00:00:00Z'),
          publishedAt: new Date('2024-01-02T00:00:00Z'),
        },
      ]),
    };

    service = new SeoService(
      configService,
      siteConfigService as never,
      postsService as never,
    );
  });

  it('returns default metadata when slug not provided', async () => {
    const metadata = await service.getMetadata();
    expect(metadata).toMatchObject({
      title: landingConfigMock.brand.companyName,
      description: landingConfigMock.hero.subheading,
      url: 'http://localhost:3000',
      image: landingConfigMock.brand.logoUrl,
      type: 'website',
    });
  });

  it('returns article metadata when slug matches published post', async () => {
    postsService.findBySlug.mockResolvedValue({
      id: 'post-1',
      slug: 'hello-world',
      title: 'Post Title',
      seoTitle: 'SEO Title',
      seoDescription: 'SEO Desc',
      status: PostStatus.PUBLISHED,
      excerpt: 'Excerpt',
      coverImageUrl: 'https://cdn.example.com/cover.jpg',
    });

    const metadata = await service.getMetadata('hello-world');
    expect(metadata).toEqual({
      title: 'SEO Title',
      description: 'SEO Desc',
      url: 'http://localhost:3000/blog/hello-world',
      image: 'https://cdn.example.com/cover.jpg',
      type: 'article',
    });
  });

  it('falls back to default metadata when post not published', async () => {
    postsService.findBySlug.mockResolvedValue({
      id: 'post-1',
      slug: 'hello-world',
      title: 'Post Title',
      status: PostStatus.DRAFT,
    });

    const metadata = await service.getMetadata('hello-world');
    expect(metadata.type).toBe('website');
    expect(metadata.url).toBe('http://localhost:3000');
  });

  it('generates sitemap with navigation and posts', async () => {
    const xml = await service.buildSitemapXml();
    expect(xml).toContain('<loc>http://localhost:3000/</loc>');
    expect(xml).toContain('<loc>http://localhost:3000/about</loc>');
    expect(xml).toContain('<loc>http://localhost:3000/blog/hello-world</loc>');
  });

  it('generates RSS feed with published posts', async () => {
    const rss = await service.buildRssFeed();
    expect(rss).toContain('<rss');
    expect(rss).toContain('<title><![CDATA[Acme Corp]]></title>');
    expect(rss).toContain('<item>');
    expect(rss).toContain(
      '<link>http://localhost:3000/blog/hello-world</link>',
    );
  });
});
