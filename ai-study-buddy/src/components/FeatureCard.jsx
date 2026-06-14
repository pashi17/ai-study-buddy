import { Upload, Calendar, Brain, MessageCircle, AlertTriangle, Map } from 'lucide-react'

const icons = { Upload, Calendar, Brain, MessageCircle, AlertTriangle, Map }

const colorMap = {
  blue: { bg: 'bg-ink-600/20', text: 'text-ink-400', border: 'hover:border-ink-500/40', glow: 'group-hover:shadow-[0_0_20px_rgba(92,111,255,0.2)]' },
  purple: { bg: 'bg-purple-600/20', text: 'text-purple-400', border: 'hover:border-purple-500/40', glow: 'group-hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]' },
  teal: { bg: 'bg-teal-600/20', text: 'text-teal-400', border: 'hover:border-teal-500/40', glow: '' },
  amber: { bg: 'bg-amber-600/20', text: 'text-amber-400', border: 'hover:border-amber-500/40', glow: '' },
  coral: { bg: 'bg-red-600/20', text: 'text-red-400', border: 'hover:border-red-500/40', glow: '' },
  green: { bg: 'bg-green-600/20', text: 'text-green-400', border: 'hover:border-green-500/40', glow: '' },
}

export default function FeatureCard({ icon: iconName, title, desc, color = 'blue' }) {
  const Icon = icons[iconName] || Brain
  const c = colorMap[color]

  return (
    <div className={`glass-card p-6 group cursor-default transition-all duration-300 hover:-translate-y-1 ${c.border} ${c.glow}`}>
      <div className={`w-12 h-12 rounded-2xl ${c.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={22} className={c.text} />
      </div>
      <h3 className="text-lg font-display font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-ink-300 font-body leading-relaxed">{desc}</p>
    </div>
  )
}
