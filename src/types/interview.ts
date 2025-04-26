export type CandidateLevel = 'Junior' | 'Mid' | 'Senior' | 'Lead';
export type InterviewStatus = 'pending' | 'completed' | 'rejected';
export type CandidateStatus = 'Open' | 'Closed';

export const INTERVIEW_STEPS = [
  'Resume Screening',
  'Technical Assessment',
  'Technical Interview',
  'Culture Fit Interview',
  'Final Interview'
] as const;

export interface InterviewStep {
  id: number;
  name: string;
  status: InterviewStatus;
  feedback?: string;
  completedAt?: Date;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  role: string;
  level: CandidateLevel;
  status: CandidateStatus;
  currentStep: number;
  steps: InterviewStep[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  cv?: File;
}