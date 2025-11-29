import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'footer_links' })
export class FooterLink {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 60 })
  label: string;

  @Column({ length: 255 })
  url: string;

  @Column({ length: 60 })
  groupName: string;

  @Column({ default: 0 })
  position: number;
}
