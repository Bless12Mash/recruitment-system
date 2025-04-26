import React, { KeyboardEvent, useEffect } from 'react';
import { Candidate } from '../types/interview';
import { cn } from '../lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
    getStepIcon,
    KeyboardShortcuts,
    CandidateHeader,
    StepFeedback
} from './CandidateDetails/utils';

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
            <CandidateHeader
                name={candidate.name}
                role={candidate.role}
                level={candidate.level}
                location={candidate.location}
                progress={candidate.progress}
                status={candidate.status}
                onCVUpload={onCVUpload}
            />

            <KeyboardShortcuts />

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
                                    <StepFeedback
                                        isActive={index === activeStep && candidate.status === 'Open'}
                                        feedback={step.feedback || feedback}
                                        feedbackError={feedbackError}
                                        stepStatus={step.status}
                                        currentStep={candidate.currentStep}
                                        stepIndex={index}
                                        onFeedbackChange={(value) => {
                                            setFeedback(value);
                                            setFeedbackError('');
                                        }}
                                        onUpdateStep={handleUpdateStep}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}