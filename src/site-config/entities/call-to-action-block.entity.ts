import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum CtaVariant {
  SOLID = 'solid',
  OUTLINE = 'outline',
  GHOST = 'ghost',
}

@Entity({ name: 'cta_blocks' })
export class CallToActionBlock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 160 })
  heading: string;

  @Column({ type: 'text', nullable: true })
  body?: string;

  @Column({ length: 60, nullable: true })
  eyebrow?: string;

  @Column({ length: 60, nullable: true })
  buttonLabel?: string;

  @Column({ length: 255, nullable: true })
  buttonUrl?: string;

  @Column({ type: 'enum', enum: CtaVariant, default: CtaVariant.SOLID })
  variant: CtaVariant;
}
