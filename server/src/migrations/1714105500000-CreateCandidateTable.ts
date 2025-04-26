import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateCandidateTable1714105500000 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: "candidate",
				columns: [
					{
						name: "id",
						type: "uuid",
						isPrimary: true,
						isGenerated: true,
						generationStrategy: "uuid",
					},
					{
						name: "name",
						type: "varchar",
					},
					{
						name: "email",
						type: "varchar",
						isUnique: true,
					},
					{
						name: "role",
						type: "varchar",
					},
					{
						name: "level",
						type: "varchar",
					},
					{
						name: "progress",
						type: "varchar",
					},
					{
						name: "location",
						type: "varchar",
					},
					{
						name: "status",
						type: "varchar",
					},
					{
						name: "currentStep",
						type: "integer",
						default: 0,
					},
					{
						name: "steps",
						type: "jsonb",
						default: "[]",
					},
					{
						name: "createdBy",
						type: "varchar",
					},
					{
						name: "cvUrl",
						type: "varchar",
						isNullable: true,
					},
					{
						name: "createdAt",
						type: "timestamp",
						default: "now()",
					},
					{
						name: "updatedAt",
						type: "timestamp",
						default: "now()",
					},
				],
			}),
			true
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable("candidate");
	}
}
