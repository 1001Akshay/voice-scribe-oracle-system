
import React from 'react';
import { useAssistant } from '@/context/AssistantContext';

const VoicePulse: React.FC = () => {
  const { state } = useAssistant();
  
  if (!state.isListening) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
      <div className="relative">
        <div className="absolute inset-0 bg-assistant-primary/10 rounded-full animate-ping" />
        <div className="absolute inset-0 bg-assistant-primary/20 rounded-full" style={{
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }} />
        <div className="absolute inset-0 bg-assistant-primary/30 rounded-full" style={{
          animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }} />
        <div className="w-24 h-24 bg-transparent" />
      </div>
    </div>
  );
};

export default VoicePulse;
