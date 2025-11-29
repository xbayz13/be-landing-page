export default () => ({
  app: {
    port: parseInt(process.env.PORT ?? '3000', 10),
    baseUrl: process.env.SITE_BASE_URL ?? 'http://localhost:3000',
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET ?? 'change-me',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '3600',
  },
  database: {
    host: process.env.DATABASE_HOST ?? 'localhost',
    port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
    username: process.env.DATABASE_USER ?? 'postgres',
    password: process.env.DATABASE_PASSWORD ?? 'postgres',
    name: process.env.DATABASE_NAME ?? 'lp-cms',
    ssl: process.env.DATABASE_SSL === 'true',
    synchronize: process.env.DATABASE_SYNCHRONIZE !== 'false',
  },
  media: {
    driver: process.env.MEDIA_STORAGE_DRIVER ?? 'local',
    uploadDir: process.env.MEDIA_UPLOAD_DIR ?? './uploads/media',
    baseUrl:
      process.env.MEDIA_BASE_URL ??
      `${process.env.SITE_BASE_URL ?? 'http://localhost:3000'}/media`,
    s3: {
      bucket: process.env.AWS_S3_BUCKET ?? '',
      region: process.env.AWS_S3_REGION ?? '',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
    },
  },
});
