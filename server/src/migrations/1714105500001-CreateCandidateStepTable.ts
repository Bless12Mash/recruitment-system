import {
	MigrationInterface,
	QueryRunner,
	Table,
	TableForeignKey,
} from "typeorm";

export class CreateCandidateStepTable1714105500001
	implements MigrationInterface
{
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: "candidate_step",
				columns: [
					{
						name: "id",
						type: "uuid",
						isPrimary: true,
						isGenerated: true,
						generationStrategy: "uuid",
					},
					{
						name: "candidateId",
						type: "uuid",
					},
					{
						name: "name",
						type: "varchar",
					},
					{
						name: "status",
						type: "varchar",
					},
					{
						name: "feedback",
						type: "text",
						isNullable: true,
					},
					{
						name: "stepOrder",
						type: "integer",
					},
					{
						name: "completedAt",
						type: "timestamp",
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

		await queryRunner.createForeignKey(
			"candidate_step",
			new TableForeignKey({
				columnNames: ["candidateId"],
				referencedColumnNames: ["id"],
				referencedTableName: "candidate",
				onDelete: "CASCADE",
			})
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		const table = await queryRunner.getTable("candidate_step");
		if (table) {
			const foreignKey = table.foreignKeys.find(
				(fk) => fk.columnNames.indexOf("candidateId") !== -1
			);
			if (foreignKey) {
				await queryRunner.dropForeignKey("candidate_step", foreignKey);
			}
		}
		await queryRunner.dropTable("candidate_step");
	}
}
