import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import { resolve, dirname, extname } from 'path';
import type { File as MulterFile } from 'multer';
import type { MediaStorageResult } from './interfaces/media-storage-result.interface';
import type { MediaAsset } from './entities/media-asset.entity';

@Injectable()
export class MediaStorageService {
  private readonly driver: 'local' | 's3';
  private readonly uploadDir: string;
  private readonly baseUrl: string;
  private readonly s3Client?: S3Client;
  private readonly bucket?: string;

  private readonly logger = new Logger(MediaStorageService.name);

  constructor(private readonly configService: ConfigService) {
    this.driver = this.configService.get<'local' | 's3'>('media.driver', 'local');
    this.uploadDir = this.resolvePath(
      this.configService.get<string>('media.uploadDir', './uploads/media'),
    );
    this.baseUrl = this.configService.get<string>('media.baseUrl', '/media');

    if (this.driver === 's3') {
      const region = this.configService.get<string>('media.s3.region');
      const accessKeyId = this.configService.get<string>('media.s3.accessKeyId');
      const secretAccessKey = this.configService.get<string>('media.s3.secretAccessKey');
      this.bucket = this.configService.get<string>('media.s3.bucket');

      if (!region || !accessKeyId || !secretAccessKey || !this.bucket) {
        throw new Error(
          'S3 storage is enabled but AWS credentials/bucket are not configured correctly',
        );
      }

      this.s3Client = new S3Client({
        region,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });
    }
  }

  async saveFile(file: MulterFile): Promise<MediaStorageResult> {
    if (this.driver === 's3') {
      return this.uploadToS3(file);
    }

    return this.saveLocally(file);
  }

  async removeFile(asset: MediaAsset) {
    if (this.driver === 's3') {
      await this.deleteFromS3(asset);
      return;
    }

    if (!asset.filename) {
      return;
    }

    const targetPath = resolve(this.uploadDir, asset.filename);
    try {
      await fs.unlink(targetPath);
    } catch (error) {
      this.logger.warn(`Failed to remove local media: ${targetPath}`, error as Error);
    }
  }

  private async saveLocally(file: MulterFile): Promise<MediaStorageResult> {
    const fileExt = extname(file.originalname);
    const filename = `${randomUUID()}${fileExt}`;
    const targetPath = resolve(this.uploadDir, filename);

    await fs.mkdir(dirname(targetPath), { recursive: true });

    try {
      await fs.writeFile(targetPath, file.buffer);
    } catch (error) {
      this.logger.error('Failed to save media locally', error as Error);
      throw new InternalServerErrorException('Failed to store file');
    }

    const url = `${this.baseUrl.replace(/\/$/, '')}/${filename}`;
    return {
      url,
      filename,
      storage: 'local',
    };
  }

  private async uploadToS3(file: MulterFile): Promise<MediaStorageResult> {
    if (!this.s3Client || !this.bucket) {
      throw new InternalServerErrorException('S3 client is not configured');
    }

    const fileExt = extname(file.originalname);
    const key = `media/${randomUUID()}${fileExt}`;

    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );
    } catch (error) {
      this.logger.error('Failed to upload media to S3', error as Error);
      throw new InternalServerErrorException('Failed to upload to S3');
    }

    const url = `${this.baseUrl.replace(/\/$/, '')}/${key}`;

    return {
      url,
      filename: key,
      storage: 's3',
      bucket: this.bucket,
      key,
    };
  }

  private async deleteFromS3(asset: MediaAsset) {
    if (!this.s3Client || !this.bucket) {
      return;
    }

    const key = asset.storageKey ?? asset.filename;
    if (!key) {
      return;
    }

    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );
    } catch (error) {
      this.logger.warn(`Failed to delete S3 object ${key}`, error as Error);
    }
  }

  private resolvePath(targetPath: string): string {
    return targetPath.startsWith('/') ? targetPath : resolve(process.cwd(), targetPath);
  }
}

