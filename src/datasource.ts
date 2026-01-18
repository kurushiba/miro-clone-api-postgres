import { DataSource } from 'typeorm';

export default new DataSource({
  migrationsTableName: 'migrations',
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
  synchronize: false,
  migrationsRun: true,
  logging: ['query', 'error', 'log'],
  entities: [process.env.DB_TYPEORM_ENTITIES || 'src/**/*.entity.ts'],
  migrations: [process.env.DB_TYPEORM_MIGRATIONS || 'src/migrations/**/*.ts'],
  subscribers: [process.env.DB_TYPEORM_SUBSCRIBERS || 'src/subscriber/**/*.ts'],
});
