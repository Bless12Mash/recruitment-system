import { useCallback, useEffect, useState } from 'react'
import { toast, Toaster } from "sonner"
import './App.css'
import { CandidateDetails } from './components/CandidateDetails'
import { CandidatesList } from './components/CandidatesList'
import { Input } from './components/ui/input'
import { parseExcelData, updateCandidateStep } from './lib/utils'
import { Candidate } from './types/interview'

function App() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const showToast = ((message: string, type: 'success' | 'error' | 'info' = 'info') => {
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

  const handleFileUpload = async (file: File) => {
    setIsLoading(true)
    try {
      const newCandidates = await parseExcelData(file)
      setCandidates(prev => [...prev, ...newCandidates])
      showToast(`Successfully imported ${newCandidates.length} candidates`, 'success')
    } catch (error) {
      console.error('Error parsing Excel file:', error)
      showToast('Error importing candidates. Please check the file format.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCandidateClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate)
  }

  const handleUpdateStep = (stepId: number, action: 'next' | 'reject' | 'update' | 'back' | 'unreject', feedback?: string) => {
    if (!selectedCandidate) return

    const updatedCandidate = updateCandidateStep(selectedCandidate, stepId, action, feedback)
    setCandidates(prev => prev.map(c => c.id === updatedCandidate.id ? updatedCandidate : c))
    setSelectedCandidate(updatedCandidate)

    const actionMessages = {
      next: `${selectedCandidate.name} moved to next step`,
      reject: `${selectedCandidate.name} has been rejected`,
      update: `Feedback updated successfully for ${selectedCandidate.name}`,
      unreject: `${selectedCandidate.name} has been unrejected`,
      back: `Moved back to previous step`
    }
    showToast(actionMessages[action], action === 'reject' ? 'error' : 'success')
  }

  const handleCVUpload = (file: File) => {
    if (!selectedCandidate) return

    const updatedCandidate = {
      ...selectedCandidate,
      cv: file,
      updatedAt: new Date()
    }
    setCandidates(prev => prev.map(c => c.id === updatedCandidate.id ? updatedCandidate : c))
    setSelectedCandidate(updatedCandidate)
    showToast('CV uploaded successfully', 'success')
  }

  const handleStatusChange = (updatedCandidate: Candidate) => {
    setCandidates(prev => prev.map(c => c.id === updatedCandidate.id ? updatedCandidate : c));
    setSelectedCandidate(updatedCandidate);
    showToast(`Candidate status changed to ${updatedCandidate.status}`, 'info');
  };

  const handleProgressChange = (updatedCandidate: Candidate) => {
    setCandidates(prev => prev.map(c => c.id === updatedCandidate.id ? updatedCandidate : c));
    setSelectedCandidate(updatedCandidate);
    showToast(`Progress updated to ${updatedCandidate.progress}`, 'info');
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
            ) : (
              <div className="space-y-6">
                <div className="max-w-xl mx-auto">
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
                <CandidatesList
                  candidates={candidates}
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
