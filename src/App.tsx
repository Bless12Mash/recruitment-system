import { useState, useCallback, useEffect } from 'react'
import { FileUpload } from './components/ui/file-upload'
import { CandidatesList } from './components/CandidatesList'
import { CandidateDetails } from './components/CandidateDetails'
import { parseExcelData, updateCandidateStep } from './lib/utils'
import { Candidate } from './types/interview'
import { Toast } from './components/ui/toast'
import './App.css';

interface ToastState {
  message: string
  type: 'success' | 'error' | 'info'
}

function App() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState<ToastState | null>(null)

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type })
  }, [])

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

  const handleUpdateStep = (stepId: number, action: 'next' | 'reject' | 'update', feedback?: string) => {
    if (!selectedCandidate) return

    const updatedCandidate = updateCandidateStep(selectedCandidate, stepId, action, feedback)
    setCandidates(prev => prev.map(c => c.id === updatedCandidate.id ? updatedCandidate : c))
    setSelectedCandidate(updatedCandidate)

    const actionMessages = {
      next: 'Candidate moved to next step',
      reject: 'Candidate has been rejected',
      update: 'Feedback updated successfully'
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
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto py-4">
          <h1 className="text-2xl font-bold">Recruitment System</h1>
        </div>
      </header>

      <main className="container mx-auto py-6">
        {!selectedCandidate ? (
          <div className="space-y-6">
            <div className="max-w-xl mx-auto">
              <FileUpload
                onFileUpload={handleFileUpload}
                isLoading={isLoading}
              />
            </div>
            <CandidatesList
              candidates={candidates}
              onCandidateClick={handleCandidateClick}
            />
          </div>
        ) : (
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
            />
          </div>
        )}
      </main>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}
    </div>
  )
}

export default App
