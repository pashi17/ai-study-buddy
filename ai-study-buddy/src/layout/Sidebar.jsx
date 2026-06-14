import { NavLink, useNavigate } from 'react-router-dom'
import { Brain, Home, LayoutDashboard, Upload, BookOpen, HelpCircle, MessageCircle, AlertTriangle, Map, LogOut, ChevronLeft } from 'lucide-react'
import { useState, useEffect } from 'react'
import { ProfilePanel } from '../components/SidePanels'


const navItems = [
  { to: '/', icon: Home, label: 'Home', exact: true },
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/dashboard/syllabus', icon: Upload, label: 'Syllabus Upload' },
  { to: '/dashboard/study-plan', icon: BookOpen, label: 'Study Plan' },
  { to: '/dashboard/quiz', icon: HelpCircle, label: 'Quiz Mode' },
  { to: '/dashboard/chat', icon: MessageCircle, label: 'AI Tutor Chat' },
  { to: '/dashboard/weak-topics', icon: AlertTriangle, label: 'Weak Topics' },
  { to: '/dashboard/roadmap', icon: Map, label: 'Revision Roadmap' },
]

export default function Sidebar({ collapsed, onCollapse }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user') || '{}'))
  const [profileOpen, setProfileOpen] = useState(false)

  useEffect(() => {
    const handleUpdate = () => {
      const stored = sessionStorage.getItem('user');
      setUser(stored ? JSON.parse(stored) : {});
    };
    window.addEventListener('profileUpdated', handleUpdate);
    return () => window.removeEventListener('profileUpdated', handleUpdate);
  }, []);

  return (
    <>
    <aside className={`flex flex-col h-full glass border-r border-ink-600/20 transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'}`}>
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-ink-600/20">
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-ink-500 to-ink-700 flex items-center justify-center shadow-glow-sm">
              <Brain size={15} className="text-white" />
            </div>
            <span className="font-display font-bold text-white text-sm">
              Study<span className="text-ink-400">Buddy</span>
            </span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 mx-auto rounded-xl bg-gradient-to-br from-ink-500 to-ink-700 flex items-center justify-center">
            <Brain size={15} className="text-white" />
          </div>
        )}
        {!collapsed && (
          <button
            onClick={onCollapse}
            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-ink-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={14} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`
            }
            title={collapsed ? label : undefined}
          >
            <Icon size={17} className="flex-shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className={`p-3 border-t border-ink-600/20`}>
        {!collapsed ? (
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ink-500 to-purple-600 flex items-center justify-center text-white text-xs font-display font-bold flex-shrink-0" onClick={() => setProfileOpen(true)}>
              {user?.avatar || user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0" onClick={() => setProfileOpen(true)}>
              <p className="text-xs font-display font-semibold text-white truncate">{user?.name || 'User'}</p>
              <p className="text-[10px] text-ink-400 truncate">{user?.level || 'Beginner'}</p>
            </div>
            <button
              onClick={() => {
                sessionStorage.removeItem('token')
                sessionStorage.removeItem('user')
                navigate('/')
              }}
              className="text-ink-500 hover:text-coral-400 transition-colors"
              title="Logout"
            >
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate('/')}
            className="sidebar-link justify-center px-2 w-full text-coral-400"
            title="Logout"
          >
            <LogOut size={17} />
          </button>
        )}
      </div>
    </aside>
    <ProfilePanel open={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  )
}
