import { useState } from 'react'
import { Send, Paperclip, Mic } from 'lucide-react'

export default function ChatInput({ onSend, disabled = false, placeholder = 'Ask anything about your syllabus...' }) {
  const [value, setValue] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (value.trim() && !disabled) {
      onSend(value.trim())
      setValue('')
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3">
      <div className="flex-1 relative">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKey}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="input-field resize-none py-3.5 pr-12 min-h-[52px] max-h-32"
          style={{ height: 'auto' }}
          onInput={(e) => {
            e.target.style.height = 'auto'
            e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px'
          }}
        />
      </div>
      <button
        type="submit"
        disabled={!value.trim() || disabled}
        className="w-12 h-12 rounded-xl bg-gradient-to-br from-ink-500 to-ink-700 flex items-center justify-center text-white transition-all duration-200 hover:shadow-glow disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 flex-shrink-0"
      >
        <Send size={16} />
      </button>
    </form>
  )
}
