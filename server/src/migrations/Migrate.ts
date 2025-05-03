import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrate implements MigrationInterface {
	name = "Migration1746250408128";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "candidate_interviews" DROP CONSTRAINT "FK_24cebac97b03f33f4dd036355d3"`
		);
		await queryRunner.query(
			`ALTER TABLE "interview_step_history" DROP CONSTRAINT "FK_7f89f97e22138d3cdd5d33ee4cf"`
		);
		await queryRunner.query(
			`ALTER TABLE "interview_step_history" DROP COLUMN "interviewStepId"`
		);
		await queryRunner.query(
			`ALTER TABLE "interview_step_history" ADD "interviewStepId" uuid`
		);
		await queryRunner.query(
			`ALTER TABLE "interview_step" DROP CONSTRAINT "PK_96703053392246374a73b073393"`
		);
		await queryRunner.query(`ALTER TABLE "interview_step" DROP COLUMN "id"`);
		await queryRunner.query(
			`ALTER TABLE "interview_step" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`
		);
		await queryRunner.query(
			`ALTER TABLE "interview_step" ADD CONSTRAINT "PK_96703053392246374a73b073393" PRIMARY KEY ("id")`
		);
		await queryRunner.query(
			`ALTER TABLE "candidate_interviews" DROP CONSTRAINT "PK_52edf4f46ede6c80fd50c7aa6a6"`
		);
		await queryRunner.query(
			`ALTER TABLE "candidate_interviews" ADD CONSTRAINT "PK_eca9f08af6577845a157bad6e95" PRIMARY KEY ("candidate_id")`
		);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_24cebac97b03f33f4dd036355d"`
		);
		await queryRunner.query(
			`ALTER TABLE "candidate_interviews" DROP COLUMN "interviewStep_id"`
		);
		await queryRunner.query(
			`ALTER TABLE "candidate_interviews" ADD "interviewStep_id" uuid NOT NULL`
		);
		await queryRunner.query(
			`ALTER TABLE "candidate_interviews" DROP CONSTRAINT "PK_eca9f08af6577845a157bad6e95"`
		);
		await queryRunner.query(
			`ALTER TABLE "candidate_interviews" ADD CONSTRAINT "PK_52edf4f46ede6c80fd50c7aa6a6" PRIMARY KEY ("candidate_id", "interviewStep_id")`
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_24cebac97b03f33f4dd036355d" ON "candidate_interviews" ("interviewStep_id") `
		);
		await queryRunner.query(
			`ALTER TABLE "interview_step_history" ADD CONSTRAINT "FK_7f89f97e22138d3cdd5d33ee4cf" FOREIGN KEY ("interviewStepId") REFERENCES "interview_step"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "candidate_interviews" ADD CONSTRAINT "FK_24cebac97b03f33f4dd036355d3" FOREIGN KEY ("interviewStep_id") REFERENCES "interview_step"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "candidate_interviews" DROP CONSTRAINT "FK_24cebac97b03f33f4dd036355d3"`
		);
		await queryRunner.query(
			`ALTER TABLE "interview_step_history" DROP CONSTRAINT "FK_7f89f97e22138d3cdd5d33ee4cf"`
		);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_24cebac97b03f33f4dd036355d"`
		);
		await queryRunner.query(
			`ALTER TABLE "candidate_interviews" DROP CONSTRAINT "PK_52edf4f46ede6c80fd50c7aa6a6"`
		);
		await queryRunner.query(
			`ALTER TABLE "candidate_interviews" ADD CONSTRAINT "PK_eca9f08af6577845a157bad6e95" PRIMARY KEY ("candidate_id")`
		);
		await queryRunner.query(
			`ALTER TABLE "candidate_interviews" DROP COLUMN "interviewStep_id"`
		);
		await queryRunner.query(
			`ALTER TABLE "candidate_interviews" ADD "interviewStep_id" integer NOT NULL`
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_24cebac97b03f33f4dd036355d" ON "candidate_interviews" ("interviewStep_id") `
		);
		await queryRunner.query(
			`ALTER TABLE "candidate_interviews" DROP CONSTRAINT "PK_eca9f08af6577845a157bad6e95"`
		);
		await queryRunner.query(
			`ALTER TABLE "candidate_interviews" ADD CONSTRAINT "PK_52edf4f46ede6c80fd50c7aa6a6" PRIMARY KEY ("candidate_id", "interviewStep_id")`
		);
		await queryRunner.query(
			`ALTER TABLE "interview_step" DROP CONSTRAINT "PK_96703053392246374a73b073393"`
		);
		await queryRunner.query(`ALTER TABLE "interview_step" DROP COLUMN "id"`);
		await queryRunner.query(
			`ALTER TABLE "interview_step" ADD "id" SERIAL NOT NULL`
		);
		await queryRunner.query(
			`ALTER TABLE "interview_step" ADD CONSTRAINT "PK_96703053392246374a73b073393" PRIMARY KEY ("id")`
		);
		await queryRunner.query(
			`ALTER TABLE "interview_step_history" DROP COLUMN "interviewStepId"`
		);
		await queryRunner.query(
			`ALTER TABLE "interview_step_history" ADD "interviewStepId" integer`
		);
		await queryRunner.query(
			`ALTER TABLE "interview_step_history" ADD CONSTRAINT "FK_7f89f97e22138d3cdd5d33ee4cf" FOREIGN KEY ("interviewStepId") REFERENCES "interview_step"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "candidate_interviews" ADD CONSTRAINT "FK_24cebac97b03f33f4dd036355d3" FOREIGN KEY ("interviewStep_id") REFERENCES "interview_step"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
	}
}
