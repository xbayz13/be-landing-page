import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const apiKey = this.configService.get<string>('app.adminApiKey') ?? '';
    if (!apiKey) {
      throw new UnauthorizedException(
        'ADMIN_API_KEY is not configured on the server',
      );
    }

    const request = context.switchToHttp().getRequest<Request>();
    const headerKey = request.headers['x-api-key'];

    if (typeof headerKey !== 'string' || headerKey !== apiKey) {
      throw new UnauthorizedException('Invalid or missing API key');
    }

    return true;
  }
}
