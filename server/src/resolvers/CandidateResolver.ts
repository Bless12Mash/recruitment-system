import { Arg, Ctx, ID, Int, Mutation, Query, Resolver } from "type-graphql";
import {
	CandidateLevel,
	CandidateProgress,
	CandidateStatus,
	InterviewStatus,
} from "../../../shared/enums";
import { AppDataSource } from "../data-source";
import { Candidate } from "../entities/Candidate";
import {
	CandidateFilterInput,
	CandidateInput,
	InterviewStepInput,
	PaginatedCandidates,
	PaginationInput,
	SortInput,
} from "../types/Input";
import { MyContext } from "../types/MyContext";
import { InterviewStep } from "./../entities/InterviewStep";

@Resolver(Candidate)
export class CandidateResolver {
	private candidateRepository = AppDataSource.getRepository(Candidate);
	private interviewStepRepository = AppDataSource.getRepository(InterviewStep);

	@Query(() => [Candidate])
	async candidates(): Promise<Candidate[]> {
		return await this.candidateRepository.find();
	}

	@Query(() => Candidate, { nullable: true })
	async candidate(@Arg("id", () => ID) id: string): Promise<Candidate | null> {
		return await this.candidateRepository
			.createQueryBuilder("candidate")
			.leftJoinAndSelect("candidate.steps", "interviewStep")
			.where("candidate.id = :id", { id })
			.orderBy("interviewStep.indexPosition", "ASC")
			.getOne();
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
			if (filter.progress && filter.progress !== "all") {
				queryBuilder.andWhere("candidate.progress = :progress", {
					progress: filter.progress,
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

	async getOrCreateCandidateSteps(
		ctx: MyContext,
		steps?: InterviewStepInput[]
	) {
		if (steps !== undefined && steps !== null) {
			let candidateSteps: InterviewStep[] = [];
			const promises = steps?.map(async (step) => {
				const candidateStep = new InterviewStep();

				candidateStep.indexPosition = step.indexPosition;
				candidateStep.name = step.name;
				candidateStep.status = step.status;
				candidateStep.feedback = step.feedback;
				candidateStep.createdBy = ctx.token || "";
				candidateStep.updatedBy = ctx.token || "";

				const interviewStep =
					this.interviewStepRepository.create(candidateStep);
				await this.interviewStepRepository.save(interviewStep);
				return interviewStep;
			});

			const results = await Promise.all(promises);
			candidateSteps.push(...results);

			return candidateSteps;
		} else {
			let candidateSteps: InterviewStep[] = [];
			const promises = this.INTERVIEW_STEPS.map(async (step, index) => {
				const candidateStep = new InterviewStep();

				candidateStep.indexPosition = index;
				candidateStep.name = step;
				candidateStep.status = InterviewStatus.PENDING;
				candidateStep.createdBy = ctx.token || "";
				candidateStep.updatedBy = ctx.token || "";

				const interviewStep =
					this.interviewStepRepository.create(candidateStep);
				await this.interviewStepRepository.save(interviewStep);

				return interviewStep;
			});

			const results = await Promise.all(promises);
			candidateSteps.push(...results);

			return candidateSteps;
		}
	}

	@Mutation(() => Candidate)
	async saveCandidate(
		@Arg("candidate") candidateInput: CandidateInput,
		@Ctx() ctx: MyContext
	): Promise<Candidate> {
		const candidateSteps = await this.getOrCreateCandidateSteps(
			ctx,
			candidateInput.steps
		);

		const newCandidate = new Candidate();
		newCandidate.name = candidateInput.name;
		newCandidate.email = candidateInput.email;
		newCandidate.role = candidateInput.role;
		newCandidate.level = getEnumValueFromKey(
			CandidateLevel,
			candidateInput.level
		);
		newCandidate.progress =
			candidateInput.progress || CandidateProgress.PENDING;
		newCandidate.location = candidateInput.location;
		newCandidate.status = CandidateStatus.OPEN;
		newCandidate.currentStep = candidateInput.currentStep || 0;
		newCandidate.steps = candidateSteps;
		newCandidate.createdBy = ctx.token || "";
		newCandidate.updatedBy = ctx.token || "";

		const candidate = this.candidateRepository.create(newCandidate);
		return await this.candidateRepository.save(candidate);
	}

	@Mutation(() => [Candidate])
	async saveCandidates(
		@Arg("candidates", () => [CandidateInput])
		candidatesInput: CandidateInput[],
		@Ctx() ctx: MyContext
	): Promise<Candidate[]> {
		const results = [];
		for (const candidateInput of candidatesInput) {
			const result = await this.saveCandidate(candidateInput, ctx);
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
		const currentCandidate = await this.candidateRepository.findOneOrFail({
			where: { id: id },
			relations: ["steps"],
		});

		currentCandidate.progress = getEnumValueFromKey(
			CandidateProgress,
			progress
		);
		if (currentStep !== undefined) {
			currentCandidate.currentStep = currentStep;
		}

		if (stepData) {
			const steps = [...currentCandidate.steps];

			const stepUpdate = JSON.parse(stepData);
			const stepIndex = steps.findIndex(
				(s) => s.indexPosition === stepUpdate.indexPosition
			);

			const previousStep = steps[stepIndex];

			if (stepIndex >= 0) {
				steps[stepIndex] = { ...steps[stepIndex], ...stepUpdate };
			}
			if (steps[stepIndex].status === InterviewStatus.REJECTED) {
				currentCandidate.progress = CandidateProgress.REJECTED;
				currentCandidate.status = CandidateStatus.CLOSED;
			}
			if (
				previousStep.status === InterviewStatus.REJECTED &&
				steps[stepIndex].status === InterviewStatus.PENDING
			) {
				currentCandidate.progress = CandidateProgress.PENDING;
				currentCandidate.status = CandidateStatus.OPEN;
			}
			const updatedStep = await this.interviewStepRepository.save(steps);
			currentCandidate.steps = updatedStep;
		}

		const updatedCandidate = await this.candidateRepository.save(
			currentCandidate
		);

		const latestCandidate = await this.candidate(updatedCandidate.id);
		if (latestCandidate === null) {
			throw new Error("Candidate not found");
		}
		return latestCandidate;
	}

	@Mutation(() => Candidate)
	async updateCandidateStatus(
		@Arg("id", () => ID) id: string,
		@Arg("status") status: string,
		@Arg("currentStep", () => Int, { nullable: true }) currentStep?: number,
		@Arg("stepData", { nullable: true }) stepData?: string
	): Promise<Candidate> {
		const candidate = await this.candidateRepository.findOneOrFail({
			where: { id: id },
			relations: ["steps"],
		});

		candidate.status = getEnumValueFromKey(CandidateStatus, status);
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
		@Arg("cvLink") cvLink: string
	): Promise<Candidate> {
		const candidate = await this.candidateRepository.findOneOrFail({
			where: { id: id },
			relations: ["steps"],
		});

		candidate.cvUrl = cvLink;

		return await this.candidateRepository.save(candidate);
	}
}

function getEnumValueFromKey<T extends Record<string, string | number>>(
	enumObj: T,
	key: string
): T[keyof T] {
	return enumObj[key as keyof T];
}
