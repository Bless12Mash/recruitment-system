import { InputType, Field, Int, ObjectType } from "type-graphql";
import { Candidate } from "../entities/Candidate";
import { CandidateLevel, CandidateStatus } from "../../../shared/enums";

@InputType()
export class PaginationInput {
	@Field(() => Int)
	page: number = 1;

	@Field(() => Int)
	pageSize: number = 10;
}

@InputType()
export class SortInput {
	@Field()
	field: string = "createdAt";

	@Field()
	order: "ASC" | "DESC" = "DESC";
}

@InputType()
export class CandidateFilterInput {
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

	@Field({ nullable: true })
	progress?: string;
}

@ObjectType()
export class PaginatedCandidates {
	@Field(() => [Candidate])
	items!: Candidate[];

	@Field(() => Int)
	total!: number;

	@Field(() => Int)
	page!: number;

	@Field(() => Int)
	pageSize!: number;

	@Field(() => Int)
	totalPages!: number;
}

@ObjectType()
@InputType()
export class InterviewStepInput {
	@Field()
	indexPosition!: number;

	@Field()
	name!: string;

	@Field()
	status!: string;

	@Field({ nullable: true })
	feedback?: string;

	@Field(() => Date, { nullable: true })
	completedAt?: Date;
}

@InputType()
export class CandidateInput {
	@Field()
	name!: string;

	@Field()
	email!: string;

	@Field()
	role!: string;

	@Field(() => CandidateLevel)
	level!: CandidateLevel;

	@Field({ nullable: true })
	progress?: string;

	@Field()
	location!: string;

	@Field(() => CandidateStatus, { nullable: true })
	status?: CandidateStatus;

	@Field(() => Int, { nullable: true })
	currentStep?: number;

	@Field(() => [InterviewStepInput], { nullable: true })
	steps?: InterviewStepInput[];

	@Field({ nullable: true })
	cvUrl?: string;
}
