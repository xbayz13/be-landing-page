import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers1701300000001 implements MigrationInterface {
  name = 'CreateUsers1701300000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "email" varchar(160) NOT NULL UNIQUE,
        "passwordHash" varchar(255) NOT NULL,
        "role" varchar(40) NOT NULL DEFAULT 'superadmin',
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "users";');
  }
}

