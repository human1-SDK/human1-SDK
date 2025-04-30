import { useCallback } from 'react';
import { FileValidationOptions, ValidationError } from '../types/fileDropZone';

/**
 * Props for the useFileInput hook
 */
interface UseFileInputProps extends FileValidationOptions {
  /** Callback when files are selected */
  onFilesSelected: (files: File[]) => void;
  /** Optional callback for validation errors */
  onValidationError?: (errors: ValidationError[]) => void;
}

/**
 * Hook for handling file input operations
 * 
 * @param props Configuration options and callbacks
 * @returns File input event handlers
 */
export const useFileInput = ({
  onFilesSelected,
  onValidationError,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024,
  acceptedFileTypes = ['image/*', 'application/pdf'],
  validationMode = 'strict',
}: UseFileInputProps) => {
  /**
   * Validates files against configured constraints
   * 
   * @param files List of files to validate
   * @returns A tuple with valid files and any validation errors
   */
  const validateFiles = useCallback((files: File[]) => {
    const errors: ValidationError[] = [];
    let validFiles: File[] = [];

    // Check if too many files
    if (files.length > maxFiles) {
      errors.push({
        type: 'count',
        message: `Too many files. Maximum allowed: ${maxFiles}`,
      });
      
      // If strict mode, return no files
      if (validationMode === 'strict') {
        if (onValidationError) onValidationError(errors);
        return { validFiles: [], errors };
      }
      
      // In permissive mode, take the first maxFiles files
      files = files.slice(0, maxFiles);
    }

    // Check each file for type and size constraints
    validFiles = files.filter(file => {
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

      return fileIsValid;
    });

    // Call validation error handler if there are errors
    if (errors.length > 0 && onValidationError) {
      onValidationError(errors);
    }

    return { validFiles, errors };
  }, [maxFiles, maxSize, acceptedFileTypes, validationMode, onValidationError]);

  /**
   * Handles file input change event
   * 
   * @param event The input change event
   */
  const handleFileInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const { validFiles } = validateFiles(Array.from(files));
      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
      // Clear the input value to allow selecting the same file again
      event.target.value = '';
    }
  }, [onFilesSelected, validateFiles]);

  return {
    handleFileInputChange,
    validateFiles,
  };
}; 