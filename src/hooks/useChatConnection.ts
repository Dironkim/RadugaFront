import { useEffect } from "react"
import { HubConnection, HubConnectionState } from "@microsoft/signalr"
import { getConnection } from "@/lib/utils"

type UseChatConnectionOptions = {
  onReceiveMessage: (msg: any) => void
  onMessageSent?: (msg: any) => void
}

export function useChatConnection({ onReceiveMessage, onMessageSent }: UseChatConnectionOptions) {
  useEffect(() => {
    const connection = getConnection()

    const startConnection = async () => {
      if (connection.state === HubConnectionState.Disconnected) {
        try {
          await connection.start()
        } catch (err) {
          console.error("SignalR start error:", err)
        }
      }
    }

    startConnection()

    connection.on("ReceiveMessage", onReceiveMessage)

    if (onMessageSent) {
      connection.on("MessageSent", onMessageSent)
    }

    return () => {
      connection.off("ReceiveMessage", onReceiveMessage)
      if (onMessageSent) {
        connection.off("MessageSent", onMessageSent)
      }
    }
  }, [onReceiveMessage, onMessageSent])
}
