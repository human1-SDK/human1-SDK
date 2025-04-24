export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export interface FileUpload {
  id: string;
  file: File;
  status: UploadStatus;
  progress: number;
  error?: string;
}

export interface DragState {
  isDragging: boolean;
  isOver: boolean;
  isValid: boolean;
}

export interface FileDropZoneProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number;
  acceptedFileTypes?: string[];
  className?: string;
}

export interface UploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  isDragging: boolean;
  isOver: boolean;
  isValid: boolean;
  maxFiles?: number;
  maxSize?: number;
  acceptedFileTypes?: string[];
  className?: string;
  onDragEnter?: (event: React.DragEvent) => void;
  onDragLeave?: (event: React.DragEvent) => void;
  onDragOver?: (event: React.DragEvent) => void;
  onDrop?: (event: React.DragEvent) => void;
}

export interface StatusZoneProps {
  files: FileUpload[];
  onRemoveFile: (id: string) => void;
  onRetryUpload: (id: string) => void;
  className?: string;
}

export interface FileListProps {
  files: FileUpload[];
  onRemoveFile: (id: string) => void;
  onRetryUpload: (id: string) => void;
  className?: string;
}

export interface FileItemProps {
  file: FileUpload;
  onRemove: () => void;
  onRetry: () => void;
  className?: string;
}

export interface FileUploadStatus {
  file: File;
  status: 'pending' | 'uploading' | 'complete' | 'error';
  progress: number;
  error?: string;
}

export const ACCEPTED_TYPES = {
  'text/plain': ['.prompt'],
  'text/csv': ['.csv'],
  'application/sql': ['.sql'],
}; 