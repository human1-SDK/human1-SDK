import React, { useRef } from 'react';
import { FileListProps, FileUpload } from '../../../../../types/fileDropZone';
import { FileItem } from './FileItem';

/**
 * Component for displaying a list of files being uploaded
 */
export const FileList = ({
  files,
  onRemoveFile,
  onRetryUpload,
  className = '',
}: FileListProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Simple version with FileItem components
  if (files.length === 0) {
    return <div className={`space-y-4 ${className}`} />;
  }

  // Enhanced version with inline file visualization for better user experience
  return (
    <div ref={containerRef} className={`space-y-3 ${className}`}>
      {files.map(file => (
        <div 
          key={file.id} 
          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className={`flex-shrink-0 ${getStatusClasses(file.status)}`}>
            {getStatusIcon(file.status)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between text-sm">
              <span className="text-gray-700 truncate">{file.file.name}</span>
              <span className="text-gray-500 ml-2">{file.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
              <div
                className={`h-1.5 rounded-full transition-all duration-200 ${getProgressBarColor(file.status)}`}
                style={{ width: `${file.progress}%` }}
                role="progressbar"
                aria-valuenow={file.progress}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {file.status === 'error' && (
              <button
                onClick={() => onRetryUpload(file.id)}
                className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800"
                aria-label="Retry upload"
              >
                Retry
              </button>
            )}
            <button
              onClick={() => onRemoveFile(file.id)}
              className="px-2 py-1 text-xs text-red-600 hover:text-red-800"
              aria-label="Remove file"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Get color classes based on file status
 */
function getStatusClasses(status: FileUpload['status']) {
  switch (status) {
    case 'success':
      return 'text-green-500';
    case 'error':
      return 'text-red-500';
    case 'uploading':
      return 'text-blue-500';
    case 'paused':
      return 'text-yellow-500';
    case 'cancelled':
      return 'text-gray-400';
    default:
      return 'text-gray-500';
  }
}

/**
 * Get progress bar color class based on file status
 */
function getProgressBarColor(status: FileUpload['status']) {
  switch (status) {
    case 'success':
      return 'bg-green-500';
    case 'error':
      return 'bg-red-500';
    case 'uploading':
      return 'bg-blue-500';
    case 'paused':
      return 'bg-yellow-500';
    case 'cancelled':
      return 'bg-gray-400';
    default:
      return 'bg-gray-500';
  }
}

/**
 * Get status icon based on file status
 */
function getStatusIcon(status: FileUpload['status']) {
  switch (status) {
    case 'success':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    case 'error':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      );
    case 'uploading':
      return (
        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      );
    case 'paused':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
        </svg>
      );
    case 'cancelled':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      );
    default:
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
} 