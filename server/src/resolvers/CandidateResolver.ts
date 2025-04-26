import {
	Resolver,
	Query,
	Mutation,
	Arg,
	ID,
	InputType,
	Field,
	ObjectType,
	Int,
} from "type-graphql";
import { Candidate } from "../entities/Candidate";
import { AppDataSource } from "../config/database";
import { existsSync, mkdirSync, createWriteStream } from "fs";
import { join } from "path";
import { GraphQLUpload } from "graphql-upload-minimal";

@InputType()
class PaginationInput {
	@Field(() => Int)
	page: number = 1;

	@Field(() => Int)
	pageSize: number = 10;
}

@InputType()
class SortInput {
	@Field()
	field: string = "createdAt";

	@Field()
	order: "ASC" | "DESC" = "DESC";
}

@InputType()
class CandidateFilterInput {
	@Field({ nullable: true })
	name?: string;

	@Field({ nullable: true })
	email?: string;

	@Field({ nullable: true })
	role?: string;

	@Field({ nullable: true })
	level?: string;

	@Field({ nullable: true })
	status?: string;

	@Field({ nullable: true })
	location?: string;
}

@ObjectType()
class PaginatedCandidates {
	@Field(() => [Candidate])
	items: Candidate[];

	@Field(() => Int)
	total: number;

	@Field(() => Int)
	page: number;

	@Field(() => Int)
	pageSize: number;

	@Field(() => Int)
	totalPages: number;
}

@ObjectType()
@InputType("InterviewStepInput")
class InterviewStep {
	@Field()
	id: number;

	@Field()
	name: string;

	@Field()
	status: string;

	@Field({ nullable: true })
	feedback?: string;

	@Field(() => Date, { nullable: true })
	completedAt?: Date;
}

@InputType()
class CandidateInput {
	@Field()
	name: string;

	@Field()
	email: string;

	@Field()
	role: string;

	@Field()
	level: string;

	@Field()
	progress: string;

	@Field()
	location: string;

	@Field()
	status: string;

	@Field(() => Int, { nullable: true })
	currentStep: number;

	@Field(() => [InterviewStep], { nullable: true })
	steps?: InterviewStep[];

	@Field()
	createdBy: string;

	@Field({ nullable: true })
	cvUrl?: string;
}

@Resolver(Candidate)
export class CandidateResolver {
	private candidateRepository = AppDataSource.getRepository(Candidate);

	@Query(() => [Candidate])
	async candidates(): Promise<Candidate[]> {
		return await this.candidateRepository.find();
	}

	@Query(() => Candidate, { nullable: true })
	async candidate(@Arg("id", () => ID) id: string): Promise<Candidate | null> {
		return await this.candidateRepository.findOneBy({ id });
	}

	@Query(() => PaginatedCandidates)
	async paginatedCandidates(
		@Arg("pagination", { nullable: true }) pagination?: PaginationInput,
		@Arg("sort", { nullable: true }) sort?: SortInput,
		@Arg("filter", { nullable: true }) filter?: CandidateFilterInput
	): Promise<PaginatedCandidates> {
		const queryBuilder =
			this.candidateRepository.createQueryBuilder("candidate");

		if (filter) {
			if (filter.name) {
				queryBuilder.andWhere("candidate.name ILIKE :name", {
					name: `%${filter.name}%`,
				});
			}
			if (filter.email) {
				queryBuilder.andWhere("candidate.email ILIKE :email", {
					email: `%${filter.email}%`,
				});
			}
			if (filter.role && filter.role !== "all") {
				queryBuilder.andWhere("candidate.role = :role", { role: filter.role });
			}
			if (filter.level && filter.level !== "all") {
				queryBuilder.andWhere("candidate.level = :level", {
					level: filter.level,
				});
			}
			if (filter.status && filter.status !== "all") {
				queryBuilder.andWhere("candidate.status = :status", {
					status: filter.status,
				});
			}
			if (filter.location) {
				queryBuilder.andWhere("candidate.location ILIKE :location", {
					location: `%${filter.location}%`,
				});
			}
		}

		const sortField = sort?.field || "createdAt";
		const sortOrder = sort?.order || "DESC";
		queryBuilder.orderBy(`candidate.${sortField}`, sortOrder);

		const page = pagination?.page || 1;
		const pageSize = pagination?.pageSize || 10;
		const skip = (page - 1) * pageSize;

		const [items, total] = await queryBuilder
			.skip(skip)
			.take(pageSize)
			.getManyAndCount();

		return {
			items,
			total,
			page,
			pageSize,
			totalPages: Math.ceil(total / pageSize),
		};
	}

	INTERVIEW_STEPS = [
		"Resume Screening",
		"Technical Assessment",
		"Technical Interview",
		"Culture Fit Interview",
		"Final Interview",
	] as const;

	@Mutation(() => Candidate)
	async saveCandidate(
		@Arg("candidate") candidateInput: CandidateInput
	): Promise<Candidate> {
		candidateInput.steps = [
			{ id: 0, name: this.INTERVIEW_STEPS[0], status: "Pending" },
			{ id: 1, name: this.INTERVIEW_STEPS[1], status: "Pending" },
			{ id: 2, name: this.INTERVIEW_STEPS[2], status: "Pending" },
			{ id: 3, name: this.INTERVIEW_STEPS[3], status: "Pending" },
		];

		candidateInput.currentStep = 0;

		const candidate = this.candidateRepository.create(candidateInput);
		return await this.candidateRepository.save(candidate);
	}

	@Mutation(() => [Candidate])
	async saveCandidates(
		@Arg("candidates", () => [CandidateInput]) candidatesInput: CandidateInput[]
	): Promise<Candidate[]> {
		const results = [];
		for (const candidateInput of candidatesInput) {
			const result = await this.saveCandidate(candidateInput);
			results.push(result);
		}
		return results;
	}

	@Mutation(() => Candidate)
	async updateCandidateProgress(
		@Arg("id", () => ID) id: string,
		@Arg("progress") progress: string,
		@Arg("currentStep", () => Int, { nullable: true }) currentStep?: number,
		@Arg("stepData", { nullable: true }) stepData?: string
	): Promise<Candidate> {
		const candidate = await this.candidateRepository.findOneByOrFail({ id });

		candidate.progress = progress;
		if (currentStep !== undefined) {
			candidate.currentStep = currentStep;
		}
		if (stepData) {
			const steps = [...candidate.steps];
			const stepUpdate = JSON.parse(stepData);
			const stepIndex = steps.findIndex((s) => s.id === stepUpdate.id);
			if (stepIndex >= 0) {
				steps[stepIndex] = { ...steps[stepIndex], ...stepUpdate };
			}
			candidate.steps = steps;
		}

		return await this.candidateRepository.save(candidate);
	}

	@Mutation(() => Candidate)
	async updateCandidateStatus(
		@Arg("id", () => ID) id: string,
		@Arg("status") status: string,
		@Arg("currentStep", () => Int, { nullable: true }) currentStep?: number,
		@Arg("stepData", { nullable: true }) stepData?: string
	): Promise<Candidate> {
		const candidate = await this.candidateRepository.findOneByOrFail({ id });

		candidate.status = status;
		if (currentStep !== undefined) {
			candidate.currentStep = currentStep;
		}
		if (stepData) {
			const steps = [...candidate.steps];
			const stepUpdate = JSON.parse(stepData);
			const stepIndex = steps.findIndex((s) => s.id === stepUpdate.id);
			if (stepIndex >= 0) {
				steps[stepIndex] = { ...steps[stepIndex], ...stepUpdate };
			}
			candidate.steps = steps;
		}

		return await this.candidateRepository.save(candidate);
	}

	@Mutation(() => Candidate)
	async uploadCV(
		@Arg("id", () => ID) id: string,
		@Arg("file", () => GraphQLUpload)
		{
			createReadStream,
			filename,
		}: { createReadStream: () => NodeJS.ReadableStream; filename: string }
	): Promise<Candidate> {
		console.log({ id }, { filename });
		const candidate = await this.candidateRepository.findOneByOrFail({ id });

		const uploadDir = join(process.cwd(), "uploads");
		if (!existsSync(uploadDir)) {
			mkdirSync(uploadDir, { recursive: true });
		}

		const uniqueFilename = `${Date.now()}-${filename}`;
		const filePath = join(uploadDir, uniqueFilename);

		await new Promise<void>((resolve, reject) => {
			const writeStream = createWriteStream(filePath);
			createReadStream()
				.pipe(writeStream)
				.on("finish", () => resolve())
				.on("error", reject);
		});

		candidate.cvUrl = `/uploads/${uniqueFilename}`;
		return await this.candidateRepository.save(candidate);
	}
}
