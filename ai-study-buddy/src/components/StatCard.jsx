import { BookOpen, Target, Clock, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react'

const icons = { BookOpen, Target, Clock, AlertTriangle }

export default function StatCard({ label, value, change, positive, icon: iconName, className = '' }) {
  const Icon = icons[iconName] || BookOpen

  return (
    <div className={`glass-card p-5 hover:border-ink-500/40 transition-all duration-300 group ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-ink-600/20 flex items-center justify-center group-hover:bg-ink-600/30 transition-colors">
          <Icon size={18} className="text-ink-400" />
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${positive ? 'bg-sage-600/15 text-sage-400' : 'bg-coral-600/15 text-coral-400'}`}>
            {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {change}
          </div>
        )}
      </div>
      <div className="text-3xl font-display font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-ink-300 font-body">{label}</div>
    </div>
  )
}
