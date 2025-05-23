import { CheckCircle2, XCircle, Circle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { InterviewStatus, CandidateProgress, CandidateStatus } from '../../../../shared/enums';

export const getStepIcon = (status: InterviewStatus) => {
    switch (status) {
        case InterviewStatus.COMPLETED:
            return <CheckCircle2 className="h-6 w-6 text-green-500" />;
        case InterviewStatus.REJECTED:
            return <XCircle className="h-6 w-6 text-red-500" />;
        default:
            return <Circle className="h-6 w-6 text-gray-300" />;
    }
};

export const KeyboardShortcuts = () => (
    <div className="text-sm text-muted-foreground mb-4 text-start">
        <ul className="mt-1 space-y-1">
            <li><p className="mb-4">Keyboard shortcuts:</p></li>
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
    progress?: CandidateProgress;
    status?: CandidateStatus;
    cvLink?: string;
    onCVUpload: (cvLink: string) => void;
    onStatusChange: () => void;
    onProgressChange?: (progress: CandidateProgress) => void;
}

export const CandidateHeader = ({
    name,
    role,
    level,
    location,
    progress,
    status,
    cvLink,
    onCVUpload,
    onStatusChange,
    onProgressChange
}: CandidateHeaderProps) => (
    <div className="flex justify-between items-start">
        <div>
            <h2 className="text-2xl font-bold">{name}</h2>
            <p className="text-muted-foreground">{role} - {level}</p>
            <p className="text-sm text-muted-foreground mt-1">
                Location: <span className="font-medium">{location}</span>
            </p>
            <p className="text-sm text-muted-foreground mt-1">
                Progress:
                <Select value={progress} onValueChange={onProgressChange}>
                    <SelectTrigger className="w-[180px] ml-2">
                        <SelectValue>{progress}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {Object.keys(CandidateProgress).map((progress) => <SelectItem value={progress}>{progress}</SelectItem>)}
                    </SelectContent>
                </Select>
            </p>
            <p className="text-sm text-muted-foreground mt-1">
                Status: <button
                    onClick={onStatusChange}
                    className={cn(
                        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium cursor-pointer transition-colors",
                        status === CandidateStatus.OPEN ? "bg-green-50 text-green-700 hover:bg-green-100" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    )}
                >
                    {status}
                </button>
            </p>
        </div>
        <div className="w-64">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Add CV link here
            </label>
            <div className="space-y-2">
                <input
                    type="text"
                    onChange={(e) => {
                        onCVUpload(e.target.value);
                    }}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm text-gray-700"
                />
                {cvLink && (
                    <a
                        href={cvLink}
                        className="text-green-500"
                    >
                        Candidate CV.... click this link
                    </a>
                )}
            </div>
            <div className="mt-8">
                <KeyboardShortcuts />
            </div>
        </div>
    </div >
);

interface StepFeedbackProps {
    isActive: boolean;
    feedback: string;
    feedbackError: string;
    stepStatus: InterviewStatus;
    currentStep: number;
    stepIndex: number;
    steps: { status: InterviewStatus }[] | undefined;
    onFeedbackChange: (value: string) => void;
    onUpdateStep: (index: number, action: 'next' | 'reject' | 'update' | 'back' | 'unreject') => void;
}

export const StepFeedback = ({
    isActive,
    feedback,
    feedbackError,
    stepStatus,
    currentStep,
    stepIndex,
    steps,
    onFeedbackChange,
    onUpdateStep
}: StepFeedbackProps) => {
    const canMoveToNext = stepIndex === currentStep && steps &&
        (stepIndex === 0 || steps[stepIndex - 1]?.status === InterviewStatus.COMPLETED);

    return (
        <div className="space-y-4">
            <div>
                {!isActive && stepStatus !== InterviewStatus.PENDING && (
                    <div className="mb-4">
                        <h4 className="text-sm font-medium mb-2">
                            {stepStatus === InterviewStatus.COMPLETED ? 'Completed with feedback:' : 'Rejected with feedback:'}
                        </h4>
                        <div className="text-sm bg-muted/50 p-4 rounded-md whitespace-pre-wrap">
                            {feedback}
                        </div>
                    </div>
                )}
                <Textarea
                    placeholder={isActive ? "Enter feedback for this step..." : "View feedback for this step"}
                    value={feedback}
                    onChange={(e) => onFeedbackChange(e.target.value)}
                    className={cn(
                        "min-h-[100px]",
                        feedbackError && "border-red-500 focus-visible:ring-red-500",
                        !isActive && stepStatus === InterviewStatus.PENDING && "opacity-50"
                    )}
                    disabled={!isActive && stepIndex !== currentStep}
                />
                {feedbackError && (
                    <p className="mt-1 text-sm text-red-500">{feedbackError}</p>
                )}
            </div>
            <div className="flex gap-2">
                {isActive && (
                    <>
                        {canMoveToNext ? (
                            <Button
                                variant="default"
                                onClick={() => onUpdateStep(stepIndex, 'next')}
                            >
                                Move to Next Step
                            </Button>
                        ) : stepIndex === currentStep && stepIndex > 0 && (
                            <div className="text-sm text-yellow-600">
                                Complete previous step before moving forward
                            </div>
                        )}
                        <Button
                            variant="destructive"
                            onClick={() => onUpdateStep(stepIndex, 'reject')}
                        >
                            Reject Candidate
                        </Button>
                    </>
                )}
                {stepIndex === currentStep && stepIndex > 0 && steps && steps[stepIndex - 1]?.status === InterviewStatus.COMPLETED && (
                    <Button
                        variant="outline"
                        onClick={() => onUpdateStep(stepIndex, 'back')}
                    >
                        Go Back
                    </Button>
                )}
                {!isActive && stepStatus !== InterviewStatus.PENDING && (
                    <>
                        <Button
                            variant="outline"
                            onClick={() => onUpdateStep(stepIndex, 'update')}
                        >
                            Update Feedback
                        </Button>
                        {stepStatus === InterviewStatus.REJECTED && (
                            <Button
                                variant="default"
                                onClick={() => onUpdateStep(stepIndex, 'unreject')}
                            >
                                Unreject Candidate
                            </Button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}