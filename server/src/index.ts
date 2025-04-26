import "reflect-metadata";
import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { buildSchema } from "type-graphql";
import { CandidateResolver } from "./resolvers/CandidateResolver";
import { AppDataSource } from "./config/database";
import cors from "cors";
import { graphqlUploadExpress } from "graphql-upload-minimal";
import { existsSync, mkdirSync } from "fs";
import path from "path";

async function main() {
	await AppDataSource.initialize();
	console.log("Database connected");

	const app = express();

	const uploadDir = path.join(process.cwd(), "uploads");
	if (!existsSync(uploadDir)) {
		mkdirSync(uploadDir, { recursive: true });
	}

	app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

	app.use(cors());
	var bodyParser = require("body-parser");
	app.use(bodyParser.json({ limit: "50mb" }));
	app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

	app.use(graphqlUploadExpress());

	const schema = await buildSchema({
		resolvers: [CandidateResolver],
	});

	const server = new ApolloServer({
		schema,
	});

	await server.start();

	app.use(
		"/api",
		expressMiddleware(server, {
			context: async ({ req }) => ({ req }),
		})
	);

	app.listen(3000, () => {
		console.log("Server running on http://localhost:3000");
	});
}

main().catch((error) => {
	console.error(error);
});
