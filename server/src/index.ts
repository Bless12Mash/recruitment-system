import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import express from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { AppDataSource } from "./data-source";
import { CandidateResolver } from "./resolvers/CandidateResolver";

async function main() {
	await AppDataSource.initialize();
	console.log("Database connected");

	const app = express();

	app.use(cors());
	app.use(express.json({ limit: "50mb" }));
	app.use(express.urlencoded({ limit: "50mb", extended: true }));

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
		console.log("Server running on http://localhost:3000/api");
	});
}

main().catch((error) => {
	console.error(error);
});
