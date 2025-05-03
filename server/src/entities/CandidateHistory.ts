import { Field, ID, ObjectType } from "type-graphql";
import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	Relation,
	UpdateDateColumn,
} from "typeorm";

import { Candidate } from "./Candidate";
import { InterviewStep } from "./InterviewStep";

import {
	CandidateLevel,
	CandidateProgress,
	CandidateStatus,
} from "../../../shared/enums";

@Entity()
@ObjectType()
export class CandidateHistory {
	@Field(() => ID)
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Field()
	@Column()
	name!: string;

	@Field()
	@Column()
	email!: string;

	@Field()
	@Column()
	role!: string;

	@Field(() => CandidateLevel)
	@Column({
		type: "enum",
		enum: CandidateLevel,
	})
	level!: CandidateLevel;

	@Field(() => CandidateProgress)
	@Column({
		type: "enum",
		enum: CandidateProgress,
	})
	progress!: CandidateProgress;

	@Field()
	@Column()
	location!: string;

	@Field(() => CandidateStatus)
	@Column({
		type: "enum",
		enum: CandidateStatus,
	})
	status!: CandidateStatus;

	@Field()
	@Column({ default: 0 })
	currentStep!: number;

	@Field(() => [InterviewStep])
	@Column("jsonb", { default: [] })
	steps!: InterviewStep[];

	@Field()
	@Column()
	createdBy!: string;

	@Field()
	@CreateDateColumn()
	createdAt!: Date;

	@Field()
	@Column()
	updatedBy!: string;

	@Field()
	@UpdateDateColumn()
	updatedAt!: Date;

	@Field({ nullable: true })
	@Column({ nullable: true })
	cvUrl?: string;

	@ManyToOne(() => Candidate, (candidate) => candidate.history, {
		onDelete: "CASCADE",
	})
	candidate!: Candidate;
}
