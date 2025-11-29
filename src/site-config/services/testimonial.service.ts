import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Testimonial } from '../entities/testimonial.entity';
import { CreateTestimonialDto } from '../dto/create-testimonial.dto';
import { UpdateTestimonialDto } from '../dto/update-testimonial.dto';

@Injectable()
export class TestimonialService {
  constructor(
    @InjectRepository(Testimonial)
    private readonly testimonialRepository: Repository<Testimonial>,
  ) {}

  async listTestimonials(): Promise<Testimonial[]> {
    return this.testimonialRepository.find({
      order: { featured: 'DESC', authorName: 'ASC' },
    });
  }

  async createTestimonial(dto: CreateTestimonialDto): Promise<Testimonial> {
    const testimonial = this.testimonialRepository.create({
      featured: dto.featured ?? false,
      ...dto,
    });
    return this.testimonialRepository.save(testimonial);
  }

  async updateTestimonial(
    id: string,
    dto: UpdateTestimonialDto,
  ): Promise<Testimonial> {
    const testimonial = await this.testimonialRepository.preload({
      id,
      ...dto,
    });
    if (!testimonial) {
      throw new NotFoundException(`Testimonial ${id} not found`);
    }
    return this.testimonialRepository.save(testimonial);
  }

  async removeTestimonial(id: string): Promise<void> {
    const testimonial = await this.testimonialRepository.findOne({
      where: { id },
    });
    if (!testimonial) {
      throw new NotFoundException(`Testimonial ${id} not found`);
    }
    await this.testimonialRepository.remove(testimonial);
  }
}

