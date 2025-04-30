import { useRef, useEffect } from 'react';
import { StatusZoneProps } from '../../../../../types/fileDropZone';

/**
 * Component for displaying the status of uploaded files
 * Shows a horizontal list of file chips with status indicators
 */
export const StatusZone = ({
  files,
  onRemoveFile,
  onRetryUpload,
  className = '',
}: StatusZoneProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Handle wheel events to enable horizontal scrolling
  const handleWheel = (event: WheelEvent) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const { scrollLeft, scrollWidth, clientWidth } = container;
      
      // Only prevent default if we're at the boundaries and trying to scroll further
      if (
        (scrollLeft <= 0 && event.deltaY < 0) ||
        (scrollLeft + clientWidth >= scrollWidth && event.deltaY > 0)
      ) {
        event.preventDefault();
      } else {
        // Implement horizontal scrolling
        event.preventDefault();
        container.scrollLeft += event.deltaY;
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

  if (files.length === 0) {
    return null;
  }

  return (
    <div 
      ref={scrollContainerRef}
      className={`flex flex-nowrap overflow-x-auto pb-2 gap-2 ${className}`}
      aria-label="File upload status"
    >
      {files.map(file => (
        <div
          key={file.id}
          className={`relative group flex items-center gap-1 px-2 py-1 rounded-full whitespace-nowrap ${
            file.status === 'error'
              ? 'bg-red-50 border border-red-200'
              : file.status === 'success'
                ? 'bg-green-50 border border-green-200'
                : file.status === 'uploading'
                  ? 'bg-blue-50 border border-blue-200'
                  : file.status === 'paused'
                    ? 'bg-yellow-50 border border-yellow-200'
                    : file.status === 'cancelled'
                      ? 'bg-gray-50 border border-gray-200'
                      : 'bg-gray-50 border border-gray-200'
          }`}
        >
          <div className="flex items-center gap-1">
            {file.status === 'uploading' && (
              <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" 
                   aria-hidden="true" />
            )}
            {file.status === 'success' && (
              <div className="w-3 h-3 text-green-500" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            {file.status === 'error' && (
              <div className="w-3 h-3 text-red-500" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
            {file.status === 'paused' && (
              <div className="w-3 h-3 text-yellow-500" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                </svg>
              </div>
            )}
            <span className="text-xs text-gray-700 truncate max-w-[100px]" title={file.file.name}>
              {file.file.name}
            </span>
            <span className="text-[10px] text-gray-500">
              {(file.file.size / 1024 / 1024).toFixed(2)}MB
            </span>
          </div>
          
          {file.status === 'error' && (
            <button
              onClick={() => onRetryUpload(file.id)}
              className="text-blue-500 hover:text-blue-700 text-[10px] font-medium"
              aria-label={`Retry uploading ${file.file.name}`}
            >
              Retry
            </button>
          )}
          
          <button
            onClick={() => onRemoveFile(file.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-400 hover:text-gray-600 ml-1"
            aria-label={`Remove ${file.file.name}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          {file.status === 'uploading' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-200 rounded-full">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-150 ease-out"
                style={{ width: `${file.progress}%` }}
                role="progressbar"
                aria-valuenow={file.progress}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}; 