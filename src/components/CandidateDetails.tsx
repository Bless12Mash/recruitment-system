import React, { KeyboardEvent, ChangeEvent, useEffect } from 'react';
import { Candidate, InterviewStatus } from '../types/interview';
import { Button } from './ui/button';
import { Textarea } from '../components/ui/textarea';
import { cn } from '../lib/utils';
import { FileUpload } from './ui/file-upload';
import { CheckCircle2, XCircle, Circle, ChevronDown, ChevronUp } from 'lucide-react';

interface CandidateDetailsProps {
    candidate: Candidate;
    onUpdateStep: (stepId: number, action: 'next' | 'reject' | 'update', feedback?: string) => void;
    onCVUpload: (file: File) => void;
}

export function CandidateDetails({ candidate, onUpdateStep, onCVUpload }: CandidateDetailsProps) {
    const [feedback, setFeedback] = React.useState<string>('');
    const [activeStep, setActiveStep] = React.useState(candidate.currentStep);
    const [expandedStep, setExpandedStep] = React.useState<number | null>(candidate.currentStep);
    const [feedbackError, setFeedbackError] = React.useState<string>('');

    const getStepIcon = (status: InterviewStatus) => {
        switch (status) {
            case 'completed':
                return <CheckCircle2 className="h-6 w-6 text-green-500" />;
            case 'rejected':
                return <XCircle className="h-6 w-6 text-red-500" />;
            default:
                return <Circle className="h-6 w-6 text-gray-300" />;
        }
    };

    const handleToggleStep = (stepId: number) => {
        setExpandedStep(expandedStep === stepId ? null : stepId);
        if (candidate.steps[stepId].status === 'pending' || stepId === candidate.currentStep) {
            setActiveStep(stepId);
        }
        setFeedbackError('');
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLDivElement>, stepId: number) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggleStep(stepId);
        } else if (e.key === 'ArrowDown' && stepId < candidate.steps.length - 1) {
            e.preventDefault();
            handleToggleStep(stepId + 1);
        } else if (e.key === 'ArrowUp' && stepId > 0) {
            e.preventDefault();
            handleToggleStep(stepId - 1);
        }
    };

    const validateFeedback = (): boolean => {
        if (feedback.trim().length < 10) {
            setFeedbackError('Feedback must be at least 10 characters long');
            return false;
        }
        return true;
    };

    const handleUpdateStep = (stepId: number, action: 'next' | 'reject' | 'update') => {
        if (!validateFeedback()) return;

        onUpdateStep(stepId, action, feedback);
        setFeedback('');
        setFeedbackError('');

        if (action === 'next' && stepId < candidate.steps.length - 1) {
            setExpandedStep(stepId + 1);
            setActiveStep(stepId + 1);
        }
    };

    useEffect(() => {
        const handleKeyboardShortcuts = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLTextAreaElement) return;

            if (candidate.status === 'Open') {
                if (e.key === 'n' && !e.metaKey && !e.ctrlKey) {
                    handleUpdateStep(activeStep, 'next');
                } else if (e.key === 'r' && !e.metaKey && !e.ctrlKey) {
                    handleUpdateStep(activeStep, 'reject');
                }
            }

            if (e.key === 'ArrowDown' && e.altKey) {
                e.preventDefault();
                if (expandedStep !== null && expandedStep < candidate.steps.length - 1) {
                    handleToggleStep(expandedStep + 1);
                }
            } else if (e.key === 'ArrowUp' && e.altKey) {
                e.preventDefault();
                if (expandedStep !== null && expandedStep > 0) {
                    handleToggleStep(expandedStep - 1);
                }
            }
        };

        document.addEventListener('keydown', handleKeyboardShortcuts as any);
        return () => {
            document.removeEventListener('keydown', handleKeyboardShortcuts as any);
        };
    }, [candidate.status, activeStep, expandedStep, candidate.steps.length]);

    return (
        <div className="space-y-8 p-6">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold">{candidate.name}</h2>
                    <p className="text-muted-foreground">{candidate.role} - {candidate.level}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        Status: <span className={cn(
                            "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                            candidate.status === 'Open' ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-700"
                        )}>{candidate.status}</span>
                    </p>
                </div>
                <div className="w-64">
                    <FileUpload
                        onFileUpload={onCVUpload}
                        accept={{
                            'application/pdf': ['.pdf'],
                            'application/msword': ['.doc'],
                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
                        }}
                    />
                </div>
            </div>

            <div className="text-sm text-muted-foreground mb-4">
                <p>Keyboard shortcuts:</p>
                <ul className="mt-1 space-y-1">
                    <li>Press <kbd className="px-2 py-1 bg-muted rounded">n</kbd> to move to next step</li>
                    <li>Press <kbd className="px-2 py-1 bg-muted rounded">r</kbd> to reject candidate</li>
                    <li>Press <kbd className="px-2 py-1 bg-muted rounded">Alt</kbd> + <kbd className="px-2 py-1 bg-muted rounded">↑</kbd>/<kbd className="px-2 py-1 bg-muted rounded">↓</kbd> to navigate steps</li>
                    <li>Press <kbd className="px-2 py-1 bg-muted rounded">Esc</kbd> to return to list view</li>
                </ul>
            </div>

            <div className="space-y-4">
                {candidate.steps.map((step, index) => (
                    <div
                        key={step.id}
                        className={cn(
                            "border rounded-lg overflow-hidden transition-all duration-200",
                            expandedStep === index && "ring-2 ring-primary",
                            step.status === 'completed' && "bg-green-50/50",
                            step.status === 'rejected' && "bg-red-50/50"
                        )}
                    >
                        <div
                            role="button"
                            tabIndex={0}
                            className={cn(
                                "flex items-center justify-between p-4 cursor-pointer hover:bg-accent/50 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                (index === activeStep && candidate.status === 'Open') && "bg-accent"
                            )}
                            onClick={() => handleToggleStep(index)}
                            onKeyDown={(e) => handleKeyPress(e, index)}
                        >
                            <div className="flex items-center gap-3">
                                {getStepIcon(step.status)}
                                <div>
                                    <h3 className="font-medium">{step.name}</h3>
                                    {step.completedAt && (
                                        <span className="text-sm text-muted-foreground">
                                            {new Date(step.completedAt).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                            {expandedStep === index ? (
                                <ChevronUp className="h-5 w-5 text-muted-foreground" />
                            ) : (
                                <ChevronDown className="h-5 w-5 text-muted-foreground" />
                            )}
                        </div>

                        {expandedStep === index && (
                            <div className="p-4 border-t bg-background">
                                {(index === activeStep && candidate.status === 'Open' || step.feedback) && (
                                    <div className="space-y-4">
                                        <div>
                                            <Textarea
                                                placeholder="Enter feedback for this step..."
                                                value={step.feedback || feedback}
                                                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                                                    setFeedback(e.target.value);
                                                    setFeedbackError('');
                                                }}
                                                className={cn(
                                                    "min-h-[100px]",
                                                    feedbackError && "border-red-500 focus-visible:ring-red-500"
                                                )}
                                                disabled={step.status !== 'pending' && index !== activeStep}
                                            />
                                            {feedbackError && (
                                                <p className="mt-1 text-sm text-red-500">{feedbackError}</p>
                                            )}
                                        </div>
                                        {index === activeStep && candidate.status === 'Open' && (
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="default"
                                                    onClick={() => handleUpdateStep(index, 'next')}
                                                >
                                                    Move to Next Step
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    onClick={() => handleUpdateStep(index, 'reject')}
                                                >
                                                    Reject Candidate
                                                </Button>
                                            </div>
                                        )}
                                        {step.status !== 'pending' && index !== activeStep && (
                                            <Button
                                                variant="outline"
                                                onClick={() => handleUpdateStep(index, 'update')}
                                            >
                                                Update Feedback
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}