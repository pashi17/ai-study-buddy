import { Bell, Search, ChevronRight, Menu, Flame } from 'lucide-react'
import { useLocation } from 'react-router-dom'

const routeLabels = {
  '/dashboard': 'Dashboard',
  '/dashboard/syllabus': 'Syllabus Upload',
  '/dashboard/study-plan': 'Study Plan',
  '/dashboard/quiz': 'Quiz Mode',
  '/dashboard/chat': 'AI Tutor Chat',
  '/dashboard/weak-topics': 'Weak Topics',
  '/dashboard/roadmap': 'Revision Roadmap',
}

export default function TopNavbar({ onMenuToggle }) {
  const location = useLocation()
  const user = JSON.parse(sessionStorage.getItem('user') || '{}')
  const pageTitle = routeLabels[location.pathname] || 'Dashboard'

  return (
    <header className="glass border-b border-ink-600/20 h-16 flex items-center px-6 gap-4 flex-shrink-0">
      {/* Mobile menu */}
      <button onClick={onMenuToggle} className="lg:hidden text-ink-400 hover:text-white transition-colors">
        <Menu size={20} />
      </button>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm font-body">
        <span className="text-ink-500">Dashboard</span>
        {pageTitle !== 'Dashboard' && (
          <>
            <ChevronRight size={14} className="text-ink-600" />
            <span className="text-white font-medium">{pageTitle}</span>
          </>
        )}
      </div>

      <div className="flex-1" />

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 glass-light rounded-xl px-3 py-2 w-56 border border-ink-600/20 hover:border-ink-500/40 transition-colors">
        <Search size={14} className="text-ink-500" />
        <input placeholder="Search topics..." className="bg-transparent text-sm text-ink-300 placeholder-ink-600 outline-none w-full font-body" />
        <kbd className="text-[10px] text-ink-600 border border-ink-600/30 px-1.5 py-0.5 rounded">⌘K</kbd>
      </div>

      {/* Streak */}


      {/* Bell */}
      <button className="relative w-9 h-9 rounded-xl bg-white/5 border border-ink-600/20 flex items-center justify-center text-ink-400 hover:text-white hover:bg-white/10 transition-colors">
        <Bell size={16} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-ink-500" />
      </button>

      {/* Avatar */}

    </header>
  )
}
