import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMediaAssets1701300000002 implements MigrationInterface {
  name = 'CreateMediaAssets1701300000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "media_assets" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "originalFilename" varchar(255) NOT NULL,
        "filename" varchar(255) NOT NULL,
        "mimeType" varchar(160) NOT NULL,
        "size" bigint NOT NULL,
        "url" varchar(500) NOT NULL,
        "storageProvider" varchar(16) NOT NULL,
        "bucket" varchar(255),
        "storageKey" varchar(512),
        "metadata" jsonb,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "media_assets";');
  }
}

