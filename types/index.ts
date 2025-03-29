export interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  createdAt: string
  metadata?: {
    sources?: any[]
    processingTime?: number
  }
  error?: boolean
}

export interface Chat {
  id: string
  title: string
  createdAt: string
}

