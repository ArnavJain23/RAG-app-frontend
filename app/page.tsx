"use client"

import { useState, useEffect } from "react"
import ChatInterface from "@/components/chat-interface"
import Sidebar from "@/components/sidebar"
import { useChat } from "@/hooks/useChat"
import { Chat } from "@/types"
import { checkApiHealth } from "@/lib/api"

export default function Home() {
  const [apiStatus, setApiStatus] = useState<{ online: boolean; message?: string }>({ online: true });
  
  // Using our custom hook instead of manual state management
  const { messages, isLoading, error, sendMessage, reset } = useChat();
  
  // For managing chat history in sidebar
  const [currentChatId, setCurrentChatId] = useState<string>("default");
  const [chats, setChats] = useState<Chat[]>([
    {
      id: "default",
      title: "RAG Chat",
      createdAt: new Date().toISOString(),
    }
  ]);

  // Check API health on component mount
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const health = await checkApiHealth();
        setApiStatus(health);
      } catch (err) {
        setApiStatus({ online: false, message: "Cannot connect to backend API" });
      }
    };

    checkHealth();
  }, []);

  // Handle creating a new chat (reset conversation)
  const handleNewChat = async () => {
    await reset();
  };

  // Display API connection error if API is offline
  if (!apiStatus.online) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground">
        <div className="p-8 max-w-md text-center bg-card rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Cannot Connect to Backend</h2>
          <p className="mb-4">{apiStatus.message || "The RAG API server is not available."}</p>
          <p className="text-sm text-muted-foreground">
            Please make sure the backend server is running at http://localhost:5000
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar chats={chats} currentChatId={currentChatId} onNewChat={handleNewChat} onSelectChat={() => {}} />
      <ChatInterface 
        messages={messages} 
        onSendMessage={sendMessage} 
        isLoading={isLoading}
        onReset={reset} 
      />
    </div>
  );
}

