import { AppDataSource } from "../data-source";
import { DataSource } from "typeorm";
import { config } from "dotenv";

config();

console.log("Database connection settings:", {
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
});

async function initializeDatabase() {
	try {
		const tempDataSource = new DataSource({
			type: "postgres",
			host: process.env.DB_HOST || "localhost",
			port: parseInt(process.env.DB_PORT || "5432"),
			username: process.env.DB_USERNAME || "postgres",
			password: process.env.DB_PASSWORD || "blessing",
			database: "postgres",
		});

		await tempDataSource.initialize();
		console.log("Connected to temporary database successfully");

		await tempDataSource
			.query(`CREATE DATABASE ${process.env.DB_NAME || "recruitment"}`)
			.catch(() => {
				console.log("Database already exists, continuing...");
			});

		await tempDataSource.destroy();

		await AppDataSource.initialize();
		console.log("Data Source has been initialized!");

		await AppDataSource.runMigrations();
		console.log("Migrations have been run successfully!");

		await AppDataSource.destroy();
		console.log("Database initialization completed!");
	} catch (error) {
		console.error("Error during database initialization:", error);
		throw error;
	}
}

initializeDatabase()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
