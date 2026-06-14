import { Bot, User } from 'lucide-react'

export function ChatMessage({ message }) {
  const isAI = message.role === 'ai'
  return (
    <div className={`flex gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}>
      {isAI && (
        <div className="w-8 h-8 rounded-full bg-ink-600/30 border border-ink-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Bot size={14} className="text-ink-400" />
        </div>
      )}
      <div className={`max-w-[75%] ${isAI ? 'chat-bubble-ai' : 'chat-bubble-user'} px-4 py-3`}>
        <p className="text-sm font-body leading-relaxed text-white whitespace-pre-wrap">{message.text}</p>
        <p className={`text-[10px] mt-1.5 ${isAI ? 'text-ink-500' : 'text-blue-200/60'}`}>{message.time}</p>
      </div>
      {!isAI && (
        <div className="w-8 h-8 rounded-full bg-ink-500/30 border border-ink-400/30 flex items-center justify-center flex-shrink-0 mt-0.5">
          <User size={14} className="text-ink-300" />
        </div>
      )}
    </div>
  )
}
