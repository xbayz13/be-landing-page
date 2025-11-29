import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1701300000000 implements MigrationInterface {
  name = 'InitSchema1701300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    await queryRunner.query(
      "CREATE TYPE \"hero_sections_media_type_enum\" AS ENUM('image','video','illustration');",
    );
    await queryRunner.query(
      "CREATE TYPE \"cta_blocks_variant_enum\" AS ENUM('solid','outline','ghost');",
    );
    await queryRunner.query(
      "CREATE TYPE \"blog_posts_status_enum\" AS ENUM('draft','published','archived');",
    );

    await queryRunner.query(`
      CREATE TABLE "brand_settings" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "companyName" varchar(150) NOT NULL,
        "tagline" varchar(160),
        "logoUrl" varchar(255),
        "faviconUrl" varchar(255),
        "primaryColor" varchar(7),
        "secondaryColor" varchar(7),
        "accentColor" varchar(7),
        "headingFont" varchar(80),
        "bodyFont" varchar(80),
        "createdAt" TIMESTAMPTZ DEFAULT now(),
        "updatedAt" TIMESTAMPTZ DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "navigation_links" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "label" varchar(60) NOT NULL,
        "url" varchar(255) NOT NULL,
        "position" integer NOT NULL DEFAULT 0,
        "isPrimary" boolean NOT NULL DEFAULT false,
        "isExternal" boolean NOT NULL DEFAULT false
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "hero_sections" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "eyebrow" varchar(60),
        "heading" varchar(160) NOT NULL,
        "subheading" text,
        "primaryCtaLabel" varchar(60),
        "primaryCtaUrl" varchar(255),
        "secondaryCtaLabel" varchar(60),
        "secondaryCtaUrl" varchar(255),
        "mediaType" "hero_sections_media_type_enum" NOT NULL DEFAULT 'image',
        "mediaUrl" varchar(255)
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "features" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "title" varchar(80) NOT NULL,
        "description" text NOT NULL,
        "icon" varchar(60),
        "highlightOrder" integer NOT NULL DEFAULT 0,
        "pillar" varchar(40)
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "testimonials" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "quote" text NOT NULL,
        "authorName" varchar(80) NOT NULL,
        "authorRole" varchar(80),
        "company" varchar(80),
        "avatarUrl" varchar(255),
        "featured" boolean NOT NULL DEFAULT false
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "cta_blocks" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "heading" varchar(160) NOT NULL,
        "body" text,
        "eyebrow" varchar(60),
        "buttonLabel" varchar(60),
        "buttonUrl" varchar(255),
        "variant" "cta_blocks_variant_enum" NOT NULL DEFAULT 'solid'
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "footer_links" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "label" varchar(60) NOT NULL,
        "url" varchar(255) NOT NULL,
        "groupName" varchar(60) NOT NULL,
        "position" integer NOT NULL DEFAULT 0
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "blog_categories" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "slug" varchar(80) NOT NULL UNIQUE,
        "name" varchar(80) NOT NULL,
        "description" text
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "blog_authors" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar(120) NOT NULL,
        "title" varchar(120),
        "bio" text,
        "avatarUrl" varchar(255),
        "websiteUrl" varchar(255),
        "linkedinUrl" varchar(255),
        "twitterUrl" varchar(255),
        "createdAt" TIMESTAMPTZ DEFAULT now(),
        "updatedAt" TIMESTAMPTZ DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "blog_posts" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "title" varchar(160) NOT NULL,
        "slug" varchar(160) NOT NULL UNIQUE,
        "excerpt" varchar(220),
        "content" text NOT NULL,
        "coverImageUrl" varchar(255),
        "status" "blog_posts_status_enum" NOT NULL DEFAULT 'draft',
        "publishedAt" TIMESTAMPTZ,
        "readingTimeMinutes" integer,
        "seoTitle" varchar(160),
        "seoDescription" varchar(220),
        "category_id" uuid,
        "author_id" uuid,
        "createdAt" TIMESTAMPTZ DEFAULT now(),
        "updatedAt" TIMESTAMPTZ DEFAULT now(),
        CONSTRAINT "FK_blog_posts_category" FOREIGN KEY ("category_id") REFERENCES "blog_categories"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_blog_posts_author" FOREIGN KEY ("author_id") REFERENCES "blog_authors"("id") ON DELETE SET NULL
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "blog_posts";');
    await queryRunner.query('DROP TABLE "blog_authors";');
    await queryRunner.query('DROP TABLE "blog_categories";');
    await queryRunner.query('DROP TABLE "footer_links";');
    await queryRunner.query('DROP TABLE "cta_blocks";');
    await queryRunner.query('DROP TABLE "testimonials";');
    await queryRunner.query('DROP TABLE "features";');
    await queryRunner.query('DROP TABLE "hero_sections";');
    await queryRunner.query('DROP TABLE "navigation_links";');
    await queryRunner.query('DROP TABLE "brand_settings";');
    await queryRunner.query('DROP TYPE "blog_posts_status_enum";');
    await queryRunner.query('DROP TYPE "cta_blocks_variant_enum";');
    await queryRunner.query('DROP TYPE "hero_sections_media_type_enum";');
  }
}
