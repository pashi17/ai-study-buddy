  import { useState, useEffect, useRef } from "react";

// ── Icons (inline SVG to avoid lucide dependency in demo) ──────────────────
const Icon = ({ d, size = 16, strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const IC = {
  search: "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",
  bell: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  x: "M18 6 6 18M6 6l12 12",
  brain: "M9.5 2a2.5 2.5 0 0 1 5 0M9.5 2C6 2 4 5 4 8c0 1.5.5 3 1.5 4M9.5 2c-1 1.5-1.5 3.5-1.5 6M14.5 2C18 2 20 5 20 8c0 1.5-.5 3-1.5 4M14.5 2c1 1.5 1.5 3.5 1.5 6M8 12c0 2 .5 4 2 5.5M16 12c0 2-.5 4-2 5.5M10 17.5C10 20 11 22 12 22s2-2 2-4.5",
  chevron: "M9 18l6-6-6-6",
  book: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  moon: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
  globe: "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
  lock: "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  trending: "M23 6l-9.5 9.5-5-5L1 18",
  clock: "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM12 6v6l4 2",
  check: "M20 6 9 17l-5-5",
  edit: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  camera: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
};

// ── Shared Drawer Shell ────────────────────────────────────────────────────
function Drawer({ open, onClose, children, width = 400 }) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
        opacity: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none",
        transition: "opacity 0.3s ease",
      }} />
      {/* Panel */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 101,
        width: Math.min(width, window.innerWidth),
        background: "linear-gradient(160deg, #0d0d1f 0%, #0a0a18 100%)",
        borderLeft: "1px solid rgba(139,92,246,0.18)",
        boxShadow: "-20px 0 60px rgba(0,0,0,0.6), -1px 0 0 rgba(139,92,246,0.1)",
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        {/* Top purple glow */}
        <div style={{
          position: "absolute", top: -60, right: -60, width: 200, height: 200,
          background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        {children}
      </div>
    </>
  );
}

// ── Drawer Header ──────────────────────────────────────────────────────────
function DrawerHeader({ title, subtitle, onClose, icon }) {
  return (
    <div style={{ padding: "24px 24px 20px", borderBottom: "1px solid rgba(139,92,246,0.12)", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {icon && (
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(167,139,250,0.15))",
              border: "1px solid rgba(139,92,246,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#a78bfa",
            }}>
              {icon}
            </div>
          )}
          <div>
            <h2 style={{ margin: 0, color: "white", fontSize: 16, fontWeight: 700, letterSpacing: "-0.3px" }}>{title}</h2>
            {subtitle && <p style={{ margin: "2px 0 0", color: "rgba(196,181,253,0.5)", fontSize: 12 }}>{subtitle}</p>}
          </div>
        </div>
        <button onClick={onClose} style={{
          width: 32, height: 32, borderRadius: 8, border: "none", cursor: "pointer",
          background: "rgba(139,92,246,0.1)", color: "rgba(196,181,253,0.7)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.2s",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(139,92,246,0.2)"; e.currentTarget.style.color = "white"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(139,92,246,0.1)"; e.currentTarget.style.color = "rgba(196,181,253,0.7)"; }}>
          <Icon d={IC.x} size={15} />
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// 1. SEARCH PANEL
// ══════════════════════════════════════════════════════════════════
const searchResults = [
  { category: "Courses", emoji: "📐", title: "Trigonometry Fundamentals", desc: "Chapter 4 · 12 lessons", tag: "Math" },
  { category: "Courses", emoji: "⚛️", title: "Quantum Physics Basics", desc: "Chapter 2 · 8 lessons", tag: "Physics" },
  { category: "Notes", emoji: "📝", title: "Cell Division Notes", desc: "Biology · Updated 2 days ago", tag: "Bio" },
  { category: "Quizzes", emoji: "🎯", title: "Algebra Practice Quiz", desc: "20 questions · Avg 78%", tag: "Math" },
  { category: "Notes", emoji: "🧪", title: "Chemical Reactions Summary", desc: "Chemistry · 3 pages", tag: "Chem" },
];

const trendingTopics = ["Photosynthesis", "Newton's Laws", "World War II", "Quadratic Equations", "DNA Structure"];

export function SearchPanel({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 350); }, [open]);

  const filtered = query.length > 1
    ? searchResults.filter(r => r.title.toLowerCase().includes(query.toLowerCase()) || r.tag.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <Drawer open={open} onClose={onClose}>
      <DrawerHeader title="Search" subtitle="Find courses, notes & quizzes" onClose={onClose} icon={<Icon d={IC.search} size={16} />} />
      <div style={{ padding: "20px 24px", flexShrink: 0 }}>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: focused ? "#a78bfa" : "rgba(196,181,253,0.4)", transition: "color 0.2s" }}>
            <Icon d={IC.search} size={15} />
          </div>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search anything..."
            style={{
              width: "100%", boxSizing: "border-box",
              padding: "12px 14px 12px 42px",
              background: focused ? "rgba(139,92,246,0.1)" : "rgba(139,92,246,0.06)",
              border: `1px solid ${focused ? "rgba(139,92,246,0.4)" : "rgba(139,92,246,0.15)"}`,
              borderRadius: 12, color: "white", fontSize: 14, outline: "none",
              transition: "all 0.2s",
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 24px 24px" }}>
        {query.length < 2 ? (
          <>
            <p style={{ color: "rgba(196,181,253,0.45)", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Trending Topics</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
              {trendingTopics.map(t => (
                <button key={t} onClick={() => setQuery(t)} style={{
                  padding: "6px 14px", borderRadius: 20,
                  background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)",
                  color: "rgba(196,181,253,0.8)", fontSize: 12, cursor: "pointer", transition: "all 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(139,92,246,0.2)"; e.currentTarget.style.color = "white"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(139,92,246,0.1)"; e.currentTarget.style.color = "rgba(196,181,253,0.8)"; }}>
                  <span style={{ marginRight: 4 }}>🔥</span>{t}
                </button>
              ))}
            </div>
            <p style={{ color: "rgba(196,181,253,0.45)", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Recent Searches</p>
            {["Photosynthesis process", "Pythagorean theorem", "World War 2 causes"].map(r => (
              <div key={r} onClick={() => setQuery(r)} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10,
                cursor: "pointer", marginBottom: 4, transition: "background 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(139,92,246,0.08)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <span style={{ color: "rgba(196,181,253,0.35)" }}><Icon d={IC.clock} size={14} /></span>
                <span style={{ color: "rgba(196,181,253,0.7)", fontSize: 13 }}>{r}</span>
              </div>
            ))}
          </>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
            <p style={{ color: "rgba(196,181,253,0.5)", fontSize: 14 }}>No results for "<strong style={{ color: "white" }}>{query}</strong>"</p>
          </div>
        ) : (
          <>
            <p style={{ color: "rgba(196,181,253,0.45)", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
              {filtered.length} Result{filtered.length > 1 ? "s" : ""}
            </p>
            {filtered.map((r, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", borderRadius: 12,
                background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.1)",
                marginBottom: 8, cursor: "pointer", transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(139,92,246,0.12)"; e.currentTarget.style.borderColor = "rgba(139,92,246,0.25)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(139,92,246,0.06)"; e.currentTarget.style.borderColor = "rgba(139,92,246,0.1)"; }}>
                <span style={{ fontSize: 24, flexShrink: 0 }}>{r.emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: "white", fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{r.title}</div>
                  <div style={{ color: "rgba(196,181,253,0.5)", fontSize: 11 }}>{r.desc}</div>
                </div>
                <span style={{
                  padding: "3px 10px", borderRadius: 20, fontSize: 10, fontWeight: 700,
                  background: "rgba(124,58,237,0.2)", color: "#a78bfa", flexShrink: 0,
                }}>{r.tag}</span>
              </div>
            ))}
          </>
        )}
      </div>
    </Drawer>
  );
}

// ══════════════════════════════════════════════════════════════════
// 2. NOTIFICATIONS PANEL
// ══════════════════════════════════════════════════════════════════
const notifData = [
  { id: 1, emoji: "📚", title: "New Quiz Available", desc: "Chapter 5: Trigonometry quiz is now ready to attempt", time: "2 min ago", unread: true, type: "quiz" },
  { id: 2, emoji: "🎯", title: "7-Day Study Streak!", desc: "Amazing! You've been consistent for a whole week", time: "1 hr ago", unread: true, type: "achievement" },
  { id: 3, emoji: "✅", title: "Physics Test Graded", desc: "Your test has been evaluated. Score: 92/100", time: "3 hr ago", unread: true, type: "grade" },
  { id: 4, emoji: "👥", title: "Study Group Invite", desc: "Alex invited you to join 'Chemistry Masters' group", time: "Yesterday", unread: false, type: "social" },
  { id: 5, emoji: "📅", title: "Assignment Due Soon", desc: "Math homework is due in 2 hours!", time: "Yesterday", unread: false, type: "reminder" },
  { id: 6, emoji: "🏆", title: "New Badge Earned", desc: "You earned the 'Fast Learner' badge!", time: "2 days ago", unread: false, type: "achievement" },
];

export function NotificationsPanel({ open, onClose }) {
  const [notifs, setNotifs] = useState(notifData);
  const [filter, setFilter] = useState("all");
  const unreadCount = notifs.filter(n => n.unread).length;

  const filtered = filter === "unread" ? notifs.filter(n => n.unread) : notifs;

  return (
    <Drawer open={open} onClose={onClose}>
      <DrawerHeader title="Notifications" subtitle={`${unreadCount} unread`} onClose={onClose} icon={<Icon d={IC.bell} size={16} />} />

      {/* Filter tabs + Mark all */}
      <div style={{ padding: "16px 24px 0", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 4, background: "rgba(139,92,246,0.08)", borderRadius: 10, padding: 4 }}>
            {["all", "unread"].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: "5px 16px", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
                background: filter === f ? "rgba(124,58,237,0.5)" : "transparent",
                color: filter === f ? "white" : "rgba(196,181,253,0.55)",
                transition: "all 0.2s", textTransform: "capitalize",
              }}>{f}</button>
            ))}
          </div>
          {unreadCount > 0 && (
            <button onClick={() => setNotifs(n => n.map(x => ({ ...x, unread: false })))} style={{
              background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#a78bfa", fontWeight: 600,
            }}>Mark all read</button>
          )}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 24px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
            <p style={{ color: "rgba(196,181,253,0.5)", fontSize: 14 }}>All caught up!</p>
          </div>
        ) : filtered.map(n => (
          <div key={n.id} onClick={() => setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, unread: false } : x))}
            style={{
              display: "flex", gap: 14, padding: "14px 12px", borderRadius: 14, marginBottom: 6,
              background: n.unread ? "rgba(139,92,246,0.09)" : "transparent",
              border: `1px solid ${n.unread ? "rgba(139,92,246,0.18)" : "transparent"}`,
              cursor: "pointer", transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(139,92,246,0.12)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = n.unread ? "rgba(139,92,246,0.09)" : "transparent"; }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <span style={{ fontSize: 26 }}>{n.emoji}</span>
              {n.unread && <span style={{
                position: "absolute", top: -2, right: -2, width: 8, height: 8,
                background: "#a78bfa", borderRadius: "50%",
                boxShadow: "0 0 6px #a78bfa",
              }} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                <span style={{ color: n.unread ? "white" : "rgba(255,255,255,0.75)", fontSize: 13, fontWeight: n.unread ? 700 : 500 }}>{n.title}</span>
                <span style={{ color: "rgba(196,181,253,0.35)", fontSize: 10, flexShrink: 0, marginTop: 2 }}>{n.time}</span>
              </div>
              <p style={{ margin: "4px 0 0", color: "rgba(196,181,253,0.5)", fontSize: 12, lineHeight: 1.4 }}>{n.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </Drawer>
  );
}

// ══════════════════════════════════════════════════════════════════
// 3. USER PROFILE PANEL
// ══════════════════════════════════════════════════════════════════
const stats = [
  { label: "Courses", value: "12", emoji: "📚" },
  { label: "Streak", value: "7d", emoji: "🔥" },
  { label: "Quizzes", value: "48", emoji: "🎯" },
  { label: "Badges", value: "9", emoji: "🏆" },
];

const recentActivity = [
  { emoji: "📐", title: "Completed Geometry Chapter", time: "2h ago", score: "+120 XP" },
  { emoji: "🎯", title: "Scored 95% on Physics Quiz", time: "Yesterday", score: "+80 XP" },
  { emoji: "📝", title: "Added Biology Notes", time: "2 days ago", score: "+20 XP" },
];

export function ProfilePanel({ open, onClose }) {
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("User");
  const [bio, setBio] = useState("Passionate learner | Science & Math enthusiast 🚀");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('user');
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
      setName(u.name || "User");
    }
  }, [open]);

  useEffect(() => {
    const handleUpdate = () => {
      const stored = sessionStorage.getItem('user');
      if (stored) {
        const u = JSON.parse(stored);
        setUser(u);
        setName(u.name || "User");
      }
    };
    window.addEventListener('profileUpdated', handleUpdate);
    return () => window.removeEventListener('profileUpdated', handleUpdate);
  }, []);

  const handleToggleEdit = async () => {
    if (editMode) {
      // Save changes
      try {
        const axios = (await import('../api/axios')).default;
        const { data } = await axios.put('/user/profile', { name });
        if (data && data.data && data.data.user) {
          const updatedUser = { ...user, name: data.data.user.name };
          sessionStorage.setItem('user', JSON.stringify(updatedUser));
          setUser(updatedUser);
          window.dispatchEvent(new Event('profileUpdated'));
        }
      } catch (err) {
        console.error("Failed to update profile", err);
      }
    }
    setEditMode(!editMode);
  };

  return (
    <Drawer open={open} onClose={onClose} width={420}>
      <DrawerHeader title="My Profile" subtitle="Manage your account" onClose={onClose} icon={<Icon d={IC.user} size={16} />} />
      <div style={{ flex: 1, overflowY: "auto" }}>

        {/* Avatar + Info */}
        <div style={{ padding: "28px 24px 0", textAlign: "center", position: "relative" }}>
          {/* Background pattern */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 80,
            background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(167,139,250,0.08))",
          }} />
          <div style={{ position: "relative", display: "inline-block", marginBottom: 12 }}>
            <div style={{
              width: 80, height: 80, borderRadius: "50%", margin: "0 auto",
              background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 30, fontWeight: 800, color: "white",
              boxShadow: "0 0 0 3px rgba(139,92,246,0.3), 0 0 30px rgba(139,92,246,0.2)",
            }}>{user?.name ? user.name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase() : 'U'}</div>
            <button style={{
              position: "absolute", bottom: 0, right: -4, width: 26, height: 26,
              borderRadius: "50%", border: "2px solid rgba(13,13,31,1)",
              background: "rgba(124,58,237,0.8)", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", color: "white",
            }}>
              <Icon d={IC.camera} size={12} />
            </button>
          </div>

          {editMode ? (
            <div style={{ marginBottom: 16 }}>
              <input value={name} onChange={e => setName(e.target.value)} style={{
                background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.3)",
                borderRadius: 8, padding: "6px 12px", color: "white", fontSize: 18, fontWeight: 700,
                outline: "none", width: "100%", boxSizing: "border-box", textAlign: "center", marginBottom: 8,
              }} />
              <input value={bio} onChange={e => setBio(e.target.value)} style={{
                background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.3)",
                borderRadius: 8, padding: "6px 12px", color: "rgba(196,181,253,0.7)", fontSize: 12,
                outline: "none", width: "100%", boxSizing: "border-box", textAlign: "center",
              }} />
            </div>
          ) : (
            <>
              <h3 style={{ margin: "0 0 6px", color: "white", fontSize: 20, fontWeight: 700 }}>{name}</h3>
              <p style={{ margin: "0 0 6px", color: "rgba(196,181,253,0.55)", fontSize: 12 }}>{bio}</p>
              <p style={{ margin: "0 0 20px", color: "rgba(196,181,253,0.35)", fontSize: 11 }}>{user?.email || "user@email.com"}</p>
            </>
          )}

          <button onClick={handleToggleEdit} style={{
            padding: "8px 20px", borderRadius: 10, border: "1px solid rgba(139,92,246,0.3)",
            background: editMode ? "rgba(124,58,237,0.5)" : "rgba(139,92,246,0.1)",
            color: editMode ? "white" : "#a78bfa", cursor: "pointer", fontSize: 12, fontWeight: 600,
            display: "flex", alignItems: "center", gap: 6, margin: "0 auto 24px",
            transition: "all 0.2s",
          }}>
            <Icon d={editMode ? IC.check : IC.edit} size={13} />
            {editMode ? "Save Changes" : "Edit Profile"}
          </button>
        </div>

        {/* Stats */}
        <div style={{ padding: "0 24px", marginBottom: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
            {stats.map(s => (
              <div key={s.label} style={{
                background: "rgba(139,92,246,0.07)", border: "1px solid rgba(139,92,246,0.12)",
                borderRadius: 12, padding: "14px 8px", textAlign: "center",
              }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>{s.emoji}</div>
                <div style={{ color: "white", fontSize: 16, fontWeight: 700 }}>{s.value}</div>
                <div style={{ color: "rgba(196,181,253,0.45)", fontSize: 10 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* XP Progress */}
        <div style={{ padding: "0 24px", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ color: "white", fontSize: 13, fontWeight: 600 }}>Level 8 — Scholar</span>
            <span style={{ color: "#a78bfa", fontSize: 12 }}>2,340 / 3,000 XP</span>
          </div>
          <div style={{ height: 6, background: "rgba(139,92,246,0.15)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: "78%", background: "linear-gradient(90deg, #7c3aed, #a78bfa)", borderRadius: 99 }} />
          </div>
          <p style={{ color: "rgba(196,181,253,0.4)", fontSize: 11, marginTop: 6 }}>660 XP until Level 9</p>
        </div>

        {/* Recent Activity */}
        <div style={{ padding: "0 24px 32px" }}>
          <p style={{ color: "rgba(196,181,253,0.45)", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Recent Activity</p>
          {recentActivity.map((a, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 0",
              borderBottom: i < recentActivity.length - 1 ? "1px solid rgba(139,92,246,0.08)" : "none",
            }}>
              <span style={{ fontSize: 22 }}>{a.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: 500 }}>{a.title}</div>
                <div style={{ color: "rgba(196,181,253,0.4)", fontSize: 11, marginTop: 2 }}>{a.time}</div>
              </div>
              <span style={{ color: "#86efac", fontSize: 11, fontWeight: 700 }}>{a.score}</span>
            </div>
          ))}
        </div>
      </div>
    </Drawer>
  );
}

// ══════════════════════════════════════════════════════════════════
// 4. SETTINGS PANEL
// ══════════════════════════════════════════════════════════════════
function Toggle({ checked, onChange }) {
  return (
    <div onClick={() => onChange(!checked)} style={{
      width: 44, height: 24, borderRadius: 99, cursor: "pointer",
      background: checked ? "rgba(124,58,237,0.7)" : "rgba(139,92,246,0.15)",
      border: `1px solid ${checked ? "rgba(139,92,246,0.5)" : "rgba(139,92,246,0.2)"}`,
      position: "relative", transition: "all 0.25s", flexShrink: 0,
    }}>
      <div style={{
        position: "absolute", top: 3, left: checked ? 23 : 3,
        width: 16, height: 16, borderRadius: "50%",
        background: checked ? "white" : "rgba(196,181,253,0.4)",
        transition: "all 0.25s",
        boxShadow: checked ? "0 0 8px rgba(139,92,246,0.5)" : "none",
      }} />
    </div>
  );
}

function SettingRow({ icon, label, desc, children }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "14px 0", borderBottom: "1px solid rgba(139,92,246,0.08)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center", color: "#a78bfa", flexShrink: 0,
        }}>{icon}</div>
        <div>
          <div style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: 500 }}>{label}</div>
          {desc && <div style={{ color: "rgba(196,181,253,0.4)", fontSize: 11, marginTop: 1 }}>{desc}</div>}
        </div>
      </div>
      <div style={{ marginLeft: 12 }}>{children}</div>
    </div>
  );
}

function SettingsSection({ title, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <p style={{ color: "rgba(196,181,253,0.45)", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>{title}</p>
      {children}
    </div>
  );
}

export function SettingsPanel({ open, onClose }) {
  const [settings, setSettings] = useState({
    darkMode: true, notifications: true, emailDigest: false,
    studyReminders: true, sound: true, publicProfile: false,
    twoFactor: false,
  });
  const set = (k, v) => setSettings(s => ({ ...s, [k]: v }));

  const languages = ["English", "हिंदी", "मराठी", "Español"];
  const [lang, setLang] = useState("English");

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <Drawer open={open} onClose={onClose} width={420}>
      <DrawerHeader title="Settings" subtitle="Customize your experience" onClose={onClose} icon={<Icon d={IC.settings} size={16} />} />
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 24px 32px" }}>

        <SettingsSection title="Appearance">
          <SettingRow icon={<Icon d={IC.moon} size={15} />} label="Dark Mode" desc="Easy on the eyes">
            <Toggle checked={settings.darkMode} onChange={v => set("darkMode", v)} />
          </SettingRow>
          <SettingRow icon={<Icon d={IC.globe} size={15} />} label="Language" desc="App display language">
            <select value={lang} onChange={e => setLang(e.target.value)} style={{
              background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)",
              borderRadius: 8, padding: "5px 10px", color: "white", fontSize: 12, outline: "none", cursor: "pointer",
            }}>
              {languages.map(l => <option key={l} value={l} style={{ background: "#0d0d1f" }}>{l}</option>)}
            </select>
          </SettingRow>
        </SettingsSection>

        <SettingsSection title="Notifications">
          <SettingRow icon={<Icon d={IC.bell} size={15} />} label="Push Notifications" desc="Quizzes, grades & reminders">
            <Toggle checked={settings.notifications} onChange={v => set("notifications", v)} />
          </SettingRow>
          <SettingRow icon={<Icon d={IC.trending} size={15} />} label="Weekly Email Digest" desc="Summary of your progress">
            <Toggle checked={settings.emailDigest} onChange={v => set("emailDigest", v)} />
          </SettingRow>
          <SettingRow icon={<Icon d={IC.clock} size={15} />} label="Study Reminders" desc="Daily study time alerts">
            <Toggle checked={settings.studyReminders} onChange={v => set("studyReminders", v)} />
          </SettingRow>
        </SettingsSection>

        <SettingsSection title="Privacy & Security">
          <SettingRow icon={<Icon d={IC.globe} size={15} />} label="Public Profile" desc="Others can view your profile">
            <Toggle checked={settings.publicProfile} onChange={v => set("publicProfile", v)} />
          </SettingRow>
          <SettingRow icon={<Icon d={IC.shield} size={15} />} label="Two-Factor Auth" desc="Extra account security">
            <Toggle checked={settings.twoFactor} onChange={v => set("twoFactor", v)} />
          </SettingRow>
          <SettingRow icon={<Icon d={IC.lock} size={15} />} label="Change Password">
            <button style={{
              padding: "5px 14px", borderRadius: 8, border: "1px solid rgba(139,92,246,0.25)",
              background: "rgba(139,92,246,0.1)", color: "#a78bfa", fontSize: 12, cursor: "pointer",
              transition: "all 0.2s",
            }}>Update</button>
          </SettingRow>
        </SettingsSection>

        {/* Danger Zone */}
        <div style={{
          background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)",
          borderRadius: 12, padding: "16px 16px",
        }}>
          <p style={{ color: "rgba(252,165,165,0.7)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Danger Zone</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button onClick={handleLogout} style={{
              flex: 1, padding: "9px 16px", borderRadius: 9,
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
              color: "rgba(252,165,165,0.8)", fontSize: 12, cursor: "pointer", fontWeight: 600,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}>
              <Icon d={IC.logout} size={13} /> Sign Out
            </button>
            <button style={{
              flex: 1, padding: "9px 16px", borderRadius: 9,
              background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)",
              color: "rgba(252,165,165,0.5)", fontSize: 12, cursor: "pointer", fontWeight: 600,
            }}>Delete Account</button>
          </div>
        </div>
      </div>
    </Drawer>
  );
}

// ══════════════════════════════════════════════════════════════════