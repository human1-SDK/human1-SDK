import { useRef } from 'react';
import { UploadZoneProps } from '../types';

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

  const handleClick = () => {
    console.log('UploadZone clicked');
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File input changed:', event.target.files);
    const files = event.target.files;
    if (files) {
      console.log('Calling onFilesSelected with:', Array.from(files));
      onFilesSelected(Array.from(files));
      event.target.value = '';
    }
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg transition-all duration-200 ${
        isDragging
          ? isOver
            ? isValid
              ? 'border-[#3498db] bg-[#f5f5f5]'
              : 'border-[#FFCCCC] bg-[#FFF5F5]'
            : 'border-[#e0e0e0] bg-white'
          : 'border-[#e0e0e0] hover:border-[#3498db] hover:bg-[#f5f5f5]'
      } ${className}`}
      onClick={handleClick}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedFileTypes.join(',')}
        onChange={handleFileInputChange}
        className="hidden"
      />
      <div className="text-center space-y-3">
        <div className="w-12 h-12 mx-auto mb-2">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            className={`w-full h-full ${
              isDragging
                ? isOver
                  ? isValid
                    ? 'text-[#3498db]'
                    : 'text-[#E53E3E]'
                  : 'text-gray-400'
                : 'text-gray-400 group-hover:text-[#3498db]'
            }`}
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
          {acceptedFileTypes.join(', ')} up to {maxSize / 1024 / 1024}MB
        </p>
      </div>
      {isDragging && isOver && (
        <div className="absolute inset-0 bg-[#3498db] bg-opacity-5 pointer-events-none" />
      )}
    </div>
  );
}; 