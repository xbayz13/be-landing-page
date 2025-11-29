import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Author } from './entities/author.entity';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private readonly authorsRepository: Repository<Author>,
  ) {}

  create(dto: CreateAuthorDto) {
    const author = this.authorsRepository.create(dto);
    return this.authorsRepository.save(author);
  }

  findAll() {
    return this.authorsRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const author = await this.authorsRepository.findOne({ where: { id } });
    if (!author) {
      throw new NotFoundException(`Author ${id} not found`);
    }
    return author;
  }

  async update(id: string, dto: UpdateAuthorDto) {
    const author = await this.authorsRepository.preload({
      id,
      ...dto,
    });
    if (!author) {
      throw new NotFoundException(`Author ${id} not found`);
    }
    return this.authorsRepository.save(author);
  }

  async remove(id: string) {
    const author = await this.findOne(id);
    await this.authorsRepository.remove(author);
  }
}
