import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
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

@ObjectType()
@Entity()
export class Candidate {
	@Field(() => ID)
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Field()
	@Column()
	name: string;

	@Field()
	@Column()
	email: string;

	@Field()
	@Column()
	role: string;

	@Field()
	@Column()
	level: string;

	@Field()
	@Column()
	progress: string;

	@Field()
	@Column()
	location: string;

	@Field()
	@Column()
	status: string;

	@Field()
	@Column({ default: 0 })
	currentStep: number;

	@Field(() => [InterviewStep])
	@Column("jsonb", { default: [] })
	steps: InterviewStep[];

	@Field()
	@Column()
	createdBy: string;

	@Field()
	@CreateDateColumn()
	createdAt: Date;

	@Field()
	@UpdateDateColumn()
	updatedAt: Date;

	@Field({ nullable: true })
	@Column({ nullable: true })
	cvUrl?: string;
}
