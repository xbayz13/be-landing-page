import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'navigation_links' })
export class NavigationLink {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 60 })
  label: string;

  @Column({ length: 255 })
  url: string;

  @Column({ default: 0 })
  position: number;

  @Column({ default: false })
  isPrimary: boolean;

  @Column({ default: false })
  isExternal: boolean;
}
