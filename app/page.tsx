"use client"

import { useState } from "react"
import ChatInterface from "@/components/chat-interface"
import Sidebar from "@/components/sidebar"
import type { Message, Chat } from "@/types"

export default function Home() {
  // State for tracking the current chat and all chats
  const [currentChatId, setCurrentChatId] = useState<string>("new")
  const [chats, setChats] = useState<Chat[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Create a new chat
  const handleNewChat = () => {
    setMessages([])
    setCurrentChatId("new")
  }

  // Select an existing chat
  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId)

    // INTEGRATION POINT: Fetch chat history for the selected chat
    // Replace this with your API call to get chat messages
    setIsLoading(true)

    // Simulating API call - replace with your actual backend call
    setTimeout(() => {
      // This is where you would fetch messages from your Python backend
      // Example: const response = await fetch(`/api/chats/${chatId}/messages`);
      // const data = await response.json();
      // setMessages(data.messages);

      // Placeholder data - replace with your actual API response
      setMessages([])
      setIsLoading(false)
    }, 500)
  }

  // Send a message to the backend
  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    // Add user message to the UI immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      createdAt: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    // INTEGRATION POINT: Send message to your Python backend
    // Replace this with your actual API call
    try {
      // Example API call structure:
      // const response = await fetch('/api/chat', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     chatId: currentChatId === 'new' ? null : currentChatId,
      //     message: content
      //   })
      // });
      // const data = await response.json();

      // If this is a new chat, you might get a chat ID back from your backend
      // if (currentChatId === 'new' && data.chatId) {
      //   setCurrentChatId(data.chatId);
      //   // Update chats list with the new chat
      //   setChats(prev => [...prev, {
      //     id: data.chatId,
      //     title: content.slice(0, 30) || 'New Chat',
      //     createdAt: new Date().toISOString()
      //   }]);
      // }

      // Add AI response to the UI
      // const aiMessage: Message = {
      //   id: data.messageId,
      //   content: data.response,
      //   role: 'assistant',
      //   createdAt: new Date().toISOString(),
      // };

      // Simulating AI response - replace with your actual backend response
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "This is a placeholder response. Connect your Python backend to get real responses.",
          role: "assistant",
          createdAt: new Date().toISOString(),
        }

        setMessages((prev) => [...prev, aiMessage])
        setIsLoading(false)

        // If this is a new chat, create a chat entry
        if (currentChatId === "new") {
          const newChatId = Date.now().toString()
          setCurrentChatId(newChatId)
          setChats((prev) => [
            ...prev,
            {
              id: newChatId,
              title: content.slice(0, 30) || "New Chat",
              createdAt: new Date().toISOString(),
            },
          ])
        }
      }, 1000)
    } catch (error) {
      console.error("Error sending message:", error)
      setIsLoading(false)
      // Handle error state
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar chats={chats} currentChatId={currentChatId} onNewChat={handleNewChat} onSelectChat={handleSelectChat} />
      <ChatInterface messages={messages} onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  )
}

