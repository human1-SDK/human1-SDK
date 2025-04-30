import { useRef } from 'react';
import { UploadZoneProps } from '../../../../../types/fileDropZone';

/**
 * Component for the file upload drop zone area
 * Handles both drag-and-drop and click-to-select file interactions
 */
export const UploadZone = ({
  onFilesSelected,
  isDragging,
  isOver,
  isValid,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024,
  acceptedFileTypes = [
    'image/*',
    'application/pdf',
    '.sql',
    '.csv',
    '.yml',
    '.yaml',
    'text/csv',
    'text/yaml',
    'text/x-yaml',
    'application/x-yaml'
  ],
  className = '',
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
}: UploadZoneProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Handles click on the upload zone to open file browser
   */
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  /**
   * Handles file selection from the file browser
   */
  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      onFilesSelected(Array.from(files));
      // Reset input value to allow selecting the same file again
      event.target.value = '';
    }
  };

  // Tailwind CSS classes based on drag state
  const borderClasses = isDragging
    ? isOver
      ? isValid
        ? 'border-blue-500 bg-gray-100'
        : 'border-red-200 bg-red-50'
      : 'border-gray-300 bg-white'
    : 'border-gray-300 hover:border-blue-500 hover:bg-gray-100';

  const iconClasses = isDragging
    ? isOver
      ? isValid
        ? 'text-blue-500'
        : 'text-red-500'
      : 'text-gray-400'
    : 'text-gray-400 group-hover:text-blue-500';

  /**
   * Format accepted file types for display
   */
  const formatAcceptedTypes = () => {
    if (acceptedFileTypes.length > 5) {
      // Show just a few types and a count of the rest
      const visibleTypes = acceptedFileTypes.slice(0, 3).join(', ');
      return `${visibleTypes}, and ${acceptedFileTypes.length - 3} more`;
    }
    return acceptedFileTypes.join(', ');
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer group ${borderClasses} ${className}`}
      onClick={handleClick}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      role="button"
      tabIndex={0}
      aria-label="Upload files"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
          e.preventDefault();
        }
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedFileTypes.join(',')}
        onChange={handleFileInputChange}
        className="hidden"
        aria-hidden="true"
      />
      <div className="text-center space-y-3">
        <div className="w-12 h-12 mx-auto mb-2">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            className={`w-full h-full ${iconClasses}`}
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
            />
          </svg>
        </div>
        <p className="text-base font-medium text-gray-900">
          {isDragging
            ? isOver
              ? isValid
                ? 'Drop files here'
                : 'Invalid files'
              : 'Drag files here'
            : 'Click to upload or drag and drop'}
        </p>
        <p className="text-sm text-gray-500">
          {formatAcceptedTypes()} up to {maxSize / 1024 / 1024}MB
        </p>
        {maxFiles > 1 && (
          <p className="text-xs text-gray-400">
            Maximum {maxFiles} file{maxFiles !== 1 ? 's' : ''}
          </p>
        )}
      </div>
      {isDragging && isOver && (
        <div 
          className="absolute inset-0 bg-blue-500 bg-opacity-5 pointer-events-none" 
          aria-hidden="true"
        />
      )}
    </div>
  );
}; 