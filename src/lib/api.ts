import { Candidate } from "../types/interview";

const API_BASE_URL = "http://localhost:3000/api";

export const candidateApi = {
	async getAllCandidates(): Promise<Candidate[]> {
		const query = `
            query GetAllCandidates {
                candidates {
                    id
                    name
                    email
                    role
                    level
                    progress
                    location
                    status
                    currentStep
                    steps {
                        id
                        name
                        status
                        feedback
                        completedAt
                    }
                    createdAt
                    updatedAt
                    createdBy
                }
            }
        `;

		const response = await fetch(API_BASE_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ query }),
		});

		const result = await response.json();

		if (result.errors) {
			throw new Error(result.errors[0].message);
		}

		return result.data.candidates;
	},

	async candidate(id: string): Promise<Candidate> {
		const query = `
			query GetCandidate($id: ID!) {
				candidate(id: $id) {
					id
					name
					email
					role
					level
					progress
					location
					status
					currentStep
					steps {
						id
						name
						status
						feedback
						completedAt
					}
					createdAt
					updatedAt
					createdBy
					cvUrl
				}
			}
		`;

		const response = await fetch(API_BASE_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				query,
				variables: { id },
			}),
		});

		const result = await response.json();

		if (result.errors) {
			throw new Error(result.errors[0].message);
		}

		return result.data.candidate;
	},

	async saveCandidate(candidate: Candidate): Promise<Candidate> {
		const mutation = `
            mutation SaveCandidate($candidate: CandidateInput!) {
                saveCandidate(candidate: $candidate) {
                    id
                    name
                    email
                    role
                    level
                    progress
                    location
                    status
                    currentStep
                    steps {
                        id
                        name
                        status
                        feedback
                        completedAt
                    }
                    createdAt
                    updatedAt
                    createdBy
                }
            }
        `;

		const response = await fetch(API_BASE_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				query: mutation,
				variables: {
					candidate: {
						name: candidate.name,
						email: candidate.email,
						role: candidate.role,
						level: candidate.level,
						progress: candidate.progress,
						location: candidate.location,
						status: candidate.status,
						currentStep: candidate.currentStep,
						steps: candidate.steps,
						createdBy: candidate.createdBy,
					},
				},
			}),
		});

		const result = await response.json();

		if (result.errors) {
			throw new Error(result.errors[0].message);
		}

		return result.data.saveCandidate;
	},

	async saveCandidates(candidates: Candidate[]): Promise<Candidate[]> {
		const mutation = `
            mutation SaveCandidates($candidates: [CandidateInput!]!) {
                saveCandidates(candidates: $candidates) {
                    id
                    name
                    email
                    role
                    level
                    progress
                    location
                    status
                    currentStep
                    steps {
                        id
                        name
                        status
                        feedback
                        completedAt
                    }
                    createdAt
                    updatedAt
                    createdBy
                }
            }
        `;

		const response = await fetch(API_BASE_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				query: mutation,
				variables: {
					candidates: candidates,
				},
			}),
		});

		const result = await response.json();

		if (result.errors) {
			throw new Error(result.errors[0].message);
		}

		return result.data.saveCandidates;
	},

	async updateCandidateProgress(
		id: string,
		progress: string,
		currentStep?: number,
		stepData?: {
			id: number;
			status: string;
			feedback?: string;
			completedAt?: Date;
		}
	): Promise<Candidate> {
		const mutation = `
            mutation UpdateCandidateProgress($id: ID!, $progress: String!, $currentStep: Int, $stepData: String) {
                updateCandidateProgress(id: $id, progress: $progress, currentStep: $currentStep, stepData: $stepData) {
                    id
                    name
                    email
                    role
                    level
                    progress
                    location
                    status
                    currentStep
                    steps {
                        id
                        name
                        status
                        feedback
                        completedAt
                    }
                    createdAt
                    updatedAt
                    createdBy
                }
            }
        `;

		const response = await fetch(API_BASE_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				query: mutation,
				variables: {
					id,
					progress,
					currentStep,
					stepData: stepData ? JSON.stringify(stepData) : undefined,
				},
			}),
		});

		const result = await response.json();

		if (result.errors) {
			throw new Error(result.errors[0].message);
		}

		return result.data.updateCandidateProgress;
	},

	async updateCandidateStatus(
		id: string,
		status: string,
		currentStep?: number,
		stepData?: {
			id: number;
			status: string;
			feedback?: string;
			completedAt?: Date;
		}
	): Promise<Candidate> {
		const mutation = `
            mutation UpdateCandidateStatus($id: ID!, $status: String!, $currentStep: Int, $stepData: String) {
                updateCandidateStatus(id: $id, status: $status, currentStep: $currentStep, stepData: $stepData) {
                    id
                    name
                    email
                    role
                    level
                    progress
                    location
                    status
                    currentStep
                    steps {
                        id
                        name
                        status
                        feedback
                        completedAt
                    }
                    createdAt
                    updatedAt
                    createdBy
                }
            }
        `;

		const response = await fetch(API_BASE_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				query: mutation,
				variables: {
					id,
					status,
					currentStep,
					stepData: stepData ? JSON.stringify(stepData) : undefined,
				},
			}),
		});

		const result = await response.json();

		if (result.errors) {
			throw new Error(result.errors[0].message);
		}

		return result.data.updateCandidateStatus;
	},

	async uploadCV(id: string, file: File): Promise<Candidate> {
		const operations = {
			query: `
				mutation UploadCV($id: ID!, $file: Upload!) {
					uploadCV(id: $id, file: $file) {
						id
						name
						email
						role
						level
						progress
						location
						status
						currentStep
						steps {
							id
							name
							status
							feedback
							completedAt
						}
						createdAt
						updatedAt
						createdBy
						cvUrl
					}
				}
			`,
			variables: {
				id,
				file: null,
			},
		};

		const map = {
			"0": ["variables.file"],
		};

		const formData = new FormData();
		formData.append("operations", JSON.stringify(operations));
		formData.append("map", JSON.stringify(map));
		formData.append("0", file);

		console.log({ formData });

		const response = await fetch(API_BASE_URL, {
			method: "POST",
			body: formData,
		});

		const result = await response.json();

		console.log({ result });

		if (result.errors) {
			throw new Error(result.errors[0].message);
		}

		return result.data.uploadCV;
	},
};

export interface PaginationInput {
	page?: number;
	pageSize?: number;
}

export interface SortInput {
	field: string;
	order: "ASC" | "DESC";
}

export interface FilterInput {
	name?: string;
	email?: string;
	role?: string;
	level?: string;
	status?: string;
	location?: string;
}

export interface PaginatedCandidates {
	items: Candidate[];
	total: number;
	page: number;
	pageSize: number;
	totalPages: number;
}

export const fetchPaginatedCandidates = async (
	pagination?: PaginationInput,
	sort?: SortInput,
	filter?: FilterInput
): Promise<PaginatedCandidates> => {
	const query = `
    query PaginatedCandidates($pagination: PaginationInput, $sort: SortInput, $filter: CandidateFilterInput) {
      paginatedCandidates(pagination: $pagination, sort: $sort, filter: $filter) {
        items {
          id
          name
          email
          role
          level
          progress
          location
          status
          currentStep
          cvUrl
          createdAt
          updatedAt
        }
        total
        page
        pageSize
        totalPages
      }
    }
  `;

	const response = await fetch(API_BASE_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			query,
			variables: { pagination, sort, filter },
		}),
	});

	const { data, errors } = await response.json();
	if (errors) {
		throw new Error(errors[0].message);
	}

	return data.paginatedCandidates;
};
