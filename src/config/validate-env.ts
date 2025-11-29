import { plainToInstance } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
  validateSync,
} from 'class-validator';

class EnvironmentVariables {
  @IsInt()
  @Min(1)
  PORT!: number;

  @IsString()
  SITE_BASE_URL!: string;

  @IsString()
  JWT_SECRET!: string;

  @IsInt()
  JWT_EXPIRES_IN!: number;

  @IsString()
  DATABASE_HOST!: string;

  @IsInt()
  DATABASE_PORT!: number;

  @IsString()
  DATABASE_USER!: string;

  @IsOptional()
  @IsString()
  DATABASE_PASSWORD?: string;

  @IsString()
  DATABASE_NAME!: string;

  @IsBoolean()
  DATABASE_SSL!: boolean;

  @IsBoolean()
  DATABASE_SYNCHRONIZE!: boolean;

  @IsOptional()
  @IsString()
  SUPERADMIN_EMAIL?: string;

  @IsOptional()
  @IsString()
  SUPERADMIN_PASSWORD?: string;

  @IsIn(['local', 's3'])
  MEDIA_STORAGE_DRIVER!: string;

  @IsString()
  MEDIA_UPLOAD_DIR!: string;

  @IsString()
  MEDIA_BASE_URL!: string;

  @IsOptional()
  @IsString()
  AWS_S3_BUCKET?: string;

  @IsOptional()
  @IsString()
  AWS_S3_REGION?: string;

  @IsOptional()
  @IsString()
  AWS_ACCESS_KEY_ID?: string;

  @IsOptional()
  @IsString()
  AWS_SECRET_ACCESS_KEY?: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(
    EnvironmentVariables,
    {
      ...config,
      PORT: Number(config.PORT) || 3000,
      DATABASE_PORT: Number(config.DATABASE_PORT) || 5432,
      JWT_EXPIRES_IN: Number(config.JWT_EXPIRES_IN) || 3600,
      DATABASE_SSL:
        config.DATABASE_SSL === true ||
        config.DATABASE_SSL === 'true' ||
        config.DATABASE_SSL === '1',
      DATABASE_SYNCHRONIZE:
        config.DATABASE_SYNCHRONIZE !== 'false' &&
        config.DATABASE_SYNCHRONIZE !== '0',
    },
    {
      enableImplicitConversion: true,
    },
  );

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(
      `Environment validation error: ${errors
        .map((error) => JSON.stringify(error.constraints))
        .join(', ')}`,
    );
  }

  return validatedConfig;
}
