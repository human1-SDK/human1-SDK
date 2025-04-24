import { useState, useCallback } from 'react';
import { DragState } from '../types';

interface UseDragDropProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number;
  acceptedFileTypes?: string[];
}

export const useDragDrop = ({
  onFilesSelected,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024,
  acceptedFileTypes = ['image/*', 'application/pdf'],
}: UseDragDropProps) => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    isOver: false,
    isValid: true,
  });

  const validateFiles = useCallback((files: File[]): boolean => {
    console.log('Validating files:', files);
    if (files.length > maxFiles) {
      console.log('Too many files');
      return false;
    }

    const isValid = files.every(file => {
      const isValidType = acceptedFileTypes.some(type => {
        if (type.endsWith('/*')) {
          const category = type.split('/')[0];
          return file.type.startsWith(category);
        }
        return file.type === type;
      });

      const isValidSize = file.size <= maxSize;

      console.log('File validation:', {
        file: file.name,
        type: file.type,
        size: file.size,
        isValidType,
        isValidSize
      });

      return isValidType && isValidSize;
    });

    console.log('Files validation result:', isValid);
    return isValid;
  }, [maxFiles, maxSize, acceptedFileTypes]);

  const handleDragEnter = useCallback((event: React.DragEvent) => {
    console.log('Drag enter');
    event.preventDefault();
    event.stopPropagation();
    setDragState(prev => ({ ...prev, isDragging: true }));
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    console.log('Drag leave');
    event.preventDefault();
    event.stopPropagation();
    setDragState(prev => ({ ...prev, isDragging: false, isOver: false }));
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    console.log('Drag over');
    event.preventDefault();
    event.stopPropagation();
    setDragState(prev => ({ ...prev, isOver: true }));
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    console.log('Drop event');
    event.preventDefault();
    event.stopPropagation();

    const files = Array.from(event.dataTransfer?.files || []);
    console.log('Dropped files:', files);

    const isValid = validateFiles(files);

    setDragState({
      isDragging: false,
      isOver: false,
      isValid,
    });

    if (isValid && files.length > 0) {
      console.log('Calling onFilesSelected with dropped files');
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