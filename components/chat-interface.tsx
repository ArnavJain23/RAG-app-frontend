"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import type { Message } from "@/types"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"
import MessageItem from "./message-item"

interface ChatInterfaceProps {
  messages: Message[]
  onSendMessage: (content: string) => void
  isLoading: boolean
}

export default function ChatInterface({ messages, onSendMessage, isLoading }: ChatInterfaceProps) {
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Track if user has submitted a query
  const hasSubmitted = messages.length > 0

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [input])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      onSendMessage(input)
      setInput("")
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden">
      {/* Messages container - only visible after first submission */}
      <div
        className={`flex-1 overflow-y-auto p-4 space-y-6 transition-opacity duration-500 ${
          hasSubmitted ? "opacity-100" : "opacity-0"
        }`}
      >
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="flex items-center space-x-2 animate-pulse">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <div className="w-2 h-2 bg-primary rounded-full"></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Centered welcome screen - only visible before first submission */}
      {!hasSubmitted && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-6 max-w-md px-4">
            <h2 className="text-2xl font-semibold text-primary">Welcome to your RAG Chat</h2>
            <p className="text-muted-foreground">Ask a question to get started with your knowledge base.</p>
          </div>
        </div>
      )}

      {/* Input area - positioned differently based on submission state */}
      <div
        className={`transition-all duration-500 ease-in-out ${
          hasSubmitted ? "border-t p-4" : "absolute left-1/2 -translate-x-1/2 bottom-24 w-full max-w-2xl px-4"
        }`}
      >
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className={`min-h-[60px] max-h-[200px] resize-none ${!hasSubmitted ? "shadow-lg" : ""}`}
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading}
            className="h-[60px] w-[60px] shrink-0"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  )
}

