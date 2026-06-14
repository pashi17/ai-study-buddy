export default function Loader({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-ink-600/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-ink-500 animate-spin" />
        <div className="absolute inset-2 rounded-full bg-ink-500/10" />
      </div>
      <p className="text-sm text-ink-300 font-body animate-pulse">{text}</p>
    </div>
  )
}
