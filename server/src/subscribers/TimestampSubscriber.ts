import {
	EntitySubscriberInterface,
	EventSubscriber,
	InsertEvent,
	UpdateEvent,
} from "typeorm";
import { AppDataSource } from "../data-source";
import { InterviewStepHistory } from "../entities/InterviewStepHistory";
import { CandidateHistory } from "./../entities/CandidateHistory";

@EventSubscriber()
export class TimestampSubscriber implements EntitySubscriberInterface<any> {
	private candidateHistoryRepository =
		AppDataSource.getRepository(CandidateHistory);
	private interviewStepHistoryRepository =
		AppDataSource.getRepository(InterviewStepHistory);
	listenTo() {
		return Object;
	}

	async beforeInsert(event: InsertEvent<any>) {
		const entity = event.entity;
		if (entity) {
			if (event.metadata.targetName === "InterviewStep") {
				const interviewStepHistory = new InterviewStepHistory();

				interviewStepHistory.name = entity.name;
				interviewStepHistory.indexPosition = entity.indexPosition;
				interviewStepHistory.interviewStep = entity;
				interviewStepHistory.feedback = entity.feedback;
				interviewStepHistory.status = entity.status;
				interviewStepHistory.createdBy = entity.createdBy;
				interviewStepHistory.updatedBy = entity.updatedBy;
				interviewStepHistory.completedAt = entity.completedAt;

				const interviewStep =
					this.interviewStepHistoryRepository.create(interviewStepHistory);
				await this.interviewStepHistoryRepository.save(interviewStep);
			}

			if (event.metadata.targetName === "Candidate") {
				const candidateHistory = new CandidateHistory();

				candidateHistory.name = entity.name;
				candidateHistory.candidate = entity;
				candidateHistory.currentStep = entity.currentStep;
				candidateHistory.cvUrl = entity.cvUrl;
				candidateHistory.email = entity.email;
				candidateHistory.level = entity.level;
				candidateHistory.location = entity.location;
				candidateHistory.progress = entity.progress;
				candidateHistory.status = entity.status;
				candidateHistory.steps = entity.steps;
				candidateHistory.role = entity.role;
				candidateHistory.updatedBy = entity.updatedBy;
				candidateHistory.createdBy = entity.createdBy;

				const candidate =
					this.candidateHistoryRepository.create(candidateHistory);
				await this.candidateHistoryRepository.save(candidate);
			}

			console.log({ entity });
		}
	}

	beforeUpdate(event: UpdateEvent<any>) {
		if (event.entity) {
			// event.entity.updatedAt = new Date();
		}
	}
}
