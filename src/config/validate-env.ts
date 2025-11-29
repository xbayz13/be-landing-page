import { plainToInstance } from 'class-transformer';
import {
  IsBoolean,
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

  @IsOptional()
  @IsString()
  JWT_EXPIRES_IN?: string;

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
}

export function validateEnv(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(
    EnvironmentVariables,
    {
      ...config,
      PORT: Number(config.PORT) || 3000,
      DATABASE_PORT: Number(config.DATABASE_PORT) || 5432,
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
