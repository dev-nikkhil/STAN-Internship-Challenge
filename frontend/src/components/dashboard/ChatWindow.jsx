import React, { useEffect, useRef } from 'react';
import { FiCopy } from 'react-icons/fi';

export default function ChatWindow({ messages = [], isLoading = false }) {
  const containerRef = useRef(null);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        console.log('Copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy:', err);
      });
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const LoadingIndicator = () => (
    <div className="flex justify-start pl-4">
      <div className="bg-white text-gray-800 rounded-xl rounded-tl-none px-4 py-3 max-w-[85%] min-w-0 shadow-sm border border-[#FFDAC1]">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-[#FF6B6B] rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-[#FD79A8] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-[#FF8E53] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span className="text-sm text-gray-600">Buddy is thinking...</span>
        </div>
      </div>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className="h-full w-full overflow-y-auto overflow-x-hidden pl-12 pr-4"
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      {/* Hide scrollbar with CSS */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      <div className="flex flex-col justify-end min-h-full w-full">
        <div className="space-y-4 mt-auto w-full">
          {messages.length === 0 && !isLoading ? (
            // Show welcome message when no messages and not loading
            <div className="text-center text-gray-600 py-8 w-full">
              <div className="mb-4">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-[#FF6B6B] to-[#FD79A8] bg-clip-text text-transparent">
                  Welcome to Buddy
                </h2>
              </div>
              <p className="text-gray-700">Start by introducing yourself</p>
            </div>
          ) : (
            // Render messages
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex w-full min-w-0 ${msg.sender === 'user' ? 'justify-end' : 'justify-start pl-4'}`}
              >
                <div className={`relative group ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} flex items-start max-w-[85%] min-w-0`}>
                  {/* Message Bubble */}
                  <div
                    className={`px-4 py-3 rounded-xl min-w-0 shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-[#FF6B6B] to-[#FD79A8] text-white rounded-tr-none'
                        : msg.isError
                        ? 'bg-red-100 text-red-800 border border-red-200 rounded-tl-none'
                        : 'bg-white text-gray-800 border border-[#FFDAC1] rounded-tl-none'
                    }`}
                    style={{
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      wordBreak: 'break-word',
                      hyphens: 'auto'
                    }}
                  >
                    <div className="whitespace-pre-wrap">
                      {msg.text}
                    </div>
                    
                    {/* Show code if present */}
                    {msg.code && (
                      <div className="mt-3 pt-3 border-t border-gray-300">
                        <div className="text-xs text-gray-500 mb-2">Generated Code:</div>
                        <div className="text-sm bg-gray-50 p-3 rounded border border-gray-200 overflow-x-auto max-w-full">
                          <pre className="whitespace-pre-wrap break-words text-xs leading-relaxed text-gray-700">
                            <code>{msg.code}</code>
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Copy Button */}
                  <button
                    onClick={() => copyToClipboard(msg.code || msg.text)}
                    className={`absolute ${msg.sender === 'user' ? '-left-8' : '-right-8'} top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-[#FF6B6B] hover:cursor-pointer flex-shrink-0`}
                    aria-label="Copy message"
                  >
                    <FiCopy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
          
          {/* Loading indicator */}
          {isLoading && <LoadingIndicator />}
        </div>
      </div>
    </div>
  );
}