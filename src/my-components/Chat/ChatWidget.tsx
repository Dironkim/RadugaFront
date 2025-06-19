import { useState } from "react"
import { ChatWindow } from "./ChatWindow"
import { MessageCircle } from "lucide-react"

export function ChatWidget() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {open && <ChatWindow onClose={() => setOpen(false)} />}
      <button
        className="fixed bottom-17 right-4 p-4 rounded-full shadow-xl bg-primary text-white hover:scale-105 transition"
        onClick={() => setOpen(true)}
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    </>
  )
}
