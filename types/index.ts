export interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  createdAt: string
}

export interface Chat {
  id: string
  title: string
  createdAt: string
}

