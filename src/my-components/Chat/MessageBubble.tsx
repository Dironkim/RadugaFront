export function MessageBubble({ message }: { message: any }) {
    const isMine = message.senderId === localStorage.getItem("userId")
    return (
      <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
        <div className={`rounded-lg px-3 py-2 max-w-[80%] ${isMine ? "bg-blue-100" : "bg-gray-200"}`}>
          {message.text && <div>{message.text}</div>}
          {message.imageUrls?.map((url: string) => (
            <img key={url} src={import.meta.env.VITE_SERVER_URL +url} className="mt-2 rounded max-w-full" />
          ))}
          <div className="text-xs text-gray-500 mt-1">{new Date(message.sentAt).toLocaleTimeString()}</div>
        </div>
      </div>
    )
  }
  