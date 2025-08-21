import { useState, useRef, useEffect } from 'react';

export default function ChatBox({ onSendMessage, isLoading = false }) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
      resetTextareaHeight();
    }
  };

  const resetTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = '44px';
    }
  };

  const handleInput = () => {
    const textarea = textareaRef.current;
    const maxHeight = 120;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      textareaRef.current?.focus();
    }
  }, [isLoading]);

  return (
    <form onSubmit={handleSubmit} className="fixed bottom-4 left-0 right-0 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end gap-2 p-4">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            disabled={isLoading} 
            placeholder={isLoading ? "Your Buddy is thinking..." : "Ask more questions to your buddy..."}
            className={`flex-1 border border-[#FFDAC1] rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] resize-none overflow-hidden transition-all ${
              isLoading 
                ? 'bg-white/40 cursor-not-allowed text-gray-500' 
                : 'bg-white/80 hover:bg-white'
            }`}
            style={{
              minHeight: '44px',
              maxHeight: '120px',
              transition: 'height 0.2s ease-out'
            }}
          />
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className={`h-12 px-6 rounded-lg font-medium transition-all mb-1 ${
              isLoading || !message.trim()
                ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                : 'bg-gradient-to-r from-[#FF6B6B] to-[#FD79A8] hover:from-[#FF8E53] hover:to-[#FF9AA2] text-white'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Sending
              </div>
            ) : (
              'Send'
            )}
          </button>
        </div>
      </div>
    </form>
  );
}