import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import { validateEnv } from './config/validate-env';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SiteConfigModule } from './site-config/site-config.module';
import { BlogModule } from './blog/blog.module';
import { SeoModule } from './seo/seo.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: ['.env', '.env.local'],
      load: [configuration],
      validate: validateEnv,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST', 'localhost'),
        port: configService.get<number>('DATABASE_PORT', 5432),
        username: configService.get<string>('DATABASE_USER', 'postgres'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME', 'lp-cms'),
        ssl: configService.get<boolean>('DATABASE_SSL', false)
          ? { rejectUnauthorized: false }
          : false,
        autoLoadEntities: true,
        synchronize: configService.get<boolean>('DATABASE_SYNCHRONIZE', true),
      }),
    }),
    SiteConfigModule,
    BlogModule,
    SeoModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
