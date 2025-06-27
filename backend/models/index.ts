import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  'media_app',           // database name
  'root',                // username
  'Deda2782002!',        // password
  {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    logging: false, // set to true if you want to debug SQL
  }
);

export default sequelize;
