
import React, { useState, useRef, useEffect } from 'react';
import { useAssistant } from '@/context/AssistantContext';
import { 
  MdMic, MdMicOff, MdSend, MdFolderOpen, 
  MdSearch, MdSettings, MdOutlineHelp 
} from 'react-icons/md';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AssistantControlsProps {
  onHeightChange?: (height: number) => void;
}

const AssistantControls: React.FC<AssistantControlsProps> = ({ onHeightChange }) => {
  const { state, sendMessage, startListening, stopListening, requestFileSystemAccess } = useAssistant();
  const [input, setInput] = useState('');
  const controlsRef = useRef<HTMLDivElement>(null);
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };
  
  // Toggle voice listening
  const toggleListening = () => {
    if (state.isListening) {
      stopListening();
    } else {
      startListening();
    }
  };
  
  // Request file access
  const handleFileAccess = async () => {
    const success = await requestFileSystemAccess();
    if (success) {
      sendMessage('I need to access my files, can you help me?');
    }
  };
  
  // Report height to parent
  useEffect(() => {
    if (controlsRef.current && onHeightChange) {
      onHeightChange(controlsRef.current.clientHeight);
    }
  }, [onHeightChange]);
  
  return (
    <div ref={controlsRef} className="relative">
      <div className="flex items-center">
        <form onSubmit={handleSubmit} className="flex-1 flex gap-2">
          <Input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder={state.isListening ? 'Listening...' : 'Type a message...'}
            className="assistant-input flex-1"
            disabled={state.isListening || state.isProcessing}
          />
          
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    onClick={toggleListening}
                    className={`${
                      state.isListening
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'assistant-button'
                    } size-10 p-0 flex items-center justify-center`}
                    disabled={state.isProcessing}
                  >
                    {state.isListening ? (
                      <MdMicOff size={24} className={state.isListening ? 'animate-pulse' : ''} />
                    ) : (
                      <MdMic size={24} />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {state.isListening ? 'Stop listening' : 'Start voice input'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="submit"
                    className="assistant-button size-10 p-0 flex items-center justify-center"
                    disabled={input.trim() === '' || state.isListening || state.isProcessing}
                  >
                    <MdSend size={20} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Send message
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </form>
      </div>
      
      <div className="flex justify-center gap-2 mt-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                onClick={handleFileAccess}
                variant="outline"
                className="assistant-icon-button"
              >
                <MdFolderOpen size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Access files
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                onClick={() => sendMessage('Search the web for information about voice assistants')}
                variant="outline"
                className="assistant-icon-button"
              >
                <MdSearch size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Web search
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                onClick={() => sendMessage('What can you do?')}
                variant="outline"
                className="assistant-icon-button"
              >
                <MdOutlineHelp size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Help & Examples
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                onClick={() => sendMessage('Change your settings')}
                variant="outline"
                className="assistant-icon-button"
              >
                <MdSettings size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Settings
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {state.isProcessing && (
        <div className="absolute -top-8 left-0 right-0 text-center text-sm text-assistant-primary">
          <div className="inline-block px-3 py-1 bg-assistant-light/30 rounded-full animate-pulse">
            Processing your request...
          </div>
        </div>
      )}
    </div>
  );
};

export default AssistantControls;
