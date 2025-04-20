
import React from 'react';
import { Message } from '@/types/assistant';
import { MdOutlineSmartToy, MdPerson } from 'react-icons/md';
import { formatDistanceToNow } from 'date-fns';

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`flex max-w-[80%] ${
              message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-full ${
                message.role === 'user'
                  ? 'bg-assistant-primary/10 text-assistant-primary ml-2'
                  : 'bg-assistant-secondary/10 text-assistant-secondary mr-2'
              }`}
            >
              {message.role === 'user' ? (
                <MdPerson size={20} />
              ) : (
                <MdOutlineSmartToy size={20} />
              )}
            </div>
            <div
              className={`rounded-2xl px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-assistant-primary text-white'
                  : 'bg-assistant-light/20 text-gray-800'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              <div
                className={`mt-1 text-xs ${
                  message.role === 'user' ? 'text-white/70' : 'text-gray-500'
                }`}
              >
                {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                {message.source && (
                  <span className="ml-2">
                    via {message.source === 'voice' ? '🎤 voice' : '⌨️ text'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
