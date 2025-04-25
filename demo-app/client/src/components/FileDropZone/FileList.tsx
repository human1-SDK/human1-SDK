import React, { useEffect, useRef } from 'react';
import { FileUploadStatus } from './types';

interface FileListProps {
  uploadStatuses: FileUploadStatus[];
}

const getStatusColor = (status: FileUploadStatus['status']) => {
  switch (status) {
    case 'complete':
      return '#2C5282'; // darker blue
    case 'error':
      return '#E53E3E'; // red
    case 'uploading':
      return '#3498db'; // primary blue
    default:
      return '#A0AEC0'; // gray
  }
};

const getStatusIcon = (status: FileUploadStatus['status']) => {
  switch (status) {
    case 'complete':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    case 'error':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      );
    case 'uploading':
      return (
        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      );
    default:
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
};

export const FileList: React.FC<FileListProps> = ({ uploadStatuses }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      console.log('FileList container dimensions:', {
        scrollHeight: containerRef.current.scrollHeight,
        clientHeight: containerRef.current.clientHeight,
        offsetHeight: containerRef.current.offsetHeight,
        childCount: containerRef.current.children.length,
        style: window.getComputedStyle(containerRef.current)
      });
    }
  }, [uploadStatuses]);

  return (
    <div ref={containerRef} className="p-4">
      <div className="space-y-2">
        {uploadStatuses.map((status, index) => (
          <div 
            key={index} 
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex-shrink-0" style={{ color: getStatusColor(status.status) }}>
              {getStatusIcon(status.status)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700 truncate">{status.file.name}</span>
                <span className="text-gray-500 ml-2">{status.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                <div
                  className="h-1.5 rounded-full transition-all duration-200"
                  style={{
                    width: `${status.progress}%`,
                    backgroundColor: getStatusColor(status.status)
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 