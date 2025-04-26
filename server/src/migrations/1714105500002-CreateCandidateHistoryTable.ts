import {
	MigrationInterface,
	QueryRunner,
	Table,
	TableForeignKey,
	TableIndex,
} from "typeorm";

export class CreateCandidateHistoryTable1714105500002
	implements MigrationInterface
{
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: "candidate_history",
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
						name: "field",
						type: "varchar",
						comment:
							"The field that was changed (e.g., status, progress, step)",
					},
					{
						name: "oldValue",
						type: "jsonb",
						isNullable: true,
						comment: "Previous value of the field",
					},
					{
						name: "newValue",
						type: "jsonb",
						comment: "New value of the field",
					},
					{
						name: "operation",
						type: "varchar",
						comment: "Type of operation (update, step_change, etc)",
					},
					{
						name: "performedBy",
						type: "varchar",
						comment: "User who made the change",
					},
					{
						name: "createdAt",
						type: "timestamp",
						default: "now()",
					},
				],
			}),
			true
		);

		await queryRunner.createForeignKey(
			"candidate_history",
			new TableForeignKey({
				columnNames: ["candidateId"],
				referencedColumnNames: ["id"],
				referencedTableName: "candidate",
				onDelete: "CASCADE",
			})
		);

		// Create indexes for better query performance
		await queryRunner.createIndex(
			"candidate_history",
			new TableIndex({
				name: "IDX_CANDIDATE_HISTORY_CANDIDATE",
				columnNames: ["candidateId"],
			})
		);

		await queryRunner.createIndex(
			"candidate_history",
			new TableIndex({
				name: "IDX_CANDIDATE_HISTORY_FIELD",
				columnNames: ["field"],
			})
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		const table = await queryRunner.getTable("candidate_history");
		if (table) {
			const foreignKey = table.foreignKeys.find(
				(fk) => fk.columnNames.indexOf("candidateId") !== -1
			);
			if (foreignKey) {
				await queryRunner.dropForeignKey("candidate_history", foreignKey);
			}
		}

		await queryRunner.dropIndex(
			"candidate_history",
			"IDX_CANDIDATE_HISTORY_CANDIDATE"
		);
		await queryRunner.dropIndex(
			"candidate_history",
			"IDX_CANDIDATE_HISTORY_FIELD"
		);
		await queryRunner.dropTable("candidate_history");
	}
}
