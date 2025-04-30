import { useState, useCallback } from 'react';
import { FileDropZoneProps, FileUpload, ValidationError } from '../../../../types/fileDropZone';
import { UploadZone } from './components/UploadZone';
import { StatusZone } from './components/StatusZone';
import { useDragDrop } from '../../../../hooks/useDragDrop';
import { useFileInput } from '../../../../hooks/useFileInput';

/**
 * File upload component with drag and drop functionality
 * 
 * Provides a complete file upload experience with:
 * - File drag and drop interface
 * - File browser selection
 * - Upload status visualization
 * - File validation (type, size, count)
 */
export const FileDropZone = ({
  onFilesSelected,
  onValidationError,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB
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
  validationMode = 'strict',
  showUploadProgress = true,
  className = '',
}: FileDropZoneProps) => {
  const [files, setFiles] = useState<FileUpload[]>([]);
  
  /**
   * Handles validation errors
   */
  const handleValidationError = useCallback((errors: ValidationError[]) => {
    if (onValidationError) {
      onValidationError(errors);
    }
  }, [onValidationError]);

  /**
   * Processes files when they are selected or dropped
   */
  const handleFilesSelected = useCallback((newFiles: File[]) => {
    // File validation is now handled by the hooks
    // Create FileUpload objects for the selected files
    const newFileUploads: FileUpload[] = newFiles.map(file => ({
      id: Math.random().toString(36).substring(2, 11),
      file,
      status: 'idle',
      progress: 0,
    }));

    // Update state
    setFiles(prev => {
      // Check if we need to limit the total number of files
      const combinedFiles = [...prev, ...newFileUploads];
      if (combinedFiles.length > maxFiles && validationMode === 'strict') {
        handleValidationError([{
          type: 'count',
          message: `Too many files. Maximum allowed: ${maxFiles}`,
        }]);
        return prev;
      }
      
      // If in permissive mode, take only up to maxFiles
      return combinedFiles.slice(0, maxFiles);
    });
    
    // Call the provided callback with the raw File objects
    onFilesSelected(newFiles);
  }, [maxFiles, onFilesSelected, validationMode, handleValidationError]);

  /**
   * Removes a file from the list
   */
  const handleRemoveFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  }, []);

  /**
   * Retries uploading a file that had an error
   */
  const handleRetryUpload = useCallback((id: string) => {
    setFiles(prev => prev.map(file => 
      file.id === id ? { ...file, status: 'idle', progress: 0 } : file
    ));
  }, []);

  // Use hooks for drag and drop functionality
  const { 
    isDragging, 
    isOver, 
    isValid, 
    handleDragEnter, 
    handleDragLeave, 
    handleDragOver, 
    handleDrop 
  } = useDragDrop({
    onFilesSelected: handleFilesSelected,
    onValidationError: handleValidationError,
    maxFiles,
    maxSize,
    acceptedFileTypes,
    validationMode,
  });

  // Use hooks for file input functionality
  const { handleFileInputChange } = useFileInput({
    onFilesSelected: handleFilesSelected,
    onValidationError: handleValidationError,
    maxFiles,
    maxSize,
    acceptedFileTypes,
    validationMode,
  });

  return (
    <div 
      className={`flex flex-col gap-4 ${className}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <UploadZone
        onFilesSelected={handleFilesSelected}
        isDragging={isDragging}
        isOver={isOver}
        isValid={isValid}
        maxFiles={maxFiles}
        maxSize={maxSize}
        acceptedFileTypes={acceptedFileTypes}
        className="flex-1"
      />
      {showUploadProgress && (
        <StatusZone
          files={files}
          onRemoveFile={handleRemoveFile}
          onRetryUpload={handleRetryUpload}
          className="flex-1"
        />
      )}
    </div>
  );
}; 