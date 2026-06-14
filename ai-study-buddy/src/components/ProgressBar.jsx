export default function ProgressBar({ value = 0, max = 100, label, showPercent = true, size = 'md', color = 'default', className = '' }) {
  const percent = Math.min(Math.round((value / max) * 100), 100)

  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' }

  const colors = {
    default: 'bg-gradient-to-r from-ink-600 to-sage-500',
    blue: 'bg-gradient-to-r from-ink-500 to-ink-400',
    green: 'bg-gradient-to-r from-sage-600 to-sage-400',
    red: 'bg-gradient-to-r from-coral-600 to-coral-400',
    amber: 'bg-gradient-to-r from-amber-500 to-amber-400',
  }

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm text-ink-300 font-body">{label}</span>}
          {showPercent && <span className="text-sm font-display font-semibold text-ink-300">{percent}%</span>}
        </div>
      )}
      <div className={`progress-track w-full ${heights[size]}`}>
        <div
          className={`progress-fill ${heights[size]} ${colors[color]}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
