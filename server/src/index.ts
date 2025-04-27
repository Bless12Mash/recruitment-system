import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import express from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { AppDataSource } from "./config/database";
import { CandidateResolver } from "./resolvers/CandidateResolver";

async function main() {
	await AppDataSource.initialize();
	console.log("Database connected");

	const app = express();

	app.use(cors());
	var bodyParser = require("body-parser");
	app.use(bodyParser.json({ limit: "50mb" }));
	app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

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
			context: async ({ req }) => ({ req, token: req.headers.token }),
		})
	);

	app.listen(3000, () => {
		console.log("Server running on http://localhost:3000");
	});
}

main().catch((error) => {
	console.error(error);
});
