import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FileUploadProps {
    onFileUpload: (file: File) => void;
    accept?: Record<string, string[]>;
    className?: string;
    isLoading?: boolean;
}

export function FileUpload({
    onFileUpload,
    accept = {
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
        'application/vnd.ms-excel': ['.xls']
    },
    className,
    isLoading = false
}: FileUploadProps) {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0 && !isLoading) {
            onFileUpload(acceptedFiles[0]);
        }
    }, [onFileUpload, isLoading]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        multiple: false,
        disabled: isLoading
    });

    return (
        <div
            {...getRootProps()}
            className={cn(
                'border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors relative',
                isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary',
                isLoading && 'opacity-50 cursor-not-allowed',
                className
            )}
        >
            <input {...getInputProps()} disabled={isLoading} />
            <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                {isLoading ? (
                    <>
                        <Loader2 className="h-8 w-8 animate-spin" />
                        <p className="text-sm">Processing file...</p>
                    </>
                ) : (
                    <>
                        <Upload className="h-8 w-8" />
                        <p className="text-sm">
                            {isDragActive
                                ? 'Drop the file here'
                                : 'Drag & drop a file here, or click to select'}
                        </p>
                        <p className="text-xs">Supports: .xlsx, .xls</p>
                    </>
                )}
            </div>
        </div>
    );
}