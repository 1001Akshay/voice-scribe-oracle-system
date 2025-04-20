
import React from 'react';
import { useAssistant } from '@/context/AssistantContext';
import { Button } from '@/components/ui/button';

const examples = [
  "Find files related to my project",
  "Search the web for voice assistant technologies",
  "Tell me about yourself",
  "How does voice recognition work?",
  "Can you access my documents folder?",
  "What can you help me with?",
];

const ExamplePrompts: React.FC = () => {
  const { sendMessage } = useAssistant();
  
  return (
    <div className="px-4 py-3 bg-white/60 backdrop-blur-sm rounded-xl border border-assistant-light/30 mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Try asking:</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {examples.map((example, index) => (
          <Button
            key={index}
            variant="outline"
            className="text-xs text-left justify-start h-auto py-2 bg-white/80 hover:bg-assistant-light/30 border-assistant-light/30"
            onClick={() => sendMessage(example)}
          >
            {example}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ExamplePrompts;
