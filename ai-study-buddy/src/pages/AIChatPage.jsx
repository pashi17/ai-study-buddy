import { useState, useRef, useEffect } from 'react'
import { Bot, Sparkles, Send, Plus } from 'lucide-react'
import api from '../api/axios'

const suggestions = [
  'Explain Binary Search Trees',
  'What is Dynamic Programming?',
  'Difference between TCP and UDP',
  'Explain database normalization',
  'What causes a deadlock?',
]

export default function AIChatPage() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const [topic, setTopic] = useState('')
  const [error, setError] = useState('')
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  // Auto scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async (text) => {
    const trimmed = text?.trim() || input.trim()
    if (!trimmed || loading) return

    setInput('')
    setError('')

    // Add user message to UI immediately
    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: trimmed,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const { data } = await api.post('/chat/ask', {
        question: trimmed,
        sessionId: sessionId || null,
        topic: topic || undefined,
      })

      const aiMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.data.answer,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages(prev => [...prev, aiMsg])
      setSessionId(data.data.sessionId)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get response. Try again.')
      // Remove the user message if AI failed
      setMessages(prev => prev.filter(m => m.id !== userMsg.id))
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const startNewChat = () => {
    setMessages([])
    setSessionId(null)
    setError('')
    inputRef.current?.focus()
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-3xl mx-auto">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="glass-card p-4 mb-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ink-500 to-purple-600 flex items-center justify-center shadow-glow-sm">
          <Bot size={18} className="text-white" />
        </div>
        <div>
          <h2 className="text-base font-display font-bold text-white">AI Tutor</h2>
          <p className="text-xs text-ink-400 font-body flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sage-500 inline-block" />
            Online · Powered by GPT-4o
          </p>
        </div>

        {/* Topic filter (optional) */}
        <input
          type="text"
          value={topic}
          onChange={e => setTopic(e.target.value)}
          placeholder="Topic context (optional)"
          className="ml-auto text-xs input-field max-w-[180px] py-2"
        />

        <button
          onClick={startNewChat}
          className="flex items-center gap-1.5 text-xs text-ink-400 hover:text-white btn-secondary py-2 px-3 flex-shrink-0"
        >
          <Plus size={13} /> New Chat
        </button>

        <div className="flex items-center gap-1.5 tag tag-blue flex-shrink-0">
          <Sparkles size={11} /> AI Powered
        </div>
      </div>

      {/* ── Messages ───────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto space-y-5 py-2 px-1">

        {/* Empty state */}
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full gap-4 pb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-ink-500 to-purple-600 flex items-center justify-center shadow-glow">
              <Bot size={28} className="text-white" />
            </div>
            <div className="text-center">
              <p className="text-white font-display font-bold text-lg mb-1">Ask me anything!</p>
              <p className="text-ink-400 font-body text-sm">I'm your AI study buddy. Ask doubts, get explanations.</p>
            </div>
          </div>
        )}

        {/* Message list */}
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-ink-600/30 border border-ink-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot size={14} className="text-ink-400" />
              </div>
            )}

            {/* Bubble */}
            <div className={`max-w-[78%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
              <div className={msg.role === 'user' ? 'chat-bubble-user px-4 py-3' : 'chat-bubble-ai px-4 py-3'}>
                <p className="text-sm font-body text-white leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </p>
              </div>
              <span className="text-[10px] text-ink-500 font-body px-1">{msg.time}</span>
            </div>
          </div>
        ))}

        {/* AI typing indicator */}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-ink-600/30 border border-ink-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Bot size={14} className="text-ink-400" />
            </div>
            <div className="chat-bubble-ai px-4 py-3">
              <div className="flex items-center gap-1.5">
                {[0, 0.2, 0.4].map((delay, i) => (
                  <span
                    key={i}
                    className="w-2 h-2 rounded-full bg-ink-500 animate-bounce"
                    style={{ animationDelay: `${delay}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Suggestions ────────────────────────────────────────────────────── */}
      {messages.length === 0 && (
        <div className="py-3">
          <p className="text-xs text-ink-500 font-body mb-2">Try asking about:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => sendMessage(s)}
                className="text-xs font-body text-ink-300 bg-white/5 hover:bg-white/10 border border-ink-600/20 hover:border-ink-500/30 px-3 py-1.5 rounded-full transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Error ──────────────────────────────────────────────────────────── */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2 text-sm text-red-400 font-body mb-2">
          {error}
        </div>
      )}

      {/* ── Input ──────────────────────────────────────────────────────────── */}
      <div className="pt-4 border-t border-ink-600/20">
        <div className="flex gap-3 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask any doubt... (Enter to send, Shift+Enter for newline)"
            rows={1}
            disabled={loading}
            className="input-field flex-1 resize-none min-h-[46px] max-h-32 py-3"
            style={{ height: 'auto' }}
            onInput={e => {
              e.target.style.height = 'auto'
              e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px'
            }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="btn-primary p-3 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-center text-[10px] text-ink-600 font-body mt-2">
          AI responses are for learning purposes. Always verify with official sources.
        </p>
      </div>
    </div>
  )
}