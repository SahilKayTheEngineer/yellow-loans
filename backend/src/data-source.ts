import { DataSource } from 'typeorm';
import { Phone } from './entities/Phone';
import { User } from './entities/User';
import { RiskGroup } from './entities/RiskGroup';
import { UserLoan } from './entities/UserLoan';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User, Phone, RiskGroup, UserLoan],
  synchronize: process.env.NODE_ENV === 'development', // Auto-sync in dev, use migrations in prod
  logging: process.env.NODE_ENV === 'development',
  migrations: ['src/migrations/*.ts'],
  extra: {
    connectTimeoutMS: 10000,
  },
});

