import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, Bell, Search, ChevronDown, LogOut, Settings, User, BookOpen } from 'lucide-react'
import Button from '../components/Button'
import {
  SearchPanel,
  NotificationsPanel,
  ProfilePanel,
  SettingsPanel
} from '../components/SidePanels'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [hasUnread, setHasUnread] = useState(true)
  const [user, setUser] = useState(null)
  const [panel, setPanel] = useState(null)

  const searchRef = useRef(null)
  const notifRef = useRef(null)
  const profileRef = useRef(null)
  const navigate = useNavigate()

  // Load real user from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false)
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const open = (name) => setPanel(name)
  const close = () => setPanel(null)

  // Real logout function
  const handleLogout = () => {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    sessionStorage.removeItem('syllabusId')
    sessionStorage.removeItem('syllabusSubject')
    setUser(null)
    setProfileOpen(false)
    setMenuOpen(false)
    navigate('/login')
  }

  const userInitials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  const firstName = user?.name?.split(' ')[0] || 'User'

  const links = [
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How it Works' },
    { href: '#benefits', label: 'Benefits' },
    { href: '#testimonials', label: 'Reviews' },
  ]

  const notifications = [
    { id: 1, icon: '📚', title: 'New quiz available', desc: 'Chapter 5 quiz is ready', time: '2m ago', unread: true },
    { id: 2, icon: '🎯', title: 'Study streak!', desc: "You're on a 7-day streak", time: '1h ago', unread: true },
    { id: 3, icon: '✅', title: 'Assignment graded', desc: 'Physics test: 92%', time: '3h ago', unread: false },
  ]

  return (
    <>
      <style>{`
        .glass-nav { background: rgba(10,10,20,0.85); backdrop-filter: blur(20px); }
        .dropdown-glass {
          background: rgba(15,15,28,0.97); backdrop-filter: blur(24px);
          border: 1px solid rgba(139,92,246,0.15); border-radius: 16px;
          box-shadow: 0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04);
        }
        .notif-dot {
          width:8px; height:8px; background:#a78bfa; border-radius:50%;
          position:absolute; top:6px; right:6px; box-shadow:0 0 8px #a78bfa;
          animation: pulse-dot 2s infinite;
        }
        @keyframes pulse-dot {
          0%,100% { transform:scale(1); opacity:1; }
          50% { transform:scale(1.3); opacity:0.7; }
        }
        .icon-btn {
          display:flex; align-items:center; justify-content:center;
          width:36px; height:36px; border-radius:10px;
          color:rgba(196,181,253,0.7); transition:all 0.2s; cursor:pointer; position:relative;
        }
        .icon-btn:hover { background:rgba(139,92,246,0.15); color:#c4b5fd; }
        .avatar-ring { background:linear-gradient(135deg,#7c3aed,#a78bfa); padding:2px; border-radius:50%; }
        .avatar-inner {
          width:30px; height:30px; border-radius:50%;
          background:rgba(15,10,30,1); display:flex; align-items:center;
          justify-content:center; font-size:13px; font-weight:700; color:#c4b5fd;
        }
        .profile-btn {
          display:flex; align-items:center; gap:8px;
          padding:4px 8px 4px 4px; border-radius:12px; cursor:pointer; transition:background 0.2s;
        }
        .profile-btn:hover { background:rgba(139,92,246,0.12); }
        .unread-badge { background:#7c3aed; color:white; font-size:9px; font-weight:700; border-radius:6px; padding:1px 5px; }
        .menu-item {
          display:flex; align-items:center; gap:10px; padding:8px 12px;
          border-radius:10px; cursor:pointer; color:rgba(196,181,253,0.8); font-size:13px; transition:all 0.15s;
        }
        .menu-item:hover { background:rgba(139,92,246,0.12); color:#e9d5ff; }
        .search-input {
          background:rgba(139,92,246,0.08); border:1px solid rgba(139,92,246,0.2);
          border-radius:10px; padding:7px 14px 7px 36px; color:white; font-size:13px; outline:none; transition:border-color 0.2s;
        }
        .search-input:focus { border-color:rgba(139,92,246,0.5); background:rgba(139,92,246,0.12); }
        .search-input::placeholder { color:rgba(196,181,253,0.4); }
      `}</style>

      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-nav border-b py-3' : 'py-5'}`}
        style={{ borderColor: scrolled ? 'rgba(139,92,246,0.15)' : 'transparent' }}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <img
              src="src/assest/WhatsApp_Image_2026-03-09_at_12.55.11_PM-removebg-preview.png"
              style={{ height: '50px', width: '60px' }}
              className="rounded-xl"
            />
            <span className="font-bold text-white text-2xl hidden sm:block">
              Study<span style={{ color: '#a78bfa' }}>Buddy</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {links.map(l => (
              <a key={l.href} href={l.href}
                className="px-4 py-2 text-sm transition-colors rounded-lg"
                style={{ color: 'rgba(196,181,253,0.7)' }}
                onMouseEnter={e => { e.target.style.color = 'white'; e.target.style.background = 'rgba(139,92,246,0.1)' }}
                onMouseLeave={e => { e.target.style.color = 'rgba(196,181,253,0.7)'; e.target.style.background = 'transparent' }}>
                {l.label}
              </a>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-2">

            {/* Search */}
            <div ref={searchRef} className="flex items-center">
              {searchOpen ? (
                <div className="relative flex items-center">
                  <Search size={14} style={{ position: 'absolute', left: 12, color: 'rgba(196,181,253,0.5)', pointerEvents: 'none' }} />
                  <input
                    autoFocus type="text" placeholder="Search topics..."
                    value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Escape' && setSearchOpen(false)}
                    className="search-input" style={{ width: 200 }}
                  />
                </div>
              ) : (
                <button className="icon-btn" onClick={() => { setSearchOpen(true); open('search') }}>
                  <Search size={16} />
                </button>
              )}
            </div>

            {/* Notifications */}
            <div ref={notifRef} className="relative">
              <button className="icon-btn" onClick={() => { setNotifOpen(!notifOpen); setHasUnread(false) }}>
                <Bell size={16} />
                {hasUnread && <span className="notif-dot" />}
              </button>
              {notifOpen && (
                <div className="dropdown-glass absolute right-0 mt-3 w-80 p-2" style={{ top: '100%' }}>
                  <div className="flex items-center justify-between px-3 py-2 mb-1">
                    <span className="text-white font-semibold text-sm">Notifications</span>
                    <span className="text-xs cursor-pointer" style={{ color: '#a78bfa' }}>Mark all read</span>
                  </div>
                  {notifications.map(n => (
                    <div key={n.id} className="menu-item rounded-xl gap-3 py-3"
                      style={{ background: n.unread ? 'rgba(139,92,246,0.07)' : 'transparent' }}>
                      <span className="text-xl flex-shrink-0">{n.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-white text-xs font-medium truncate">{n.title}</span>
                          {n.unread && <span className="unread-badge flex-shrink-0">NEW</span>}
                        </div>
                        <p className="text-xs mt-0.5 truncate" style={{ color: 'rgba(196,181,253,0.5)' }}>{n.desc}</p>
                      </div>
                      <span className="text-xs flex-shrink-0" style={{ color: 'rgba(196,181,253,0.35)' }}>{n.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ width: 1, height: 20, background: 'rgba(139,92,246,0.2)', margin: '0 4px' }} />

            {/* ── User Logged In ── */}
            {user ? (
              <div ref={profileRef} className="relative">
                <div className="profile-btn" onClick={() => setProfileOpen(!profileOpen)}>
                  <div className="avatar-ring">
                    <div className="avatar-inner">{userInitials}</div>
                  </div>
                  <span className="text-sm font-medium" style={{ color: 'rgba(233,213,255,0.9)' }}>
                    {firstName}
                  </span>
                  <ChevronDown size={13} style={{
                    color: 'rgba(196,181,253,0.5)',
                    transform: profileOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                  }} />
                </div>

                {profileOpen && (
                  <div className="dropdown-glass absolute right-0 mt-3 w-52 p-2" style={{ top: '100%' }}>
                    {/* ✅ Real user info */}
                    <div className="px-3 py-2 mb-2" style={{ borderBottom: '1px solid rgba(139,92,246,0.1)' }}>
                      <p className="text-white text-sm font-semibold">{user.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'rgba(196,181,253,0.45)' }}>{user.email}</p>
                    </div>

                    <Link to="/dashboard" onClick={() => setProfileOpen(false)}>
                      <div className="menu-item"><BookOpen size={14} style={{ color: '#a78bfa' }} /> Dashboard</div>
                    </Link>
                    <Link to="/dashboard/profile" onClick={() => setProfileOpen(false)}>
                      <div className="menu-item"><User size={14} style={{ color: '#a78bfa' }} /> My Profile</div>
                    </Link>
                    <div className="menu-item" onClick={() => { open('settings'); setProfileOpen(false) }}>
                      <Settings size={14} style={{ color: '#a78bfa' }} /> Settings
                    </div>

                    <div style={{ borderTop: '1px solid rgba(139,92,246,0.1)', marginTop: 8, paddingTop: 8 }}>
                      
                      {/* ✅ Real Sign Out */}
                      <div
                        className="menu-item"
                        style={{ color: 'rgba(248,113,113,0.8)' }}
                        onClick={handleLogout}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,0.08)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <LogOut size={14} /> Sign Out
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // ── Not Logged In ──
              <>
                <Link to="/login"><Button variant="ghost" size="sm">Sign In</Button></Link>
                <Link to="/signup"><Button variant="primary" size="sm">Get Started</Button></Link>
              </>
            )}
          </div>

          {/* Settings icon */}
          <button className="icon-btn hidden md:flex" onClick={() => open('settings')}>
            <Settings size={16} />
          </button>

          {/* Mobile Toggle */}
          <button className="md:hidden icon-btn" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden px-6 py-4 space-y-1"
            style={{ background: 'rgba(10,10,20,0.97)', borderTop: '1px solid rgba(139,92,246,0.15)' }}>
            {links.map(l => (
              <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                className="block py-2.5 px-3 rounded-lg text-sm"
                style={{ color: 'rgba(196,181,253,0.7)' }}>
                {l.label}
              </a>
            ))}
            <div className="pt-3 mt-3 space-y-2" style={{ borderTop: '1px solid rgba(139,92,246,0.15)' }}>
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2 rounded-xl" style={{ background: 'rgba(139,92,246,0.08)' }}>
                    <div className="avatar-ring"><div className="avatar-inner">{userInitials}</div></div>
                    <div>
                      <p className="text-white text-sm font-semibold">{user.name}</p>
                      <p className="text-xs" style={{ color: 'rgba(196,181,253,0.45)' }}>{user.email}</p>
                    </div>
                  </div>
                  <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-center">Dashboard</Button>
                  </Link>
                  <button onClick={handleLogout} className="w-full">
                    <Button variant="danger" size="sm" className="w-full justify-center">Sign Out</Button>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-center">Login</Button>
                  </Link>
                  <Link to="/signup" onClick={() => setMenuOpen(false)}>
                    <Button variant="primary" size="sm" className="w-full justify-center">Get Started Free</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}

        {/* Side Panels */}
        <SearchPanel open={panel === 'search'} onClose={close} />
        <NotificationsPanel open={panel === 'notifs'} onClose={close} />
        <ProfilePanel open={panel === 'profile'} onClose={close} />
        <SettingsPanel open={panel === 'settings'} onClose={close} />
      </nav>
    </>
  )
}