import type { Message } from "@/types"
import { cn } from "@/lib/utils"
import { User, Bot } from "lucide-react"

interface MessageItemProps {
  message: Message
}

export default function MessageItem({ message }: MessageItemProps) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex items-start gap-4 max-w-3xl", isUser ? "ml-auto" : "mr-auto")}>
      <div
        className={cn(
          "flex items-center justify-center w-8 h-8 rounded-full shrink-0",
          isUser ? "bg-primary text-primary-foreground order-2" : "bg-muted",
        )}
      >
        {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
      </div>
      <div
        className={cn(
          "rounded-lg px-4 py-3 text-sm",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
        )}
      >
        {/* You can add markdown rendering here if your backend returns markdown */}
        <div className="whitespace-pre-wrap">{message.content}</div>
      </div>
    </div>
  )
}

