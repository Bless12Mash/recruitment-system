import { InterviewStatus } from '../../types/interview';
import { CheckCircle2, XCircle, Circle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

export const getStepIcon = (status: InterviewStatus) => {
    switch (status) {
        case 'completed':
            return <CheckCircle2 className="h-6 w-6 text-green-500" />;
        case 'rejected':
            return <XCircle className="h-6 w-6 text-red-500" />;
        default:
            return <Circle className="h-6 w-6 text-gray-300" />;
    }
};

export const KeyboardShortcuts = () => (
    <div className="text-sm text-muted-foreground mb-4">
        <p>Keyboard shortcuts:</p>
        <ul className="mt-1 space-y-1">
            <li>Press <kbd className="px-2 py-1 bg-muted rounded">n</kbd> to move to next step</li>
            <li>Press <kbd className="px-2 py-1 bg-muted rounded">r</kbd> to reject candidate</li>
            <li>Press <kbd className="px-2 py-1 bg-muted rounded">Alt</kbd> + <kbd className="px-2 py-1 bg-muted rounded">↑</kbd>/<kbd className="px-2 py-1 bg-muted rounded">↓</kbd> to navigate steps</li>
            <li>Press <kbd className="px-2 py-1 bg-muted rounded">Esc</kbd> to return to list view</li>
        </ul>
    </div>
);

interface CandidateHeaderProps {
    name: string;
    role: string;
    level: string;
    location: string;
    progress: string;
    status: string;
    onCVUpload: (file: File) => void;
}

export const CandidateHeader = ({
    name,
    role,
    level,
    location,
    progress,
    status,
    onCVUpload
}: CandidateHeaderProps) => (
    <div className="flex justify-between items-start">
        <div>
            <h2 className="text-2xl font-bold">{name}</h2>
            <p className="text-muted-foreground">{role} - {level}</p>
            <p className="text-sm text-muted-foreground mt-1">
                Location: <span className="font-medium">{location}</span>
            </p>
            <p className="text-sm text-muted-foreground mt-1">
                Progress: <span className={cn(
                    "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                    {
                        "bg-green-50 text-green-700": progress === "Hired" || progress === "Offer Accepted",
                        "bg-red-50 text-red-700": progress === "Rejected" || progress === "Offer Rejected",
                        "bg-yellow-50 text-yellow-700": progress === "On Hold",
                        "bg-blue-50 text-blue-700": progress === "Shortlisted",
                        "bg-gray-50 text-gray-700": progress === "Pending",
                        "bg-purple-50 text-purple-700": progress === "Offered",
                    }
                )}>{progress}</span>
            </p>
            <p className="text-sm text-muted-foreground mt-1">
                Status: <span className={cn(
                    "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                    status === 'Open' ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-700"
                )}>{status}</span>
            </p>
        </div>
        <div className="w-64">
            <input
                type="file"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                        onCVUpload(file);
                    }
                }}
                accept=".pdf, .doc, .docx"
                className="w-full"
            />
        </div>
    </div>
);

interface StepFeedbackProps {
    isActive: boolean;
    feedback: string;
    feedbackError: string;
    stepStatus: InterviewStatus;
    currentStep: number;
    stepIndex: number;
    onFeedbackChange: (value: string) => void;
    onUpdateStep: (index: number, action: 'next' | 'reject' | 'update') => void;
}

export const StepFeedback = ({
    isActive,
    feedback,
    feedbackError,
    stepStatus,
    currentStep,
    stepIndex,
    onFeedbackChange,
    onUpdateStep
}: StepFeedbackProps) => (
    <div className="space-y-4">
        <div>
            <Textarea
                placeholder="Enter feedback for this step..."
                value={feedback}
                onChange={(e) => onFeedbackChange(e.target.value)}
                className={cn(
                    "min-h-[100px]",
                    feedbackError && "border-red-500 focus-visible:ring-red-500"
                )}
                disabled={stepStatus !== 'pending' && stepIndex !== currentStep}
            />
            {feedbackError && (
                <p className="mt-1 text-sm text-red-500">{feedbackError}</p>
            )}
        </div>
        {isActive && (
            <div className="flex gap-2">
                <Button
                    variant="default"
                    onClick={() => onUpdateStep(stepIndex, 'next')}
                >
                    Move to Next Step
                </Button>
                <Button
                    variant="destructive"
                    onClick={() => onUpdateStep(stepIndex, 'reject')}
                >
                    Reject Candidate
                </Button>
            </div>
        )}
        {stepStatus !== 'pending' && stepIndex !== currentStep && (
            <Button
                variant="outline"
                onClick={() => onUpdateStep(stepIndex, 'update')}
            >
                Update Feedback
            </Button>
        )}
    </div>
);