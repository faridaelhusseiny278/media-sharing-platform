// backend/models/index.ts
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();


const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    dialect: 'mysql', // explicitly set the dialect
    logging: false,
  }
);

export default sequelize;
