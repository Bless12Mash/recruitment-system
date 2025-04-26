import * as React from "react"
import { cn } from "../../lib/utils"
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react"

interface ToastProps {
    message: string
    type?: 'success' | 'error' | 'info'
    onDismiss?: () => void
}

export function Toast({ message, type = 'info', onDismiss }: ToastProps) {
    React.useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss?.()
        }, 5000)

        return () => clearTimeout(timer)
    }, [onDismiss])

    const icons = {
        success: <CheckCircle2 className="h-5 w-5 text-green-500" />,
        error: <XCircle className="h-5 w-5 text-red-500" />,
        info: <AlertCircle className="h-5 w-5 text-blue-500" />
    }

    return (
        <div
            className={cn(
                "fixed bottom-4 right-4 flex items-center gap-2 rounded-lg p-4 shadow-lg transition-all duration-200",
                type === 'success' && "bg-green-50 text-green-900",
                type === 'error' && "bg-red-50 text-red-900",
                type === 'info' && "bg-blue-50 text-blue-900"
            )}
            role="alert"
        >
            {icons[type]}
            <p className="text-sm font-medium">{message}</p>
            <button
                onClick={onDismiss}
                className="ml-4 rounded-full p-1 hover:bg-white/20"
                aria-label="Dismiss"
            >
                <XCircle className="h-4 w-4" />
            </button>
        </div>
    )
}