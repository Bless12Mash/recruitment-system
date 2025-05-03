import { Field, ObjectType, registerEnumType } from "type-graphql";
import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	Relation,
	UpdateDateColumn,
} from "typeorm";

import { InterviewStatus } from "../../../shared/enums";
import { InterviewStep } from "./InterviewStep";

registerEnumType(InterviewStatus, {
	name: "InterviewStatus",
	description: "The role of the user",
});

@ObjectType()
@Entity()
export class InterviewStepHistory {
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

	@ManyToOne(() => InterviewStep, (interviewStep) => interviewStep.history, {
		onDelete: "CASCADE",
	})
	interviewStep!: InterviewStep;
}
