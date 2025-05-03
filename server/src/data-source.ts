import "reflect-metadata";
import { DataSource } from "typeorm";
import { Candidate } from "./entities/Candidate";
import { CandidateHistory } from "./entities/CandidateHistory";
import { InterviewStep } from "./entities/InterviewStep";
import { InterviewStepHistory } from "./entities/InterviewStepHistory";
import { TimestampSubscriber } from "./subscribers/TimestampSubscriber";
import { Migrate } from "./migrations/Migrate";

export const AppDataSource = new DataSource({
	type: "postgres",
	host: process.env.DB_HOST || "localhost",
	port: parseInt(process.env.DB_PORT || "5432"),
	username: process.env.DB_USERNAME || "postgres",
	password: process.env.DB_PASSWORD || "postgres",
	database: process.env.DB_NAME || "recruitment",
	synchronize: true,
	logging: ["error"],
	entities: [Candidate, CandidateHistory, InterviewStep, InterviewStepHistory],
	migrations: [Migrate],
	subscribers: [TimestampSubscriber],
});
