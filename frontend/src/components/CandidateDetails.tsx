import { ChevronDown, ChevronUp } from 'lucide-react';
import React, { KeyboardEvent, useEffect } from 'react';
import { cn } from '../lib/utils';
import { Candidate, CandidateProgress } from '../types/interview';
import {
    CandidateHeader,
    getStepIcon,
    StepFeedback
} from './CandidateDetails/utils';
import { CandidateStatus, InterviewStatus } from '@shared/enums';

interface CandidateDetailsProps {
    candidate: Candidate;
    onUpdateStep: (stepId: number, action: 'next' | 'reject' | 'update' | 'back' | 'unreject', feedback?: string) => void;
    onCVUpload: (cvLink: string) => void;
    onStatusChange?: (candidate: Candidate) => void;
    onProgressChange?: (candidate: Candidate) => void;
}

export function CandidateDetails({ candidate, onUpdateStep, onCVUpload, onStatusChange, onProgressChange }: CandidateDetailsProps) {
    const [feedback, setFeedback] = React.useState<string>('');
    const [activeStep, setActiveStep] = React.useState(candidate.currentStep);
    const [expandedStep, setExpandedStep] = React.useState<number | null>(candidate.currentStep);
    const [feedbackError, setFeedbackError] = React.useState<string>('');


    console.log({ feedback }, { activeStep }, { expandedStep })

    useEffect(() => {
        if (expandedStep !== null) {
            candidate.steps ? setFeedback(candidate.steps[expandedStep]?.feedback || '') : setFeedback('')
        }
    }, [expandedStep, candidate.steps, candidate]);

    const handleToggleStep = (stepId: number) => {
        setExpandedStep(expandedStep === stepId ? null : stepId);
        if (candidate.steps && candidate.steps[stepId].status === InterviewStatus.PENDING || stepId === candidate.currentStep) {
            setActiveStep(stepId);
        }
        candidate.steps ? setFeedback(candidate.steps[stepId]?.feedback || '') : setFeedback('')
        setFeedbackError('');
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLDivElement>, stepId: number) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggleStep(stepId);
        } else if (e.key === 'ArrowDown' && candidate.steps && stepId < candidate.steps.length - 1) {
            e.preventDefault();
            handleToggleStep(stepId + 1);
        } else if (e.key === 'ArrowUp' && stepId > 0) {
            e.preventDefault();
            handleToggleStep(stepId - 1);
        }
    };

    const handleStepUpdate = (stepId: number, action: 'next' | 'reject' | 'update' | 'back' | 'unreject') => {
        if (action === 'back' && stepId > 0) {
            setActiveStep(stepId - 1);
            setExpandedStep(stepId - 1);
            setFeedback('');
            onUpdateStep(stepId, action, feedback);
            return;
        }

        if (action !== 'update' && action !== 'unreject' && !validateFeedback()) return;

        if (action === 'unreject') {
            onUpdateStep(stepId, action);
            setActiveStep(stepId);
            return;
        }

        onUpdateStep(stepId, action, feedback);
        setFeedback('');
        setFeedbackError('');

        if (action === 'next' && candidate.steps && stepId < candidate.steps.length - 1) {
            setExpandedStep(stepId + 1);
            setActiveStep(stepId + 1);
        }
    };

    const validateFeedback = (): boolean => {
        if (!feedback || feedback.trim() === '') {
            setFeedbackError('Please provide feedback.');
            return false;
        }
        return true;
    };

    useEffect(() => {
        const handleKeyboardShortcuts = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLTextAreaElement) return;

            if (candidate.status === CandidateStatus.OPEN) {
                if (e.key === 'n' && !e.metaKey && !e.ctrlKey) {
                    handleStepUpdate(activeStep, 'next');
                } else if (e.key === 'r' && !e.metaKey && !e.ctrlKey) {
                    handleStepUpdate(activeStep, 'reject');
                }
            }

            if (e.key === 'ArrowDown' && e.altKey) {
                e.preventDefault();
                if (expandedStep !== null && candidate.steps && expandedStep < candidate.steps.length - 1) {
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
    }, [candidate.status, activeStep, expandedStep, candidate.steps?.length]);

    const handleStatusToggle = () => {
        const newStatus = candidate.status === CandidateStatus.OPEN ? CandidateStatus.CLOSED : CandidateStatus.OPEN;
        if (onStatusChange) {
            onStatusChange({
                ...candidate,
                status: newStatus,
                updatedAt: new Date()
            });
        }
    };

    const handleProgressChange = (newProgress: CandidateProgress) => {
        if (onProgressChange) {
            onProgressChange({
                ...candidate,
                progress: newProgress,
            });
        }
    };

    return (
        <div className="space-y-8 p-6">
            <CandidateHeader
                name={candidate.name}
                role={candidate.role}
                level={candidate.level}
                location={candidate.location}
                progress={candidate.progress}
                status={candidate.status}
                cvLink={candidate.cvUrl}
                onCVUpload={onCVUpload}
                onStatusChange={handleStatusToggle}
                onProgressChange={handleProgressChange}
            />

            <div className="space-y-4">
                {candidate.steps?.map((step, index) => (
                    <div
                        key={step.id}
                        className={cn(
                            "border rounded-lg overflow-hidden transition-all duration-200",
                            expandedStep === index && "ring-2 ring-primary",
                            step.status === InterviewStatus.COMPLETED && "bg-green-50/50",
                            step.status === InterviewStatus.REJECTED && "bg-red-50/50"
                        )}
                    >
                        <div
                            role="button"
                            tabIndex={0}
                            className={cn(
                                "flex items-center justify-between p-4 cursor-pointer hover:bg-accent/50 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                (index === activeStep && candidate.status === CandidateStatus.OPEN) && "bg-accent"
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
                                {(index === activeStep && candidate.status === CandidateStatus.OPEN || step.feedback) && (
                                    <StepFeedback
                                        isActive={index === activeStep && candidate.status === CandidateStatus.OPEN}
                                        feedback={feedback}
                                        feedbackError={feedbackError}
                                        stepStatus={step.status}
                                        currentStep={candidate.currentStep}
                                        stepIndex={index}
                                        steps={candidate.steps}
                                        onFeedbackChange={(value) => {
                                            setFeedback(value);
                                            setFeedbackError('');
                                        }}
                                        onUpdateStep={handleStepUpdate}
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