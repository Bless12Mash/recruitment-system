import {
	CandidateLevel,
	CandidateProgress,
	CandidateStatus,
	InterviewStatus,
} from "../../../shared/enums";

export interface InterviewStep {
	id: number;
	name: string;
	status: InterviewStatus;
	feedback?: string;
	completedAt?: Date;
}

export interface Candidate {
	id?: string;
	name: string;
	email: string;
	role: string;
	level: CandidateLevel;
	progress?: CandidateProgress;
	location: string;
	status?: CandidateStatus;
	currentStep: number;
	steps?: InterviewStep[];
	createdAt?: Date;
	updatedAt?: Date;
	createdBy: string;
	cvUrl?: string;
}
