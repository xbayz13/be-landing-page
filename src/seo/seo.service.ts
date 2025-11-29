import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PostsService } from '../blog/posts.service';
import { PostStatus } from '../blog/entities/post.entity';
import { SiteConfigService } from '../site-config/site-config.service';

type Metadata = {
  title: string;
  description: string;
  url: string;
  image?: string;
  type: 'website' | 'article';
};

@Injectable()
export class SeoService {
  constructor(
    private readonly configService: ConfigService,
    private readonly siteConfigService: SiteConfigService,
    private readonly postsService: PostsService,
  ) {}

  async getMetadata(postSlug?: string): Promise<Metadata> {
    const baseUrl = this.configService.get<string>('app.baseUrl', '');
    const landing = await this.siteConfigService.getLandingConfig();
    const defaultTitle =
      landing.brand?.companyName ??
      landing.hero?.heading ??
      'Company Landing Page';
    const defaultDescription =
      landing.hero?.subheading ??
      landing.brand?.tagline ??
      'Platform landing page';
    const defaultMeta: Metadata = {
      title: defaultTitle,
      description: defaultDescription,
      url: baseUrl,
      image: landing.brand?.logoUrl ?? landing.hero?.mediaUrl,
      type: 'website',
    };

    if (!postSlug) {
      return defaultMeta;
    }

    const post = await this.postsService.findBySlug(postSlug);
    if (!post || post.status !== PostStatus.PUBLISHED) {
      return defaultMeta;
    }

    return {
      title: post.seoTitle ?? post.title,
      description: post.seoDescription ?? post.excerpt ?? defaultDescription,
      url: `${baseUrl}/blog/${post.slug}`,
      image: post.coverImageUrl ?? defaultMeta.image,
      type: 'article',
    };
  }

  async buildSitemapXml() {
    const baseUrl = this.configService.get<string>('app.baseUrl', '');
    const landing = await this.siteConfigService.getLandingConfig();
    const navigationUrls = landing.navigation
      .filter((nav) => !nav.isExternal)
      .map((nav) => nav.url)
      .filter(Boolean);

    const posts = await this.postsService.findPublished(100);

    const urls = new Set<string>([
      '/',
      '/blog',
      ...navigationUrls,
      ...posts.map((post) => `/blog/${post.slug}`),
    ]);

    const body = Array.from(urls)
      .map(
        (path) => `
    <url>
      <loc>${this.normalizeUrl(baseUrl, path)}</loc>
    </url>`,
      )
      .join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${body}
  </urlset>`;
  }

  async buildRssFeed() {
    const baseUrl = this.configService.get<string>('app.baseUrl', '');
    const landing = await this.siteConfigService.getLandingConfig();
    const posts = await this.postsService.findPublished(20);

    const items = posts
      .map(
        (post) => `
      <item>
        <title><![CDATA[${post.title}]]></title>
        <link>${this.normalizeUrl(baseUrl, `/blog/${post.slug}`)}</link>
        <guid>${post.id}</guid>
        <pubDate>${(post.publishedAt ?? post.createdAt).toUTCString()}</pubDate>
        <description><![CDATA[${
          post.seoDescription ?? post.excerpt ?? ''
        }]]></description>
      </item>`,
      )
      .join('');

    return `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title><![CDATA[${
          landing.brand?.companyName ?? 'Landing Page CMS'
        }]]></title>
        <link>${baseUrl}</link>
        <description><![CDATA[${
          landing.brand?.tagline ?? landing.hero?.subheading ?? ''
        }]]></description>
        ${items}
      </channel>
    </rss>`;
  }

  private normalizeUrl(baseUrl: string, path: string) {
    if (!path.startsWith('http')) {
      return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
    }
    return path;
  }
}
