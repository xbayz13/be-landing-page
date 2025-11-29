/**
 * Generic Repository Interface
 * Abstraction for data access layer to enable better testability and flexibility
 */
export interface IRepository<T> {
  findOne(options: { where: Partial<T> }): Promise<T | null>;
  find(options?: { where?: Partial<T>; order?: Record<string, 'ASC' | 'DESC'>; take?: number }): Promise<T[]>;
  create(data: Partial<T>): T;
  save(entity: T): Promise<T>;
  preload(data: Partial<T & { id: string }>): Promise<T | null>;
  merge(entity: T, data: Partial<T>): T;
  remove(entity: T): Promise<T>;
}

