import 'dotenv/config';
import { DataSource } from 'typeorm';
import { BrandSetting } from '../site-config/entities/brand-setting.entity';
import { NavigationLink } from '../site-config/entities/navigation-link.entity';
import { HeroSection } from '../site-config/entities/hero-section.entity';
import { Feature } from '../site-config/entities/feature.entity';
import { Testimonial } from '../site-config/entities/testimonial.entity';
import { CallToActionBlock } from '../site-config/entities/call-to-action-block.entity';
import { FooterLink } from '../site-config/entities/footer-link.entity';
import { Author } from '../blog/entities/author.entity';
import { Category } from '../blog/entities/category.entity';
import { Post } from '../blog/entities/post.entity';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: Number(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USER ?? 'postgres',
  password: process.env.DATABASE_PASSWORD ?? 'postgres',
  database: process.env.DATABASE_NAME ?? 'lp-cms',
  ssl:
    process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
  entities: [
    BrandSetting,
    NavigationLink,
    HeroSection,
    Feature,
    Testimonial,
    CallToActionBlock,
    FooterLink,
    Author,
    Category,
    Post,
  ],
  migrations: ['dist/database/migrations/*.js'],
});

export default dataSource;
