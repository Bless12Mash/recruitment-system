import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as XLSX from "xlsx-js-style";
import { Candidate } from "../types/interview";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function parseExcelData(file: File): Promise<Candidate[]> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const data = new Uint8Array(e.target?.result as ArrayBuffer);
				const workbook = XLSX.read(data, { type: "array" });
				const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
				const jsonData = XLSX.utils.sheet_to_json(firstSheet);

				const candidates: Candidate[] = jsonData.map((row: any) => ({
					name: row.name,
					email: row.email,
					role: row.role,
					level: row.level,
					progress: row.progress || "Pending",
					location: row.location,
					status: "Open",
					currentStep: 0,
					createdBy: row.createdBy || "System Import",
				}));

				resolve(candidates);
			} catch (error) {
				reject(error);
			}
		};
		reader.onerror = (error) => reject(error);
		reader.readAsArrayBuffer(file);
	});
}

export function formatDate(date: Date): string {
	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	}).format(date);
}

export function updateCandidateStep(
	candidate: Candidate,
	stepId: number,
	action: "next" | "reject" | "update" | "back" | "unreject",
	feedback?: string
): Candidate {
	if (candidate.steps === undefined) return candidate;
	const updatedSteps = [...candidate.steps];
	const currentStep = updatedSteps[stepId];

	if (action === "next") {
		currentStep.status = "completed";
		currentStep.completedAt = new Date();
		currentStep.feedback = feedback;

		if (stepId < updatedSteps.length - 1) {
			candidate.currentStep = stepId + 1;
		} else {
			candidate.status = "Closed";
		}
	} else if (action === "reject") {
		currentStep.status = "rejected";
		currentStep.completedAt = new Date();
		currentStep.feedback = feedback;
		candidate.status = "Closed";
	} else if (action === "update" && feedback) {
		currentStep.feedback = feedback;
	} else if (action === "back") {
		if (stepId > 0) {
			currentStep.feedback = "";
			currentStep.status = "pending";
			currentStep.completedAt = undefined;

			candidate.currentStep = stepId - 1;

			const previousStep = updatedSteps[stepId - 1];
			previousStep.status = "pending";
		}
	} else if (action === "unreject") {
		currentStep.status = "pending";
		currentStep.completedAt = undefined;
		candidate.status = "Open";
		candidate.currentStep = stepId;
	}

	return {
		...candidate,
		steps: updatedSteps,
		updatedAt: new Date(),
	};
}
