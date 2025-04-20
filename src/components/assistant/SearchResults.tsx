
import React from 'react';
import { SearchResult } from '@/types/assistant';
import { MdSearch, MdOpenInNew } from 'react-icons/md';

interface SearchResultsProps {
  results: SearchResult[];
}

const SearchResults: React.FC<SearchResultsProps> = ({ results }) => {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <MdSearch className="text-assistant-primary" size={18} />
        <h3 className="text-sm font-medium">Web Search Results</h3>
      </div>
      
      <div className="space-y-3">
        {results.map((result, index) => (
          <div 
            key={index}
            className="bg-white/70 rounded-lg p-3 text-left border border-assistant-light/30 hover:border-assistant-primary/30 transition-all"
          >
            <a 
              href={result.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-start gap-2"
            >
              <div className="flex-1">
                <h4 className="text-sm font-medium text-assistant-primary truncate">
                  {result.title}
                </h4>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {result.snippet}
                </p>
                <div className="text-xs text-gray-400 mt-1 truncate">
                  {result.link}
                </div>
              </div>
              <MdOpenInNew className="text-assistant-primary mt-1" size={16} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
