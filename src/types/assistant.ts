
export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  content: string;
  role: MessageRole;
  timestamp: Date;
  source?: 'voice' | 'text';
}

export interface SearchResult {
  title: string;
  snippet: string;
  link: string;
}

export interface FileResult {
  name: string;
  path: string;
  type: string;
  size: number;
  lastModified: Date;
}

export interface AssistantState {
  messages: Message[];
  isListening: boolean;
  isProcessing: boolean;
  fileAccess: boolean;
  searchResults: SearchResult[] | null;
  fileResults: FileResult[] | null;
  currentQuery: string | null;
}
