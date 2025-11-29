import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'testimonials' })
export class Testimonial {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  quote: string;

  @Column({ length: 80 })
  authorName: string;

  @Column({ length: 80, nullable: true })
  authorRole?: string;

  @Column({ length: 80, nullable: true })
  company?: string;

  @Column({ length: 255, nullable: true })
  avatarUrl?: string;

  @Column({ default: false })
  featured: boolean;
}
