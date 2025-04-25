import { useRef, useEffect } from 'react';
import { StatusZoneProps } from '../types';
import { FileList } from './FileList';

export const StatusZone = ({
  files,
  onRemoveFile,
  onRetryUpload,
  className = '',
}: StatusZoneProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleWheel = (event: WheelEvent) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const { scrollTop, scrollHeight, clientHeight } = container;
      
      // Only prevent default if we're at the boundaries and trying to scroll further
      if (
        (scrollTop <= 0 && event.deltaY < 0) ||
        (scrollTop + clientHeight >= scrollHeight && event.deltaY > 0)
      ) {
        event.preventDefault();
      }
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, []);

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {files.map(file => (
        <div
          key={file.id}
          className="relative group flex items-center gap-1 px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: file.status === 'error' ? '#FFF5F5' : '#EBF5FB',
            border: `1px solid ${file.status === 'error' ? '#FFCCCC' : '#3498db'}`,
          }}
        >
          <div className="flex items-center gap-1">
            {file.status === 'uploading' && (
              <div className="w-3 h-3 border-2 border-[#3498db] border-t-transparent rounded-full animate-spin" />
            )}
            {file.status === 'success' && (
              <div className="w-3 h-3 text-[#3498db]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            {file.status === 'error' && (
              <div className="w-3 h-3 text-[#E53E3E]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
            <span className="text-xs text-gray-700 truncate max-w-[100px]">
              {file.file.name}
            </span>
            <span className="text-[10px] text-gray-500">
              {(file.file.size / 1024 / 1024).toFixed(2)}MB
            </span>
          </div>
          
          {file.status === 'error' && (
            <button
              onClick={() => onRetryUpload(file.id)}
              className="text-[#3498db] hover:text-[#2980b9] text-[10px] font-medium"
            >
              Retry
            </button>
          )}
          
          <button
            onClick={() => onRemoveFile(file.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-400 hover:text-gray-600 ml-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          {file.status === 'uploading' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-200 rounded-full">
              <div
                className="h-full bg-[#3498db] rounded-full"
                style={{ width: `${file.progress}%` }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}; 