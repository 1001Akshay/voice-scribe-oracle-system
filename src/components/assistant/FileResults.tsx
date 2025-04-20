
import React from 'react';
import { FileResult } from '@/types/assistant';
import { 
  MdFolderOpen, MdDescription, MdOutlineInsertDriveFile,
  MdTableChart, MdOpenInNew, MdImage, MdTextSnippet
} from 'react-icons/md';
import { formatDistanceToNow } from 'date-fns';

interface FileResultsProps {
  results: FileResult[];
}

const FileResults: React.FC<FileResultsProps> = ({ results }) => {
  // Helper to get icon based on file type
  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'document':
        return <MdDescription className="text-blue-500" size={24} />;
      case 'spreadsheet':
        return <MdTableChart className="text-green-600" size={24} />;
      case 'image':
        return <MdImage className="text-purple-500" size={24} />;
      case 'text':
        return <MdTextSnippet className="text-gray-600" size={24} />;
      default:
        return <MdOutlineInsertDriveFile className="text-gray-500" size={24} />;
    }
  };
  
  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <MdFolderOpen className="text-assistant-primary" size={18} />
        <h3 className="text-sm font-medium">File Search Results</h3>
      </div>
      
      <div className="space-y-3">
        {results.map((file, index) => (
          <div 
            key={index}
            className="bg-white/70 rounded-lg p-3 text-left border border-assistant-light/30 hover:border-assistant-primary/30 transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                {getFileIcon(file.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <h4 className="text-sm font-medium text-gray-800 truncate">
                    {file.name}
                  </h4>
                  <button className="text-assistant-primary">
                    <MdOpenInNew size={16} />
                  </button>
                </div>
                
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {file.path}
                </p>
                
                <div className="flex gap-2 text-xs text-gray-500 mt-2">
                  <span>{formatFileSize(file.size)}</span>
                  <span>•</span>
                  <span>Modified {formatDistanceToNow(file.lastModified, { addSuffix: true })}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileResults;
