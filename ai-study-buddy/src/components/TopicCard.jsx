import { TrendingUp, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import ProgressBar from './ProgressBar'
import Button from './Button'

const difficultyColor = (score) => {
  if (score < 40) return { bar: 'red', label: 'Critical', tag: 'tag-red' }
  if (score < 60) return { bar: 'amber', label: 'Needs Work', tag: 'tag-amber' }
  return { bar: 'green', label: 'Improving', tag: 'tag-green' }
}

export default function TopicCard({ topic }) {
  const [expanded, setExpanded] = useState(false)
  const diff = difficultyColor(topic.score)

  return (
    <div className="glass-card p-5 transition-all duration-300 hover:border-ink-500/30">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs text-ink-400 font-body mb-1">{topic.subject}</p>
          <h3 className="text-base font-display font-bold text-white">{topic.topic}</h3>
        </div>
        <span className={`tag ${diff.tag}`}>{diff.label}</span>
      </div>

      <ProgressBar value={topic.score} label="Mastery" size="sm" color={diff.bar} className="mb-4" />

      <div className="flex items-center justify-between text-xs text-ink-400 mb-4">
        <span>{topic.attempts} attempts</span>
        <span>Last: {topic.lastAttempt}</span>
      </div>

      <div className="flex gap-2">
        <Button variant="secondary" size="sm" icon={RefreshCw} className="flex-1 justify-center text-xs">
          Revise Now
        </Button>
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-ink-400 hover:text-white transition-colors border border-white/10"
        >
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-ink-600/20 animate-slide-up">
          <p className="text-xs font-display font-semibold text-ink-300 mb-2 uppercase tracking-wider">Recommended</p>
          <ul className="space-y-1.5">
            {topic.recommended.map((r, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-ink-300">
                <span className="w-1.5 h-1.5 rounded-full bg-ink-500 flex-shrink-0" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
