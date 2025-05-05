import { useCallback, useEffect, useState } from 'react'
import { toast, Toaster } from "sonner"
import './App.css'
import { CandidateDetails } from './components/CandidateDetails'
import { CandidatesList } from './components/CandidatesList'
import { Input } from './components/ui/input'
import { parseExcelData, updateCandidateStep } from './lib/utils'
import { candidateApi } from './lib/api'
import { Candidate } from './types/interview'
import { Button } from './components/ui/button'
import { AddCandidate } from './components/AddCandidate'

export const showToast = ((message: string, type: 'success' | 'error' | 'info' = 'info') => {
  const description = new Date().toLocaleDateString()
  switch (type) {
    case 'success':
      toast.success(message, { description })
      break
    case 'error':
      toast.error(message, { description })
      break
    default:
      toast.info(message, { description })
  }
})

function App() {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [newCandidate, setNewCandidate] = useState(false)

  const handleFileUpload = async (file: File) => {
    setIsLoading(true)
    try {
      const newCandidates = await parseExcelData(file)
      const savedCandidates = await candidateApi.saveCandidates(newCandidates)
      showToast(`Successfully imported ${savedCandidates.length} candidates`, 'success')
    } catch (error) {
      console.error('Error importing candidates:', error)
      showToast('Error importing candidates. Please check the file format.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCandidateClick = async (candidate: Candidate) => {
    try {
      if (candidate.id !== undefined) {
        const fullCandidate = await candidateApi.candidate(candidate.id)
        setSelectedCandidate(fullCandidate)
      }

    } catch (error) {
      console.error('Error fetching candidate details:', error)
      showToast('Error fetching candidate details. Please try again.', 'error')
    }
  }

  const handleUpdateStep = async (stepId: number, action: 'next' | 'reject' | 'update' | 'back' | 'unreject', feedback?: string) => {
    if (!selectedCandidate) return;

    const updatedCandidate = updateCandidateStep(selectedCandidate, stepId, action, feedback);

    try {
      if (updatedCandidate.id !== undefined) {
        if (updatedCandidate.steps === undefined) return
        const stepData = updatedCandidate.steps[stepId];
        const savedCandidate = await candidateApi.updateCandidateProgress(
          updatedCandidate.id,
          updatedCandidate.progress,
          updatedCandidate.currentStep,
          {
            indexPosition: stepId,
            status: stepData.status,
            feedback: stepData.feedback,
            completedAt: stepData.completedAt
          }
        );

        setSelectedCandidate(savedCandidate);

        const actionMessages = {
          next: `${selectedCandidate.name} moved to next step`,
          reject: `${selectedCandidate.name} has been rejected`,
          update: `Feedback updated successfully for ${selectedCandidate.name}`,
          unreject: `${selectedCandidate.name} has been unrejected`,
          back: `Moved back to previous step`
        };
        showToast(actionMessages[action], action === 'reject' ? 'error' : 'success');
      }
    } catch (error) {
      console.error('Error updating candidate:', error);
      showToast('Error updating candidate. Please try again.', 'error');
    }
  };

  const handleCVUpload = async (cvLink: string) => {
    if (!selectedCandidate) return;

    try {
      if (selectedCandidate.id !== undefined) {
        const updatedCandidate = await candidateApi.uploadCV(selectedCandidate.id, cvLink);
        setSelectedCandidate(updatedCandidate);
        showToast('CV uploaded successfully', 'success');
      }
    } catch (error) {
      console.error('Error uploading CV:', error);
      showToast('Error uploading CV. Please try again.', 'error');
    }
  };

  const handleStatusChange = async (updatedCandidate: Candidate) => {
    try {
      if (updatedCandidate.id !== undefined) {
        const savedCandidate = await candidateApi.updateCandidateStatus(
          updatedCandidate.id,
          updatedCandidate.status
        );
        setSelectedCandidate(savedCandidate);
        showToast(`Candidate status changed to ${savedCandidate.status}`, 'info');
      }
    } catch (error) {
      console.error('Error updating candidate status:', error);
      showToast('Error updating candidate status. Please try again.', 'error');
    }
  };

  const handleProgressChange = async (updatedCandidate: Candidate) => {
    try {
      if (updatedCandidate.id !== undefined) {
        const savedCandidate = await candidateApi.updateCandidateProgress(
          updatedCandidate.id,
          updatedCandidate.progress
        );
        setSelectedCandidate(savedCandidate);
        showToast(`Progress updated to ${savedCandidate.progress}`, 'info');
      }
    } catch (error) {
      console.error('Error updating candidate progress:', error);
      showToast('Error updating candidate progress. Please try again.', 'error');
    }
  };

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' && selectedCandidate) {
      setSelectedCandidate(null)
    }
  }, [selectedCandidate])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress)
    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [handleKeyPress])

  const addCandidate = () => {
    setNewCandidate(true)
  }

  return (
    <div className="min-h-screen bg-background relative">
      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
        </div>
      )}

      {!isLoading && (
        <div>
          <div className="border-b">
            <div className="container mx-auto py-4">
              <h1 className="text-2xl font-bold mt-4">Recruitment System</h1>
            </div>
          </div>
          <div className="container mx-auto py-6">
            {selectedCandidate ? (
              <div className="space-y-4">
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  ← Back to List
                </button>
                <CandidateDetails
                  candidate={selectedCandidate}
                  onUpdateStep={handleUpdateStep}
                  onCVUpload={handleCVUpload}
                  onStatusChange={handleStatusChange}
                  onProgressChange={handleProgressChange}
                />
              </div>
            ) : newCandidate ? (
              <div>
                <button
                  onClick={() => setNewCandidate(false)}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  ← Back to List
                </button>
                <AddCandidate />
              </div>) : (
              <div className="space-y-6">
                <div className="max-w-xl mx-auto">
                  <p className="text-start text-sm text-muted-foreground">Bulk candidate upload with excel sheet</p>
                  <Input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        handleFileUpload(file)
                      }
                    }}
                  />
                </div>
                <Button onClick={addCandidate}>Add Candidate</Button>
                <CandidatesList
                  onCandidateClick={handleCandidateClick}
                />
              </div>
            )}
          </div>
        </div>
      )}
      <Toaster closeButton />
    </div>
  )
}

export default App
