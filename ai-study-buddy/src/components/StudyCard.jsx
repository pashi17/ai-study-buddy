import { Clock, CheckCircle2, Circle, ChevronRight } from 'lucide-react'

const priorityColors = {
  high: 'tag-red',
  medium: 'tag-amber',
  low: 'tag-blue',
}

export default function StudyCard({ task, onToggle }) {
  return (
    <div className={`glass-card p-4 flex items-center gap-4 group transition-all duration-200 hover:border-ink-500/30 ${task.done ? 'opacity-60' : ''}`}>
      <button
        onClick={() => onToggle && onToggle(task.id)}
        className="flex-shrink-0 transition-transform hover:scale-110"
      >
        {task.done
          ? <CheckCircle2 size={22} className="text-sage-500" />
          : <Circle size={22} className="text-ink-400 hover:text-ink-300" />
        }
      </button>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-body font-medium truncate ${task.done ? 'line-through text-ink-400' : 'text-white'}`}>
          {task.title}
        </p>
        <div className="flex items-center gap-3 mt-1.5">
          <span className={`tag ${priorityColors[task.priority]}`}>{task.priority}</span>
          <span className="flex items-center gap-1 text-xs text-ink-400">
            <Clock size={10} /> {task.duration}
          </span>
          {task.subject && <span className="text-xs text-ink-400">{task.subject}</span>}
        </div>
      </div>
      <ChevronRight size={16} className="text-ink-500 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  )
}
