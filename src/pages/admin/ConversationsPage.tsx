import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { fetchConversations } from "@/api/chatApi"
import { type Message } from "@/types/models"

export function ConversationsPage() {
  const [conversations, setConversations] = useState<Message[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchConversations().then(setConversations).catch(console.error)
  }, [])

  return (
    <div className="space-y-2 p-4">
      <h2 className="text-xl font-semibold mb-4">Диалоги</h2>
      {conversations.map(msg => {
        const partnerId = msg.senderId === "system" ? msg.receiverId : msg.senderId
        return (
          <div
            key={msg.id}
            onClick={() => navigate(`/admin/chat/${partnerId}`)}
            className="border p-3 rounded hover:bg-muted cursor-pointer"
          >
            <div className="font-medium">{msg.senderName || partnerId}</div>
            <div className="text-sm text-muted-foreground truncate">{msg.text}</div>
            <div className="text-xs text-right">{new Date(msg.sentAt).toLocaleString()}</div>
          </div>
        )
      })}
    </div>
  )
}
