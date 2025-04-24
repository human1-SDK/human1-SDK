import { useCallback } from 'react';

interface UseFileInputProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number;
  acceptedFileTypes?: string[];
}

export const useFileInput = ({
  onFilesSelected,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024,
  acceptedFileTypes = ['image/*', 'application/pdf'],
}: UseFileInputProps) => {
  const validateFiles = useCallback((files: File[]): File[] => {
    if (files.length > maxFiles) return [];

    return files.filter(file => {
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
  }, [maxFiles, maxSize, acceptedFileTypes]);

  const handleFileInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const validFiles = validateFiles(Array.from(files));
      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
      event.target.value = '';
    }
  }, [onFilesSelected, validateFiles]);

  return {
    handleFileInputChange,
  };
}; 