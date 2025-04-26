import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
	type: "postgres",
	host: process.env.DB_HOST || "localhost",
	port: parseInt(process.env.DB_PORT || "5432"),
	username: process.env.DB_USERNAME || "postgres",
	password: process.env.DB_PASSWORD || "postgres",
	database: process.env.DB_NAME || "recruitment",
	synchronize: true,
	logging: true,
	entities: ["src/entities/**/*.ts"],
	migrations: ["src/migrations/**/*.ts"],
	subscribers: ["src/subscribers/**/*.ts"],
});
