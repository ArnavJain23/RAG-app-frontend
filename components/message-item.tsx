import type { Message } from "@/types"
import { cn } from "@/lib/utils"
import { User, Bot, Clock, AlertCircle } from "lucide-react"

export interface MessageItemProps {
  message: Message
}

export default function MessageItem({ message }: MessageItemProps) {
  const isUser = message.role === "user"
  const isError = Boolean(message.error)
  const processingTime = message.metadata?.processingTime;
  const hasProcessingTime = processingTime !== undefined

  return (
    <div className={cn("flex items-start gap-4 max-w-3xl", isUser ? "ml-auto" : "mr-auto")}>
      <div
        className={cn(
          "flex items-center justify-center w-8 h-8 rounded-full shrink-0",
          isUser 
            ? "bg-primary text-primary-foreground order-2" 
            : isError 
              ? "bg-destructive text-destructive-foreground" 
              : "bg-muted"
        )}
      >
        {isUser 
          ? <User className="h-5 w-5" /> 
          : isError 
            ? <AlertCircle className="h-5 w-5" /> 
            : <Bot className="h-5 w-5" />}
      </div>
      <div
        className={cn(
          "rounded-lg px-4 py-3 text-sm",
          isUser 
            ? "bg-primary text-primary-foreground" 
            : isError 
              ? "bg-destructive/10 text-destructive border border-destructive/20" 
              : "bg-muted text-foreground"
        )}
      >
        {/* Message content */}
        <div className="whitespace-pre-wrap">{message.content}</div>
        
        {/* Show processing time if available */}
        {!isUser && hasProcessingTime && (
          <div className="mt-2 flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            <span>Processed in {processingTime.toFixed(2)}s</span>
          </div>
        )}
      </div>
    </div>
  )
}

