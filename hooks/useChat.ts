import { useState, useEffect } from 'react';
import { Message } from '@/types';
import { sendChatMessage, resetConversation } from '@/lib/api';

export interface UseChatOptions {
  initialMessages?: Message[];
  persistMessages?: boolean;
}

export function useChat(options: UseChatOptions = {}) {
  const {
    initialMessages = [],
    persistMessages = true,
  } = options;

  // Initialize messages from localStorage if available
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window === 'undefined' || !persistMessages) {
      return initialMessages;
    }
    
    try {
      const storedMessages = localStorage.getItem('chat-messages');
      if (storedMessages) {
        return JSON.parse(storedMessages);
      }
    } catch (error) {
      console.error('Failed to load chat history from localStorage', error);
    }
    
    return initialMessages;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save messages to localStorage when they change
  useEffect(() => {
    if (typeof window === 'undefined' || !persistMessages) {
      return;
    }
    
    try {
      localStorage.setItem('chat-messages', JSON.stringify(messages));
    } catch (error) {
      console.error('Failed to save chat history to localStorage', error);
    }
  }, [messages, persistMessages]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    // Create a new user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      createdAt: new Date().toISOString(),
    };
    
    // Add the user message to the state
    setMessages((prev) => [...prev, userMessage]);
    
    // Set loading state and clear any previous errors
    setIsLoading(true);
    setError(null);
    
    try {
      // Send the message to the API
      const response = await sendChatMessage(content);
      
      // Create an assistant message from the response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.answer,
        role: 'assistant',
        createdAt: new Date().toISOString(),
        metadata: {
          sources: response.sources,
          processingTime: response.processing_time
        }
      };
      
      // Add the assistant message to the state
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      // Handle error
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, there was an error processing your request. Please try again.',
        role: 'assistant',
        createdAt: new Date().toISOString(),
        error: true
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = async () => {
    try {
      setIsLoading(true);
      
      // Call API to reset conversation
      await resetConversation();
      
      // Clear messages
      setMessages([]);
      setError(null);
      
      // Clear localStorage if persisting
      if (persistMessages && typeof window !== 'undefined') {
        localStorage.removeItem('chat-messages');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset conversation');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    reset
  };
} 