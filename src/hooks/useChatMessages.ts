import { useEffect, useState } from "react"
import { getConnection } from "@/lib/utils"
import { createUserImage } from "@/api/imageApi"
import { fetchChatMessages } from "@/api/chatApi"
import { type Message } from "@/types/models"
import { useAuth } from "@/context/AuthContext"

export function useChatMessages(partnerId?: string) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const isAdmin = user?.role === "AdminDesigner"

  useEffect(() => {
    const connection = getConnection()
    if (connection.state === "Disconnected") {
      connection.start().catch(console.error)
    }
    console.log(isAdmin)
    connection.on("ReceiveMessage", handleReceive)
    connection.on("MessageSent", handleReceive)
  
    const fetch = isAdmin
      ? () => partnerId ? fetchChatMessages(partnerId) : Promise.resolve([])
      : () => fetchChatMessages("") 
  
    fetch()
      .then(setMessages)
      .catch(console.error)
      .finally(() => setLoading(false))
  
    return () => {
      connection.off("ReceiveMessage", handleReceive)
      connection.off("MessageSent", handleReceive)
      if (connection.state === "Connected") {
        connection.stop().catch(console.error) // <-- важно
      }
    }
  }, [partnerId, user?.id])
  

  const handleReceive = (msg: Message) => {
    if (!partnerId || msg.senderId === partnerId || msg.receiverId === partnerId) {
      setMessages(prev => [...prev, msg])
    }
  }

  const sendMessage = async (text: string, file?: File) => {
    const connection = getConnection()

    let imageIds: number[] = []
    if (file) {
      const form = new FormData()
      form.append("file", file)
      const image = await createUserImage(form)
      imageIds = [image.id]
    }

    // если админ — указывает partnerId, иначе null
    await connection.invoke("SendMessage", isAdmin ? partnerId : null, imageIds, text)
  }

  return { messages, sendMessage, loading }
}
