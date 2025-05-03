import { Field, ObjectType } from "type-graphql";
import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToMany,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { InterviewStatus } from "../../../shared/enums";
import { Candidate } from "./Candidate";
import { InterviewStepHistory } from "./InterviewStepHistory";

@Entity()
@ObjectType()
export class InterviewStep {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Field()
	@Column()
	indexPosition!: number;

	@Field()
	@Column()
	name!: string;

	@Field(() => InterviewStatus)
	@Column({
		type: "enum",
		enum: InterviewStatus,
	})
	status!: InterviewStatus;

	@Field({ nullable: true })
	@Column({ nullable: true })
	feedback?: string;

	@Field(() => Date, { nullable: true })
	@Column({ nullable: true })
	completedAt?: Date;

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

	@OneToMany(() => InterviewStepHistory, (history) => history.interviewStep)
	history!: InterviewStepHistory[];

	@Field(() => [Candidate])
	@ManyToMany(() => Candidate, (candidate) => candidate.steps, {
		onDelete: "CASCADE",
	})
	candidate!: Candidate[];
}
