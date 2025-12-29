import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import apiClient from '@/lib/api';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Reset conversation when widget is opened
  useEffect(() => {
    if (!isOpen) {
      // Optionally preserve conversation state when closed, or clear it
      // For now, we'll preserve it so users can continue conversations
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: inputValue,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Use the apiClient which connects directly to the backend
      const response = await apiClient.post('/api/v1/chat', {
        message: inputValue,
        conversation_id: conversationId || undefined, // Use current conversation ID or undefined to create new
      });

      // Update conversation ID if a new conversation was created
      if (response.data.conversation_id && !conversationId) {
        setConversationId(response.data.conversation_id);
      }

      const aiMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);

      const errorMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    setInputValue(action);
    // Auto-submit if we want to send immediately
    // Or just populate the input field for user to review and send
  };

  // Function to start a new conversation
  const startNewConversation = () => {
    setConversationId(null);
    setMessages([]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-full max-w-sm sm:max-w-md md:w-96 h-[550px] bg-gray-900 text-white rounded-2xl shadow-xl flex flex-col border border-gray-700">
          {/* Header */}
          <div className="bg-gray-800 p-4 rounded-t-2xl flex justify-between items-center">
            <h3 className="font-bold text-lg">AI Assistant</h3>
            <div className="flex space-x-2">
              <button
                onClick={startNewConversation}
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Start new conversation"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col">
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                  <div className="mb-4">
                    <Bot className="text-[#D4E76C]" size={48} />
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold mb-2">👋 Hi! I'm your AI Task Manager</h2>
                  <p className="text-gray-400 mb-6">How can I help you today?</p>

                  <div className="flex flex-wrap gap-2 justify-center">
                    <button
                      onClick={() => handleQuickAction("📅 Add a task for tomorrow")}
                      className="px-3 py-2 bg-gray-800 text-sm rounded-full hover:bg-gray-700 transition-colors border border-gray-600"
                    >
                      📅 Add a task for tomorrow
                    </button>
                    <button
                      onClick={() => handleQuickAction("📋 List my pending tasks")}
                      className="px-3 py-2 bg-gray-800 text-sm rounded-full hover:bg-gray-700 transition-colors border border-gray-600"
                    >
                      📋 List my pending tasks
                    </button>
                    <button
                      onClick={() => handleQuickAction("✅ Complete a task")}
                      className="px-3 py-2 bg-gray-800 text-sm rounded-full hover:bg-gray-700 transition-colors border border-gray-600"
                    >
                      ✅ Complete a task
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`mb-3 rounded-2xl p-3 max-w-[85%] sm:max-w-[80%] ${
                      msg.role === 'user'
                        ? 'bg-[#D4E76C] text-gray-900 ml-auto'
                        : 'bg-gray-800 mr-auto'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                    <div className="text-sm opacity-70 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="bg-gray-800 rounded-2xl p-3 max-w-[85%] sm:max-w-[80%] mr-auto">
                    <div className="flex items-center">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-brand-lime rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-brand-lime rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-brand-lime rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="ml-2">Thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me to manage tasks..."
                className="flex-1 bg-gray-800 text-white rounded-full px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#D4E76C]"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-[#D4E76C] text-gray-900 rounded-full w-10 h-10 flex items-center justify-center hover:bg-[#c0d05c] transition-colors"
                disabled={isLoading || !inputValue.trim()}
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-[#D4E76C] text-gray-900 flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-105"
          aria-label="Open chat"
        >
          <MessageCircle size={24} />
        </button>
      )}
    </div>
  );
};

export default ChatWidget;