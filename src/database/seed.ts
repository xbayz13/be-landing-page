import dataSource from './data-source';
import { BrandSetting } from '../site-config/entities/brand-setting.entity';
import {
  HeroSection,
  HeroMediaType,
} from '../site-config/entities/hero-section.entity';
import { NavigationLink } from '../site-config/entities/navigation-link.entity';
import { Feature } from '../site-config/entities/feature.entity';
import { Testimonial } from '../site-config/entities/testimonial.entity';
import {
  CallToActionBlock,
  CtaVariant,
} from '../site-config/entities/call-to-action-block.entity';
import { FooterLink } from '../site-config/entities/footer-link.entity';
import { Category } from '../blog/entities/category.entity';
import { Author } from '../blog/entities/author.entity';
import { Post, PostStatus } from '../blog/entities/post.entity';

async function seed() {
  await dataSource.initialize();
  try {
    await seedBrand();
    await seedHero();
    await seedNavigation();
    await seedFeatures();
    await seedTestimonials();
    await seedCtas();
    await seedFooter();
    await seedBlog();
    console.log('Seed completed');
  } finally {
    await dataSource.destroy();
  }
}

async function seedBrand() {
  const repo = dataSource.getRepository(BrandSetting);
  const exists = await repo.count();
  if (exists > 0) return;
  await repo.save({
    companyName: 'Landing CMS',
    tagline: 'Build landing pages faster with NestJS + Next.js',
    primaryColor: '#6366f1',
    secondaryColor: '#14b8a6',
    accentColor: '#f472b6',
  });
}

async function seedHero() {
  const repo = dataSource.getRepository(HeroSection);
  const exists = await repo.count();
  if (exists > 0) return;
  await repo.save({
    eyebrow: 'Platform',
    heading: 'Kelola landing page dan blog dari satu CMS',
    subheading:
      'Tim marketing bisa publish konten tanpa bergantung pada developer. Integrasi penuh dengan Next.js.',
    primaryCtaLabel: 'Lihat demo',
    primaryCtaUrl: '#contact',
    secondaryCtaLabel: 'Dokumentasi',
    secondaryCtaUrl: '#features',
    mediaType: HeroMediaType.IMAGE,
    mediaUrl:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
  });
}

async function seedNavigation() {
  const repo = dataSource.getRepository(NavigationLink);
  const exists = await repo.count();
  if (exists > 0) return;
  await repo.save([
    { label: 'Beranda', url: '#top', position: 1, isPrimary: true },
    { label: 'Fitur', url: '#features', position: 2 },
    { label: 'Workflow', url: '#workflow', position: 3 },
    { label: 'Blog', url: '#blog', position: 4 },
    { label: 'Hubungi', url: '#contact', position: 5 },
  ]);
}

async function seedFeatures() {
  const repo = dataSource.getRepository(Feature);
  const exists = await repo.count();
  if (exists > 0) return;
  await repo.save([
    {
      title: 'Site Config',
      description: 'Hero, CTA, testimoni, navigasi diatur dari modul tunggal.',
      icon: '🎛️',
      highlightOrder: 1,
    },
    {
      title: 'Blog workflow',
      description: 'Author, kategori, status, dan SEO metadata siap pakai.',
      icon: '✍️',
      highlightOrder: 2,
    },
    {
      title: 'SEO helper',
      description: 'Endpoint sitemap + RSS + metadata aggregator.',
      icon: '🚀',
      highlightOrder: 3,
    },
    {
      title: 'Headless friendly',
      description:
        'Publikasikan JSON ke Next.js, mobile app, atau channel lain.',
      icon: '🔌',
      highlightOrder: 4,
    },
  ]);
}

async function seedTestimonials() {
  const repo = dataSource.getRepository(Testimonial);
  const exists = await repo.count();
  if (exists > 0) return;
  await repo.save([
    {
      quote:
        'Konten landing page kami sekarang bisa up dalam hitungan menit, bukan hari.',
      authorName: 'Sinta Wijaya',
      authorRole: 'VP Marketing',
      company: 'Nusantara Tech',
      featured: true,
    },
    {
      quote:
        'Integrasi NestJS + Next.js ini bikin developer tenang dan marketer bahagia.',
      authorName: 'Agus Rahman',
      authorRole: 'Head of Engineering',
      company: 'RupaRupa Digital',
    },
  ]);
}

async function seedCtas() {
  const repo = dataSource.getRepository(CallToActionBlock);
  const exists = await repo.count();
  if (exists > 0) return;
  await repo.save({
    eyebrow: 'Mulai sekarang',
    heading: 'Siap merapikan CMS landing page Anda?',
    body: 'Hubungi kami untuk walkthrough integrasi NestJS dan Next.js.',
    buttonLabel: 'Jadwalkan demo',
    buttonUrl: '#contact',
    variant: CtaVariant.SOLID,
  });
}

async function seedFooter() {
  const repo = dataSource.getRepository(FooterLink);
  const exists = await repo.count();
  if (exists > 0) return;
  await repo.save([
    { label: 'Privacy Policy', url: '#', groupName: 'Company', position: 1 },
    { label: 'Terms of Service', url: '#', groupName: 'Company', position: 2 },
    { label: 'Status', url: '#', groupName: 'Resources', position: 1 },
    { label: 'API Docs', url: '#', groupName: 'Resources', position: 2 },
  ]);
}

async function seedBlog() {
  const categoryRepo = dataSource.getRepository(Category);
  const authorRepo = dataSource.getRepository(Author);
  const postRepo = dataSource.getRepository(Post);

  if ((await postRepo.count()) > 0) {
    return;
  }

  const category = await categoryRepo.save({
    name: 'Product Updates',
    slug: 'product-updates',
    description: 'Berita terbaru mengenai fitur CMS',
  });

  const author = await authorRepo.save({
    name: 'Dita Lestari',
    title: 'Content Lead',
    bio: 'Memastikan tiap campaign punya cerita yang konsisten.',
  });

  await postRepo.save({
    title: 'Memperkenalkan Site Config untuk Landing Page',
    slug: 'memperkenalkan-site-config',
    excerpt:
      'Kini tim konten bisa mengubah hero, CTA, dan navigasi tanpa deploy ulang frontend.',
    content:
      'Dengan modul Site Config di NestJS, seluruh data branding tersimpan rapi. Next.js tinggal menarik JSON dan me-render ulang secara otomatis.',
    status: PostStatus.PUBLISHED,
    publishedAt: new Date(),
    author,
    category,
    seoTitle: 'Site Config Landing Page',
    seoDescription:
      'Pelajari bagaimana modul Site Config membantu tim marketing bergerak cepat.',
  });
}

seed().catch((error) => {
  console.error('Seed failed', error);
  process.exit(1);
});
