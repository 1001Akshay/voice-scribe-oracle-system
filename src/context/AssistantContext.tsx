
import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { AssistantState, Message, SearchResult, FileResult } from '@/types/assistant';
import { 
  generateId, 
  processQuery, 
  setupSpeechRecognition, 
  speak, 
  requestFileAccess 
} from '@/lib/assistant';

// Define available actions
type AssistantAction = 
  | { type: 'ADD_MESSAGE'; message: Message }
  | { type: 'SET_LISTENING'; isListening: boolean }
  | { type: 'SET_PROCESSING'; isProcessing: boolean }
  | { type: 'SET_FILE_ACCESS'; fileAccess: boolean }
  | { type: 'SET_SEARCH_RESULTS'; results: SearchResult[] | null }
  | { type: 'SET_FILE_RESULTS'; results: FileResult[] | null }
  | { type: 'SET_CURRENT_QUERY'; query: string | null }
  | { type: 'CLEAR_RESULTS' };

// Define the context type
type AssistantContextType = {
  state: AssistantState;
  sendMessage: (content: string, source?: 'voice' | 'text') => Promise<void>;
  startListening: () => void;
  stopListening: () => void;
  requestFileSystemAccess: () => Promise<boolean>;
  clearResults: () => void;
};

// Initial state
const initialState: AssistantState = {
  messages: [
    {
      id: generateId(),
      content: "Hello! I'm your virtual assistant. I can help you find information from your files or the web. How can I assist you today?",
      role: 'assistant',
      timestamp: new Date(),
    }
  ],
  isListening: false,
  isProcessing: false,
  fileAccess: false,
  searchResults: null,
  fileResults: null,
  currentQuery: null
};

// Create the context
const AssistantContext = createContext<AssistantContextType | undefined>(undefined);

// Reducer function
function assistantReducer(state: AssistantState, action: AssistantAction): AssistantState {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.message]
      };
    case 'SET_LISTENING':
      return {
        ...state,
        isListening: action.isListening
      };
    case 'SET_PROCESSING':
      return {
        ...state,
        isProcessing: action.isProcessing
      };
    case 'SET_FILE_ACCESS':
      return {
        ...state,
        fileAccess: action.fileAccess
      };
    case 'SET_SEARCH_RESULTS':
      return {
        ...state,
        searchResults: action.results
      };
    case 'SET_FILE_RESULTS':
      return {
        ...state,
        fileResults: action.results
      };
    case 'SET_CURRENT_QUERY':
      return {
        ...state,
        currentQuery: action.query
      };
    case 'CLEAR_RESULTS':
      return {
        ...state,
        searchResults: null,
        fileResults: null,
        currentQuery: null
      };
    default:
      return state;
  }
}

// Provider component
export const AssistantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(assistantReducer, initialState);
  const [recognition, setRecognition] = useState<{ start: () => void; stop: () => void } | null>(null);

  // Set up speech recognition on mount
  useEffect(() => {
    const recognitionInstance = setupSpeechRecognition(
      (transcript) => {
        if (transcript.trim()) {
          sendMessage(transcript, 'voice');
        }
      },
      () => {
        dispatch({ type: 'SET_LISTENING', isListening: false });
      }
    );
    
    setRecognition(recognitionInstance);
    
    // Cleanup
    return () => {
      recognitionInstance.stop();
    };
  }, []);

  // Add first-time welcome message
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenAssistantWelcome');
    
    if (!hasSeenWelcome) {
      speak("Hello! I'm your virtual assistant. I can help you find information from your files or the web. How can I assist you today?");
      localStorage.setItem('hasSeenAssistantWelcome', 'true');
    }
  }, []);

  // Send a message and get a response
  const sendMessage = async (content: string, source: 'voice' | 'text' = 'text') => {
    if (!content.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: generateId(),
      content,
      role: 'user',
      timestamp: new Date(),
      source
    };
    
    dispatch({ type: 'ADD_MESSAGE', message: userMessage });
    dispatch({ type: 'SET_PROCESSING', isProcessing: true });
    dispatch({ type: 'SET_CURRENT_QUERY', query: content });
    dispatch({ type: 'CLEAR_RESULTS' });
    
    try {
      // Process the query
      const result = await processQuery(content);
      
      // Add assistant response
      const assistantMessage: Message = {
        id: generateId(),
        content: result.response,
        role: 'assistant',
        timestamp: new Date()
      };
      
      dispatch({ type: 'ADD_MESSAGE', message: assistantMessage });
      
      // Set any search or file results
      if (result.searchResults) {
        dispatch({ type: 'SET_SEARCH_RESULTS', results: result.searchResults });
      }
      
      if (result.fileResults) {
        dispatch({ type: 'SET_FILE_RESULTS', results: result.fileResults });
      }
      
      // Speak the response if the query was from voice
      if (source === 'voice') {
        speak(result.response);
      }
    } catch (error) {
      console.error('Error processing query:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: generateId(),
        content: "I'm sorry, I encountered an error processing your request. Please try again.",
        role: 'assistant',
        timestamp: new Date()
      };
      
      dispatch({ type: 'ADD_MESSAGE', message: errorMessage });
      
      if (source === 'voice') {
        speak("I'm sorry, I encountered an error processing your request. Please try again.");
      }
    } finally {
      dispatch({ type: 'SET_PROCESSING', isProcessing: false });
    }
  };

  // Start listening for voice input
  const startListening = () => {
    if (recognition && !state.isListening && !state.isProcessing) {
      dispatch({ type: 'SET_LISTENING', isListening: true });
      recognition.start();
    }
  };

  // Stop listening for voice input
  const stopListening = () => {
    if (recognition && state.isListening) {
      recognition.stop();
      dispatch({ type: 'SET_LISTENING', isListening: false });
    }
  };

  // Request access to the file system
  const requestFileSystemAccess = async () => {
    const hasAccess = await requestFileAccess();
    dispatch({ type: 'SET_FILE_ACCESS', fileAccess: hasAccess });
    return hasAccess;
  };

  // Clear search and file results
  const clearResults = () => {
    dispatch({ type: 'CLEAR_RESULTS' });
  };

  // Context value
  const contextValue: AssistantContextType = {
    state,
    sendMessage,
    startListening,
    stopListening,
    requestFileSystemAccess,
    clearResults
  };

  return (
    <AssistantContext.Provider value={contextValue}>
      {children}
    </AssistantContext.Provider>
  );
};

// Hook for using the assistant context
export const useAssistant = () => {
  const context = useContext(AssistantContext);
  
  if (context === undefined) {
    throw new Error('useAssistant must be used within an AssistantProvider');
  }
  
  return context;
};
