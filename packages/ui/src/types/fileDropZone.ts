/**
 * FileDropZone component type definitions
 * Used for file upload interactions with drag and drop functionality
 */

/**
 * Possible states for a file upload
 */
export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error' | 'cancelled' | 'paused';

/**
 * Represents a file being uploaded with its status and metadata
 */
export interface FileUpload {
  /** Unique identifier for the file upload */
  id: string;
  /** The actual File object */
  file: File;
  /** Current upload status */
  status: UploadStatus;
  /** Upload progress percentage (0-100) */
  progress: number;
  /** Optional error message if status is 'error' */
  error?: string;
}

/**
 * State information for drag and drop operations
 */
export interface DragState {
  /** Whether user is currently dragging something (may be outside the drop zone) */
  isDragging: boolean;
  /** Whether the dragged item is over the drop zone */
  isOver: boolean;
  /** Whether the dragged items are valid files that can be accepted */
  isValid: boolean;
}

/**
 * Configuration options for file validation
 */
export interface FileValidationOptions {
  /** Maximum number of files allowed */
  maxFiles?: number;
  /** Maximum size of each file in bytes */
  maxSize?: number;
  /** List of accepted file types/extensions */
  acceptedFileTypes?: string[];
  /** How strictly to enforce validation rules */
  validationMode?: 'strict' | 'permissive';
}

/**
 * Error information for file validation failures
 */
export interface ValidationError {
  /** Type of validation error */
  type: 'size' | 'type' | 'count' | 'unknown';
  /** Human-readable error message */
  message: string;
  /** The file that caused the error, if applicable */
  file?: File;
}

/**
 * Props for the main FileDropZone component
 */
export interface FileDropZoneProps extends FileValidationOptions {
  /** Callback when files are selected (either via drop or file input) */
  onFilesSelected: (files: File[]) => void;
  /** Optional callback for validation errors */
  onValidationError?: (errors: ValidationError[]) => void;
  /** Additional CSS classes to apply */
  className?: string;
  /** Whether to automatically show upload progress UI */
  showUploadProgress?: boolean;
}

/**
 * Props for the UploadZone subcomponent
 */
export interface UploadZoneProps extends FileValidationOptions {
  /** Callback when files are selected */
  onFilesSelected: (files: File[]) => void;
  /** Current drag state */
  isDragging: boolean;
  /** Whether dragged items are over the drop zone */
  isOver: boolean;
  /** Whether dragged items are valid */
  isValid: boolean;
  /** Additional CSS classes to apply */
  className?: string;
  /** Drag event handlers */
  onDragEnter?: (event: React.DragEvent) => void;
  onDragLeave?: (event: React.DragEvent) => void;
  onDragOver?: (event: React.DragEvent) => void;
  onDrop?: (event: React.DragEvent) => void;
}

/**
 * Props for the StatusZone subcomponent
 */
export interface StatusZoneProps {
  /** List of files being uploaded */
  files: FileUpload[];
  /** Callback to remove a file */
  onRemoveFile: (id: string) => void;
  /** Callback to retry a failed upload */
  onRetryUpload: (id: string) => void;
  /** Additional CSS classes to apply */
  className?: string;
}

/**
 * Props for the FileList subcomponent
 */
export interface FileListProps {
  /** List of files being uploaded */
  files: FileUpload[];
  /** Callback to remove a file */
  onRemoveFile: (id: string) => void;
  /** Callback to retry a failed upload */
  onRetryUpload: (id: string) => void;
  /** Additional CSS classes to apply */
  className?: string;
}

/**
 * Props for the FileItem subcomponent
 */
export interface FileItemProps {
  /** File upload information */
  file: FileUpload;
  /** Callback to remove the file */
  onRemove: () => void;
  /** Callback to retry a failed upload */
  onRetry: () => void;
  /** Additional CSS classes to apply */
  className?: string;
}

/**
 * Alternative file upload status representation
 * Used in the root FileList component
 */
export interface FileUploadStatus {
  /** The actual File object */
  file: File;
  /** Current upload status */
  status: 'pending' | 'uploading' | 'complete' | 'error';
  /** Upload progress percentage (0-100) */
  progress: number;
  /** Optional error message */
  error?: string;
}

/**
 * Common MIME types and their associated file extensions
 */
export const ACCEPTED_TYPES = {
  'text/plain': ['.txt', '.text', '.prompt'],
  'text/csv': ['.csv'],
  'application/sql': ['.sql'],
  'application/json': ['.json'],
  'text/yaml': ['.yml', '.yaml'],
  'application/x-yaml': ['.yml', '.yaml'],
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/gif': ['.gif'],
  'application/pdf': ['.pdf'],
}; 