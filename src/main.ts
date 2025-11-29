import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { resolve } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Landing Page CMS API')
    .setDescription(
      'Dokumentasi API untuk mengelola konten landing page perusahaan dan blog.',
    )
    .setVersion('1.0.0')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, swaggerDocument, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const configService = app.get(ConfigService);

  const uploadDir = configService.get<string>('media.uploadDir', './uploads/media');
  const mediaBaseUrl = configService.get<string>('media.baseUrl', '/media');
  const staticPath = uploadDir.startsWith('/')
    ? uploadDir
    : resolve(process.cwd(), uploadDir);
  const mediaPathname = new URL(mediaBaseUrl, configService.get<string>('app.baseUrl', 'http://localhost:3000')).pathname;
  const mediaPrefix = mediaPathname.endsWith('/') ? mediaPathname : `${mediaPathname}/`;

  app.useStaticAssets(staticPath, {
    prefix: mediaPrefix,
  });

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
}
void bootstrap();
