import { TypeOrmModuleOptions } from "@nestjs/typeorm/dist";

export const databaseConfig: TypeOrmModuleOptions = {
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "secret",
  database: "restaurant",
  entities: ["dist/**/*.entity.js"],
  synchronize: true,
};
