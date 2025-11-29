import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'features' })
export class Feature {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 80 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ length: 60, nullable: true })
  icon?: string;

  @Column({ default: 0 })
  highlightOrder: number;

  @Column({ length: 40, nullable: true })
  pillar?: string;
}
