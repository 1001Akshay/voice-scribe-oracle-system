
import React from 'react';
import { AssistantProvider } from '@/context/AssistantContext';
import AssistantInterface from './AssistantInterface';
import VoicePulse from './VoicePulse';

const AssistantContainer: React.FC = () => {
  return (
    <AssistantProvider>
      <div className="voice-assistant-bg min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-6">
        <AssistantInterface />
        <VoicePulse />
      </div>
    </AssistantProvider>
  );
};

export default AssistantContainer;
