
import React, { useState, useRef, useEffect } from 'react';
import { useAssistant } from '@/context/AssistantContext';
import MessageList from './MessageList';
import AssistantControls from './AssistantControls';
import SearchResults from './SearchResults';
import FileResults from './FileResults';
import ExamplePrompts from './ExamplePrompts';
import FileAccessDemo from './FileAccessDemo';
import { Card } from '@/components/ui/card';

const AssistantInterface: React.FC = () => {
  const { state } = useAssistant();
  const [inputHeight, setInputHeight] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update layout when results are shown or hidden
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [state.messages, state.searchResults, state.fileResults]);

  // Handle control height changes
  const handleControlsHeightChange = (height: number) => {
    setInputHeight(height);
  };

  // Calculate if we need to show the results panel
  const showResultsPanel = state.searchResults || state.fileResults;

  return (
    <div className="w-full max-w-4xl flex flex-col h-[90vh] relative">
      <Card className="assistant-card flex-1 flex flex-col overflow-hidden mb-4">
        <div className="p-4 bg-gradient-to-r from-assistant-primary to-assistant-secondary text-white rounded-t-xl">
          <h1 className="text-xl font-bold">Voice Scribe Oracle System</h1>
          <p className="text-sm opacity-90">Your AI assistant for files and web</p>
        </div>
        
        <div 
          ref={containerRef}
          className="flex-1 overflow-y-auto p-4 pb-2"
          style={{ maxHeight: `calc(100% - ${inputHeight + 60}px)` }}
        >
          {state.messages.length <= 1 && (
            <>
              <FileAccessDemo />
              <ExamplePrompts />
            </>
          )}
          <MessageList messages={state.messages} />
        </div>
        
        {showResultsPanel && (
          <div className="p-4 border-t border-assistant-light/20">
            {state.searchResults && <SearchResults results={state.searchResults} />}
            {state.fileResults && <FileResults results={state.fileResults} />}
          </div>
        )}
        
        <div className="p-4 border-t border-assistant-light/20">
          <AssistantControls onHeightChange={handleControlsHeightChange} />
        </div>
      </Card>
    </div>
  );
};

export default AssistantInterface;
