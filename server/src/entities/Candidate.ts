import { Field, ID, ObjectType, registerEnumType } from "type-graphql";
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	Relation,
	UpdateDateColumn,
} from "typeorm";

import {
	CandidateLevel,
	CandidateProgress,
	CandidateStatus,
} from "../../../shared/enums";
import { CandidateHistory } from "./CandidateHistory";
import { InterviewStep } from "./InterviewStep";

registerEnumType(CandidateLevel, {
	name: "CandidateLevel",
	description: "The level of the candidate",
});

registerEnumType(CandidateProgress, {
	name: "CandidateProgress",
	description: "The progress of the candidate",
});

registerEnumType(CandidateStatus, {
	name: "CandidateStatus",
	description: "The status of the candidate",
});

@ObjectType()
@Entity()
export class Candidate {
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

	@Field(() => [InterviewStep])
	@ManyToMany(() => InterviewStep, (interviews) => interviews.candidate, {
		onDelete: "CASCADE",
	})
	@JoinTable({
		name: "candidate_interviews",
		joinColumn: {
			name: "candidate_id",
			referencedColumnName: "id",
		},
		inverseJoinColumn: {
			name: "interviewStep_id",
			referencedColumnName: "id",
		},
	})
	steps!: InterviewStep[];

	@OneToMany(() => CandidateHistory, (history) => history.candidate)
	history!: CandidateHistory;
}
