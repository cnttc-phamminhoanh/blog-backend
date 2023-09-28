import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from 'dotenv';

dotenv.config({ path: `${__dirname}/../../${process.env.NODE_ENV}.env` })

export const dataSourceOptions: DataSourceOptions = {
  type: process.env.TYPEORM_TYPE as any,
  host: process.env.TYPEORM_HOST,
  port: Number(process.env.TYPEORM_PORT),
  username: process.env.TYPEORM_USER,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  entities: ['dist/database/entity.js'],
  migrations: ['dist/database/migrations/*.js'],
  synchronize: false,
}

const dataSource = new DataSource(dataSourceOptions)

export default dataSource
