import { useParams } from "react-router-dom"
import { useChatMessages } from "@/hooks/useChatMessages"
import { MessageBubble } from "@/my-components/Chat/MessageBubble"
import { MessageInput } from "@/my-components/Chat/MessageInput"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRef, useEffect, useState } from "react"
import { fetchUser } from "@/api/userApi"
import { type User } from "@/types/models"

export default function ChatPage() {
  const { userId } = useParams<{ userId: string }>()
  const { messages, sendMessage, loading } = useChatMessages(userId)
  const [user, setUser] = useState<User | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (userId) {
        fetchUser(userId)
        .then(setUser)
        .catch(() => setUser(null))
    }
  }, [userId])

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <div className="px-4 py-3 border-b font-semibold text-lg">
        {user ? `Чат с ${user.fullName}` : "Чат"}
      </div>

      <div className="flex-1 overflow-y-auto">
        <ScrollArea className="h-full px-4 py-3 space-y-3">
          {loading ? (
            <div className="text-center text-muted-foreground">Загрузка...</div>
          ) : (
            messages.map((msg, i) => <MessageBubble key={i} message={msg} />)
          )}
          <div ref={bottomRef} />
        </ScrollArea>
      </div>

      <div className="p-4 border-t shrink-0">
        <MessageInput onSend={sendMessage} />
      </div>
    </div>
  )
}
