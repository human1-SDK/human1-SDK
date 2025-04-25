import { FileListProps } from '../types';
import { FileItem } from './FileItem';

export const FileList = ({
  files,
  onRemoveFile,
  onRetryUpload,
  className = '',
}: FileListProps) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {files.map(file => (
        <FileItem
          key={file.id}
          file={file}
          onRemove={() => onRemoveFile(file.id)}
          onRetry={() => onRetryUpload(file.id)}
        />
      ))}
    </div>
  );
}; 