export type CandidateLevel = "Junior" | "Mid" | "Senior" | "Lead";
export type InterviewStatus = "pending" | "completed" | "rejected";
export type CandidateStatus = "Open" | "Closed";
export type CandidateProgress =
	| "Hired"
	| "Rejected"
	| "On Hold"
	| "Shortlisted"
	| "Pending"
	| "Offered"
	| "Offer Accepted"
	| "Offer Rejected";

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
	progress: CandidateProgress;
	location: string;
	status: CandidateStatus;
	currentStep: number;
	steps?: InterviewStep[];
	createdAt?: Date;
	updatedAt?: Date;
	createdBy: string;
	cvUrl?: string;
}
