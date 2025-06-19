import { useState } from "react"

export function MessageInput({ onSend }: { onSend: (text: string, file?: File) => void }) {
    const [text, setText] = useState("")
    const [file, setFile] = useState<File | null>(null)
  
    const handleSend = async () => {
      if (!text && !file) return
      await onSend(text, file ?? undefined)
      setText("")
      setFile(null)
    }
  
    return (
<div className="p-2 border-t">
  <div className="flex gap-2">
    <input
      type="text"
      className="flex-1 border px-3 py-1 rounded"
      placeholder="Сообщение..."
      value={text}
      onChange={(e) => setText(e.target.value)}
    />
    <button onClick={handleSend} className="bg-primary text-white px-4 rounded">
      Отправить
    </button>
  </div>

  <div className="mt-2">
    <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
  </div>
</div>

      
    )
  }
  