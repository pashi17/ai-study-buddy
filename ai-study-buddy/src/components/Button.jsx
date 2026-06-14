export default function Button({ children, variant = 'primary', size = 'md', className = '', onClick, type = 'button', disabled = false, icon: Icon }) {
  const base = 'inline-flex items-center justify-center gap-2 font-display font-semibold transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'bg-transparent text-ink-300 hover:text-white hover:bg-white/5 rounded-xl border border-transparent hover:border-white/10',
    danger: 'bg-coral-600/20 text-coral-400 border border-coral-600/30 hover:bg-coral-600/30 rounded-xl',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-sm rounded-xl',
    lg: 'px-8 py-4 text-base rounded-xl',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  )
}
