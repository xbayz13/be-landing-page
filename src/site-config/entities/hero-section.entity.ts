import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum HeroMediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  ILLUSTRATION = 'illustration',
}

@Entity({ name: 'hero_sections' })
export class HeroSection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 60, nullable: true })
  eyebrow?: string;

  @Column({ length: 160 })
  heading: string;

  @Column({ type: 'text', nullable: true })
  subheading?: string;

  @Column({ length: 60, nullable: true })
  primaryCtaLabel?: string;

  @Column({ length: 255, nullable: true })
  primaryCtaUrl?: string;

  @Column({ length: 60, nullable: true })
  secondaryCtaLabel?: string;

  @Column({ length: 255, nullable: true })
  secondaryCtaUrl?: string;

  @Column({ type: 'enum', enum: HeroMediaType, default: HeroMediaType.IMAGE })
  mediaType: HeroMediaType;

  @Column({ length: 255, nullable: true })
  mediaUrl?: string;
}
