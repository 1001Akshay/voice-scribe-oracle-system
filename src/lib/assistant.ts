
import { Message, SearchResult, FileResult } from "@/types/assistant";

// Generate unique IDs for messages
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

// Mock function to process queries - in a real app, this would call an API
export async function processQuery(query: string): Promise<{
  response: string;
  searchResults?: SearchResult[];
  fileResults?: FileResult[];
}> {
  // This is a simplified mock implementation
  // In a real app, you would:
  // 1. Process the query with NLP
  // 2. Decide if it needs file access or web search
  // 3. Call appropriate APIs or services
  
  const lowerQuery = query.toLowerCase();
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // File search simulation
  if (lowerQuery.includes("file") || lowerQuery.includes("document") || lowerQuery.includes("find")) {
    const fileResults: FileResult[] = [
      {
        name: "project_report.docx",
        path: "/Documents/Work/project_report.docx",
        type: "document",
        size: 1250000,
        lastModified: new Date(Date.now() - 86400000)
      },
      {
        name: "budget.xlsx",
        path: "/Documents/Finance/budget.xlsx",
        type: "spreadsheet",
        size: 950000,
        lastModified: new Date(Date.now() - 172800000)
      }
    ];
    
    return {
      response: "I found these files that might be relevant to your query:",
      fileResults
    };
  }
  
  // Web search simulation
  if (lowerQuery.includes("search") || lowerQuery.includes("google") || lowerQuery.includes("find") || lowerQuery.includes("what") || lowerQuery.includes("how")) {
    const searchResults: SearchResult[] = [
      {
        title: "How Voice Assistants Work - TechExplainer",
        snippet: "Voice assistants use speech recognition, natural language processing, and machine learning to understand and respond to user queries...",
        link: "https://example.com/voice-assistants"
      },
      {
        title: "Building Your Own Voice Assistant - Developer Guide",
        snippet: "This tutorial walks through creating a simple voice assistant using Web Speech API and natural language processing...",
        link: "https://example.com/build-voice-assistant"
      }
    ];
    
    return {
      response: "Here's what I found on the web for your query:",
      searchResults
    };
  }
  
  // General responses
  const responses = [
    "I'm your personal assistant. How can I help you today?",
    "I can search the web, access files, and answer questions. What would you like to know?",
    "I'm designed to help with file access and web searches. What can I assist you with?",
    "I can help you find information both on your device and on the web. What are you looking for?"
  ];
  
  return {
    response: responses[Math.floor(Math.random() * responses.length)]
  };
}

// Function to handle speech recognition
export function setupSpeechRecognition(
  onResult: (transcript: string) => void, 
  onEnd: () => void
): { start: () => void; stop: () => void } {
  // Check if the browser supports the Web Speech API
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    console.error('Speech recognition is not supported in this browser');
    return {
      start: () => console.error('Speech recognition not supported'),
      stop: () => console.error('Speech recognition not supported')
    };
  }

  // Create speech recognition instance
  const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognitionAPI!();

  // Configure
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  // Set up event handlers
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  recognition.onend = onEnd;

  recognition.onerror = (event) => {
    console.error('Speech recognition error', event.error);
    onEnd();
  };

  return {
    start: () => recognition.start(),
    stop: () => recognition.stop()
  };
}

// Function to handle text-to-speech
export function speak(text: string): void {
  if (!('speechSynthesis' in window)) {
    console.error('Text-to-speech is not supported in this browser');
    return;
  }

  // Create utterance
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  
  // Use a voice that sounds natural if available
  const voices = speechSynthesis.getVoices();
  const preferredVoice = voices.find(voice => 
    voice.name.includes('Google') || 
    voice.name.includes('Samantha') || 
    voice.name.includes('Female')
  );
  
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  // Speak
  speechSynthesis.speak(utterance);
}

// File access handlers - these would use the File System Access API in a real app
export async function requestFileAccess(): Promise<boolean> {
  try {
    // In a real implementation, this would use the File System Access API
    // For our demo, we'll just simulate successful access
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  } catch (error) {
    console.error('Error requesting file access:', error);
    return false;
  }
}

export async function searchFiles(query: string): Promise<FileResult[]> {
  // In a real implementation, this would search the file system
  // For our demo, we'll return mock results
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return [
    {
      name: "project_report.docx",
      path: "/Documents/Work/project_report.docx",
      type: "document",
      size: 1250000,
      lastModified: new Date(Date.now() - 86400000)
    },
    {
      name: "meeting_notes.txt",
      path: "/Documents/Notes/meeting_notes.txt",
      type: "text",
      size: 45000,
      lastModified: new Date(Date.now() - 43200000)
    },
    {
      name: "budget.xlsx",
      path: "/Documents/Finance/budget.xlsx",
      type: "spreadsheet",
      size: 950000,
      lastModified: new Date(Date.now() - 172800000)
    }
  ].filter(file => 
    file.name.toLowerCase().includes(query.toLowerCase()) || 
    file.path.toLowerCase().includes(query.toLowerCase())
  );
}

// Web search function - in a real app, this would use a search API
export async function searchWeb(query: string): Promise<SearchResult[]> {
  // In a real implementation, this would call a search API like Google or Bing
  // For our demo, we'll return mock results
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  return [
    {
      title: `Results for "${query}" - Example Search`,
      snippet: `This is a sample search result for your query "${query}". In a real application, this would show actual web search results.`,
      link: "https://example.com/search"
    },
    {
      title: `${query} - Wikipedia`,
      snippet: `Wikipedia page about ${query} with comprehensive information and references to related topics.`,
      link: "https://example.com/wiki"
    },
    {
      title: `How to ${query} - Tutorial`,
      snippet: `Step-by-step guide on how to ${query} with examples and practical tips for beginners.`,
      link: "https://example.com/tutorial"
    }
  ];
}
