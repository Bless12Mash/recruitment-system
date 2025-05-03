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
		const can = await this.candidateRepository.findOne({
			where: { id: id },
			relations: ["steps"],
		});

		console.log({ can });

		return can;
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
				queryBuilder.andWhere("candidate.progress ILIKE :progress", {
					progress: `%${filter.progress}%`,
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

	async getOrCreateCandidateSteps(ctx: MyContext) {
		const interviewSteps = await this.interviewStepRepository.find();
		console.log({ interviewSteps });
		let candidateSteps: InterviewStep[] = [];
		console.log({ check: interviewSteps.length === 0 });
		if (interviewSteps.length === 0) {
			this.INTERVIEW_STEPS.map(async (step, index) => {
				const candidateStep = new InterviewStep();

				candidateStep.indexPosition = index;
				candidateStep.name = step;
				candidateStep.status = InterviewStatus.PENDING;
				candidateStep.createdBy = ctx.token || "";
				candidateStep.updatedBy = ctx.token || "";

				const interviewStep =
					this.interviewStepRepository.create(candidateStep);
				await this.interviewStepRepository.save(interviewStep);
				candidateSteps.push(candidateStep);
			});
		} else {
			candidateSteps = interviewSteps;
		}
		console.log({ candidateSteps });
		return candidateSteps;
	}

	@Mutation(() => Candidate)
	async saveCandidate(
		@Arg("candidate") candidateInput: CandidateInput,
		@Ctx() ctx: MyContext
	): Promise<Candidate> {
		const candidateSteps = await this.getOrCreateCandidateSteps(ctx);

		console.log({ candidateSteps });

		const newCandidate = new Candidate();
		newCandidate.name = candidateInput.name;
		newCandidate.email = candidateInput.email;
		newCandidate.role = candidateInput.role;
		newCandidate.level = getEnumValueFromKey(
			CandidateLevel,
			candidateInput.level
		);
		newCandidate.progress = CandidateProgress.PENDING;
		newCandidate.location = candidateInput.location;
		newCandidate.status = CandidateStatus.OPEN;
		newCandidate.currentStep = 0;
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
		const candidate = await this.candidateRepository.findOneOrFail({
			where: { id: id },
			relations: ["steps"],
		});

		candidate.progress = getEnumValueFromKey(CandidateProgress, progress);
		if (currentStep !== undefined) {
			candidate.currentStep = currentStep;
		}

		console.log({ candidate }, { step: candidate.steps });
		if (stepData) {
			const steps = [...candidate.steps];
			const stepUpdate = JSON.parse(stepData);
			const stepIndex = steps.findIndex(
				(s) => s.indexPosition === stepUpdate.indexPosition
			);
			if (stepIndex >= 0) {
				steps[stepIndex] = { ...steps[stepIndex], ...stepUpdate };
			}
			console.log({ steps });
			console.log({ stepData });
			const updatedStep = await this.interviewStepRepository.save(steps);
			candidate.steps = updatedStep;

			console.log({ cannyStep: candidate.steps });
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
		const candidate = await this.candidateRepository.findOneByOrFail({ id });

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
