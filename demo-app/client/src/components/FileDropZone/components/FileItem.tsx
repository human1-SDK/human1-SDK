import { FileItemProps } from '../types';

export const FileItem = ({
  file,
  onRemove,
  onRetry,
  className = '',
}: FileItemProps) => {
  const getStatusColor = () => {
    switch (file.status) {
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      case 'uploading':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = () => {
    switch (file.status) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'uploading':
        return '⟳';
      default:
        return '○';
    }
  };

  return (
    <div className={`flex items-center justify-between p-4 bg-white rounded-lg shadow ${className}`}>
      <div className="flex items-center space-x-4">
        <span className={`text-lg ${getStatusColor()}`}>{getStatusIcon()}</span>
        <div>
          <p className="text-sm font-medium text-gray-900">{file.file.name}</p>
          <p className="text-xs text-gray-500">
            {(file.file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {file.status === 'error' && (
          <button
            onClick={onRetry}
            className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
          >
            Retry
          </button>
        )}
        <button
          onClick={onRemove}
          className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
        >
          Remove
        </button>
      </div>
    </div>
  );
}; 