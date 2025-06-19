import { useChatMessages } from "@/hooks/useChatMessages"
import { MessageBubble } from "./MessageBubble"
import { MessageInput } from "./MessageInput"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRef, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"

export function ChatWindow({ onClose, partnerId }: { onClose: () => void; partnerId?: string }) {
  const { user } = useAuth()
  const effectivePartnerId = user?.role === "AdminDesigner" ? partnerId : undefined

  const { messages, sendMessage, loading } = useChatMessages(effectivePartnerId)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="fixed bottom-20 right-6 w-96 max-h-[80vh] bg-white rounded-xl shadow-lg flex flex-col border border-border z-50">
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <div className="font-semibold text-sm">
          {user?.role === "AdminDesigner" ? "Чат с клиентом" : "Чат с дизайнером"}
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-black text-lg">×</button>
      </div>

      <ScrollArea className="flex-1 overflow-y-auto p-3 space-y-2">
        {loading ? (
          <div className="text-center text-sm text-muted-foreground">Загрузка...</div>
        ) : (
          messages.map((msg, i) => <MessageBubble key={i} message={msg} />)
        )}
        <div ref={bottomRef} />
      </ScrollArea>

      <MessageInput onSend={sendMessage} />
    </div>
  )
}
