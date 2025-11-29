import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'brand_settings' })
export class BrandSetting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  companyName: string;

  @Column({ length: 160, nullable: true })
  tagline?: string;

  @Column({ length: 255, nullable: true })
  logoUrl?: string;

  @Column({ length: 255, nullable: true })
  faviconUrl?: string;

  @Column({ length: 7, nullable: true })
  primaryColor?: string;

  @Column({ length: 7, nullable: true })
  secondaryColor?: string;

  @Column({ length: 7, nullable: true })
  accentColor?: string;

  @Column({ length: 80, nullable: true })
  headingFont?: string;

  @Column({ length: 80, nullable: true })
  bodyFont?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
