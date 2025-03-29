"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle, MessageSquare, X, ChevronLeft } from "lucide-react"
import type { Chat } from "@/types"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"

interface SidebarProps {
  chats: Chat[]
  currentChatId: string
  onNewChat: () => void
  onSelectChat: (chatId: string) => void
}

export default function Sidebar({ chats, currentChatId, onNewChat, onSelectChat }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const isMobile = useMobile()

  // Close sidebar on mobile by default
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false)
      setIsCollapsed(false)
    } else {
      setIsOpen(true)
    }
  }, [isMobile])

  const toggleSidebar = () => {
    if (isMobile) {
      setIsOpen(!isOpen)
    } else {
      setIsCollapsed(!isCollapsed)
    }
  }

  // Format date to show only the date part
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  // Group chats by date
  const groupedChats = chats.reduce(
    (groups, chat) => {
      const date = formatDate(chat.createdAt)
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(chat)
      return groups
    },
    {} as Record<string, Chat[]>,
  )

  return (
    <>
      {/* Mobile toggle button */}
      {isMobile && (
        <Button variant="outline" size="icon" className="fixed top-4 left-4 z-50 rounded-full" onClick={toggleSidebar}>
          {isOpen ? <X className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
        </Button>
      )}

      {/* Desktop collapse button */}
      {!isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute top-4 z-50 rounded-full bg-muted/80 shadow-sm",
            isCollapsed ? "left-4" : "left-[268px]",
          )}
          onClick={toggleSidebar}
        >
          <ChevronLeft className={cn("h-4 w-4", isCollapsed && "rotate-180")} />
        </Button>
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "bg-muted/40 border-r flex flex-col h-full transition-all duration-300 ease-in-out",
          isMobile && "fixed inset-y-0 left-0 z-40",
          isMobile && !isOpen && "-translate-x-full",
          !isMobile && isCollapsed ? "w-16 pt-14" : "w-80", // Added pt-14 for top padding when collapsed
        )}
      >
        <div className={cn("p-4", isCollapsed && "p-2")}>
          <Button
            variant="outline"
            className={cn("w-full justify-start gap-2", isCollapsed && "px-0 justify-center")}
            onClick={onNewChat}
          >
            <PlusCircle className="h-5 w-5" />
            {!isCollapsed && "New Chat"}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {Object.entries(groupedChats).map(([date, dateChats]) => (
            <div key={date} className="mb-4">
              {!isCollapsed && <div className="text-xs text-muted-foreground px-2 py-1">{date}</div>}
              <div className="space-y-1">
                {dateChats.map((chat) => (
                  <Button
                    key={chat.id}
                    variant={currentChatId === chat.id ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start text-left truncate h-auto py-2",
                      isCollapsed && "px-0 justify-center",
                    )}
                    onClick={() => {
                      onSelectChat(chat.id)
                      if (isMobile) setIsOpen(false)
                    }}
                    title={isCollapsed ? chat.title : undefined}
                  >
                    <MessageSquare className={cn("h-4 w-4 shrink-0", !isCollapsed && "mr-2")} />
                    {!isCollapsed && <span className="truncate">{chat.title}</span>}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Collapsed sidebar toggle button */}
        {/* {!isMobile && isCollapsed && (
          <Button variant="ghost" size="icon" className="mx-auto my-4" onClick={toggleSidebar}>
            <ChevronLeft className="h-4 w-4 rotate-180" />
          </Button>
        )} */}
      </div>

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30" onClick={() => setIsOpen(false)} />
      )}
    </>
  )
}

