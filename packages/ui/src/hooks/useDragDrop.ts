import { useState, useCallback } from 'react';
import { DragState, ValidationError, FileValidationOptions } from '../types/fileDropZone';

/**
 * Props for the useDragDrop hook
 */
interface UseDragDropProps extends FileValidationOptions {
  /** Callback when files are selected */
  onFilesSelected: (files: File[]) => void;
  /** Optional callback for validation errors */
  onValidationError?: (errors: ValidationError[]) => void;
}

/**
 * Hook for handling drag and drop file operations
 * 
 * @param props Configuration options and callbacks
 * @returns Drag state and event handlers
 */
export const useDragDrop = ({
  onFilesSelected,
  onValidationError,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024,
  acceptedFileTypes = ['image/*', 'application/pdf'],
  validationMode = 'strict',
}: UseDragDropProps) => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    isOver: false,
    isValid: true,
  });

  /**
   * Validates files against configured constraints
   * 
   * @param files List of files to validate
   * @returns A validation result object with validity and errors
   */
  const validateFiles = useCallback((files: File[]) => {
    const errors: ValidationError[] = [];
    let isValid = true;

    // Check if too many files
    if (files.length > maxFiles) {
      isValid = false;
      errors.push({
        type: 'count',
        message: `Too many files. Maximum allowed: ${maxFiles}`,
      });
      
      // If strict mode, return immediately
      if (validationMode === 'strict') {
        if (onValidationError) onValidationError(errors);
        return { isValid, errors };
      }
    }

    // Check each file for type and size constraints
    files.forEach(file => {
      let fileIsValid = true;
      
      // Check file type
      const isValidType = acceptedFileTypes.some(type => {
        if (type.startsWith('.')) {
          // Handle file extensions
          const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
          return extension === type.toLowerCase();
        } else if (type.endsWith('/*')) {
          // Handle MIME type categories
          const category = type.split('/')[0];
          return file.type.startsWith(category);
        }
        return file.type === type;
      });

      if (!isValidType) {
        fileIsValid = false;
        errors.push({
          type: 'type',
          message: `File type not allowed: ${file.type || file.name}`,
          file,
        });
      }

      // Check file size
      const isValidSize = file.size <= maxSize;
      if (!isValidSize) {
        fileIsValid = false;
        errors.push({
          type: 'size',
          message: `File too large: ${(file.size / (1024 * 1024)).toFixed(2)} MB. Maximum allowed: ${(maxSize / (1024 * 1024)).toFixed(2)} MB`,
          file,
        });
      }

      // Update overall validity
      isValid = isValid && fileIsValid;
    });

    // Call validation error handler if there are errors
    if (errors.length > 0 && onValidationError) {
      onValidationError(errors);
    }

    return { isValid, errors };
  }, [maxFiles, maxSize, acceptedFileTypes, validationMode, onValidationError]);

  const handleDragEnter = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setDragState(prev => ({ ...prev, isDragging: true }));
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setDragState(prev => ({ ...prev, isDragging: false, isOver: false }));
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setDragState(prev => ({ ...prev, isOver: true }));
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const files = Array.from(event.dataTransfer?.files || []);
    const { isValid } = validateFiles(files);

    setDragState({
      isDragging: false,
      isOver: false,
      isValid,
    });

    if (isValid && files.length > 0) {
      onFilesSelected(files);
    }
  }, [onFilesSelected, validateFiles]);

  return {
    ...dragState,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
  };
}; 