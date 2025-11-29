export type MediaStorageResult = {
  url: string;
  storage: 'local' | 's3';
  filename: string;
  bucket?: string;
  key?: string;
  metadata?: Record<string, unknown>;
};

