
import React, { useState } from 'react';
import { useAssistant } from '@/context/AssistantContext';
import { Button } from '@/components/ui/button';
import { MdUpload, MdFolderOpen, MdCheck } from 'react-icons/md';
import { FileResult } from '@/types/assistant';

const FileAccessDemo: React.FC = () => {
  const { state, sendMessage } = useAssistant();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const fileList = Array.from(event.target.files);
      setSelectedFiles(fileList);
      
      // Convert files to our app's format to demonstrate integration
      const fileResults: FileResult[] = fileList.map(file => ({
        name: file.name,
        path: `/Uploads/${file.name}`,
        type: file.type.split('/')[0] || 'document',
        size: file.size,
        lastModified: new Date(file.lastModified)
      }));
      
      // Simulate file processing
      setTimeout(() => {
        setIsUploading(false);
        sendMessage(`I've uploaded ${fileList.length} files to demonstrate file access functionality`, 'text');
      }, 1500);
    }
  };
  
  const handleUpload = () => {
    if (selectedFiles.length === 0) {
      // Open file picker if no files selected
      document.getElementById('file-upload')?.click();
    } else {
      setIsUploading(true);
    }
  };
  
  if (state.fileAccess || selectedFiles.length > 0) {
    return null;
  }
  
  return (
    <div className="px-4 py-3 bg-white/60 backdrop-blur-sm rounded-xl border border-assistant-light/30 mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-2">File Access Demo</h3>
      <p className="text-xs text-gray-600 mb-3">
        Upload files to demonstrate the assistant's ability to access and process your local files
      </p>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="bg-white/80 hover:bg-assistant-light/30 border-assistant-light/30 text-assistant-primary"
          onClick={handleUpload}
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <MdCheck className="mr-1" size={16} />
              Processing...
            </>
          ) : selectedFiles.length > 0 ? (
            <>
              <MdCheck className="mr-1" size={16} />
              {selectedFiles.length} files selected
            </>
          ) : (
            <>
              <MdUpload className="mr-1" size={16} />
              Select Files
            </>
          )}
        </Button>
        
        <Button
          variant="outline"
          className="bg-white/80 hover:bg-assistant-light/30 border-assistant-light/30"
          onClick={() => sendMessage("Can you access my files?", 'text')}
        >
          <MdFolderOpen className="mr-1" size={16} />
          Ask about files
        </Button>
      </div>
      
      <input
        id="file-upload"
        type="file"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
};

export default FileAccessDemo;
