import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import type { File as MulterFile } from 'multer';
import { MediaAsset } from './entities/media-asset.entity';
import { MediaStorageService } from './media-storage.service';
import { ListMediaQueryDto } from './dto/list-media-query.dto';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(MediaAsset)
    private readonly mediaRepository: Repository<MediaAsset>,
    private readonly mediaStorageService: MediaStorageService,
  ) {}

  async upload(file?: MulterFile) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const stored = await this.mediaStorageService.saveFile(file);

    const asset = this.mediaRepository.create({
      originalFilename: file.originalname,
      filename: stored.filename,
      mimeType: file.mimetype,
      size: file.size,
      url: stored.url,
      storageProvider: stored.storage,
      bucket: stored.bucket,
      storageKey: stored.key,
      metadata: stored.metadata ?? undefined,
    });

    return this.mediaRepository.save(asset);
  }

  async list(query: ListMediaQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const where = query.search
      ? [
          { originalFilename: Like(`%${query.search}%`) },
          { mimeType: Like(`%${query.search}%`) },
        ]
      : {};

    const [data, total] = await this.mediaRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async remove(id: string) {
    const asset = await this.mediaRepository.findOne({ where: { id } });
    if (!asset) {
      throw new NotFoundException('Media asset not found');
    }
    await this.mediaStorageService.removeFile(asset);
    await this.mediaRepository.remove(asset);
    return { success: true };
  }
}

