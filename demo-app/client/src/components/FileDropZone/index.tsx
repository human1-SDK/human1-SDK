import { useState, useCallback } from 'react';
import { FileDropZoneProps, FileUpload, DragState } from './types';
import { UploadZone } from './components/UploadZone';
import { StatusZone } from './components/StatusZone';
import { useDragDrop } from './hooks/useDragDrop';
import { useFileInput } from './hooks/useFileInput';

export const FileDropZone = ({
  onFilesSelected,
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
  className = '',
}: FileDropZoneProps) => {
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    isOver: false,
    isValid: true,
  });

  const handleFilesSelected = useCallback((newFiles: File[]) => {
    console.log('handleFilesSelected called with:', newFiles);
    
    const validFiles = newFiles.filter(file => {
      const isValidType = acceptedFileTypes.some(type => {
        if (type.endsWith('/*')) {
          const category = type.split('/')[0];
          return file.type.startsWith(category);
        }
        return file.type === type;
      });

      const isValidSize = file.size <= maxSize;

      return isValidType && isValidSize;
    });

    console.log('Valid files:', validFiles);

    if (validFiles.length > 0) {
      const newFileUploads: FileUpload[] = validFiles.map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        status: 'idle',
        progress: 0,
      }));

      console.log('New file uploads:', newFileUploads);

      setFiles(prev => {
        const updated = [...prev, ...newFileUploads];
        console.log('Updated files state:', updated);
        return updated;
      });
      
      onFilesSelected(validFiles);
    }
  }, [acceptedFileTypes, maxSize, onFilesSelected]);

  const handleRemoveFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  }, []);

  const handleRetryUpload = useCallback((id: string) => {
    setFiles(prev => prev.map(file => 
      file.id === id ? { ...file, status: 'idle', progress: 0 } : file
    ));
  }, []);

  const { isDragging, isOver, isValid, handleDragEnter, handleDragLeave, handleDragOver, handleDrop } = useDragDrop({
    onFilesSelected: handleFilesSelected,
    maxFiles,
    maxSize,
    acceptedFileTypes,
  });

  const { handleFileInputChange } = useFileInput({
    onFilesSelected: handleFilesSelected,
    maxFiles,
    maxSize,
    acceptedFileTypes,
  });

  console.log('Current files state:', files);

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
      <StatusZone
        files={files}
        onRemoveFile={handleRemoveFile}
        onRetryUpload={handleRetryUpload}
        className="flex-1"
      />
    </div>
  );
}; 