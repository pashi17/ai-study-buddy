import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Flame, Trophy, CheckCircle2, Circle, BookOpen, AlertCircle } from 'lucide-react'
import api from '../api/axios'
const user = JSON.parse(sessionStorage.getItem('user') || '{}')

export default function DashboardPage() {
  const [tasks, setTasks] = useState([])
  const [todayMeta, setTodayMeta] = useState(null)
  const [overallProgress, setOverallProgress] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [user, setUser] = useState(null)

  // Load user from sessionStorage
  useEffect(() => {
    const loadUser = () => {
      const stored = sessionStorage.getItem('user');
      if (stored) setUser(JSON.parse(stored));
    };
    loadUser();

    window.addEventListener('profileUpdated', loadUser);
    return () => window.removeEventListener('profileUpdated', loadUser);
  }, [])

  // Fetch today's tasks from backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true)
        const { data } = await api.get('/tasks/today')
        setTasks(data.data.tasks || [])
        setOverallProgress(data.data.overallProgress || 0)
        setTodayMeta(data.data)
      } catch (err) {
        // No study plan yet — show empty state
        if (err.response?.status === 404) {
          setError('no-plan')
        } else {
          setError(err.response?.data?.message || 'Failed to load tasks')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchTasks()
  }, [])

  // Mark task as complete
  const toggleTask = async (taskId, isCompleted) => {
    if (isCompleted) return // already done, don't un-complete

    try {
      // Optimistic UI update
      setTasks(prev =>
        prev.map(t => t._id === taskId ? { ...t, isCompleted: true } : t)
      )

      const { data } = await api.put(`/tasks/${taskId}/complete`)
      setOverallProgress(data.data.overallProgress)
    } catch (err) {
      // Revert on error
      setTasks(prev =>
        prev.map(t => t._id === taskId ? { ...t, isCompleted: false } : t)
      )
      console.error('Failed to complete task:', err.message)
    }
  }

  const completedCount = tasks.filter(t => t.isCompleted).length
  const totalCount = tasks.length
  const dayProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning 👋'
    if (h < 17) return 'Good afternoon 👋'
    return 'Good evening 👋'
  }

  return (
    <div className="space-y-8">

      {/* ── Welcome Header ───────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-ink-400 font-body mb-1">{greeting()}</p>
          <h1 className="text-3xl font-display font-bold text-white">
            Hello, {user?.name.split(' ')[0] || 'Student'}
          </h1>
          <p className="text-ink-300 font-body text-sm mt-1">
            {user?.streak > 0
              ? <>You're on a <span className="text-amber-400 font-semibold">{user.streak}-day streak</span> · Keep it going!</>
              : 'Start your study session today!'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass-card px-4 py-3 flex items-center gap-2.5">
            <Flame size={18} className="text-amber-400" />
            <div>
              <p className="text-xs text-ink-400 font-body">Streak</p>
              <p className="text-lg font-display font-bold text-white">{user?.streak || 0}</p>
            </div>
          </div>
          <div className="glass-card px-4 py-3 flex items-center gap-2.5">
            <Trophy size={18} className="text-ink-400" />
            <div>
              <p className="text-xs text-ink-400 font-body">Overall</p>
              <p className="text-lg font-display font-bold text-white">{overallProgress}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Grid ────────────────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-5 gap-6">

        {/* Today's Tasks — Left (3 cols) */}
        <div className="lg:col-span-3 glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-display font-bold text-white">Today's Plan</h2>
              <p className="text-sm text-ink-400 font-body mt-0.5">
                {loading ? 'Loading...' : `${completedCount} of ${totalCount} tasks completed`}
              </p>
            </div>
            <Link to="/dashboard/study-plan">
              <button className="text-xs text-ink-400 hover:text-ink-300 flex items-center gap-1 font-body transition-colors">
                Full plan <ArrowRight size={12} />
              </button>
            </Link>
          </div>

          {/* Progress Bar */}
          <div className="mb-5">
            <div className="flex justify-between text-xs text-ink-400 font-body mb-2">
              <span>Day Progress</span>
              <span>{dayProgress}%</span>
            </div>
            <div className="progress-track h-2">
              <div
                className="progress-fill h-2"
                style={{ width: `${dayProgress}%` }}
              />
            </div>
          </div>

          {/* ── Loading State ── */}
          {loading && (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-14 rounded-xl bg-white/5 shimmer" />
              ))}
            </div>
          )}

          {/* ── No Plan State ── */}
          {!loading && error === 'no-plan' && (
            <div className="text-center py-8">
              <BookOpen size={36} className="text-ink-500 mx-auto mb-3" />
              <p className="text-white font-display font-semibold mb-1">No Study Plan Yet</p>
              <p className="text-ink-400 font-body text-sm mb-4">
                Upload your syllabus to generate a personalized study plan
              </p>
              <Link to="/dashboard/syllabus">
                <button className="btn-primary flex items-center gap-2 mx-auto">
                  Upload Syllabus <ArrowRight size={15} />
                </button>
              </Link>
            </div>
          )}

          {/* ── Error State ── */}
          {!loading && error && error !== 'no-plan' && (
            <div className="flex items-center gap-3 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <AlertCircle size={16} className="flex-shrink-0" />
              <p className="text-sm font-body">{error}</p>
            </div>
          )}

          {/* ── Tasks List ── */}
          {!loading && !error && tasks.length === 0 && (
            <div className="text-center py-8">
              <CheckCircle2 size={36} className="text-sage-400 mx-auto mb-3" />
              <p className="text-white font-display font-semibold">No tasks for today!</p>
              <p className="text-ink-400 font-body text-sm mt-1">It might be a rest day. Check your full plan.</p>
            </div>
          )}

          {!loading && !error && tasks.length > 0 && (
            <div className="space-y-2.5">
              {tasks.map(task => (
                <div
                  key={task._id}
                  onClick={() => toggleTask(task._id, task.isCompleted)}
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 cursor-pointer
                    ${task.isCompleted
                      ? 'bg-sage-500/10 border-sage-500/20 opacity-70'
                      : 'bg-white/5 border-ink-600/20 hover:border-ink-500/40 hover:bg-white/8'
                    }`}
                >
                  {task.isCompleted
                    ? <CheckCircle2 size={18} className="text-sage-400 flex-shrink-0" />
                    : <Circle size={18} className="text-ink-500 flex-shrink-0" />
                  }
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-display font-semibold truncate ${task.isCompleted ? 'line-through text-ink-400' : 'text-white'}`}>
                      {task.topicName}
                    </p>
                    <p className="text-xs text-ink-500 font-body mt-0.5">
                      {task.subject} · ~{task.estimatedHours}h
                      {task.subtopics?.length > 0 && ` · ${task.subtopics.slice(0, 2).join(', ')}`}
                    </p>
                  </div>
                  {task.isCompleted && (
                    <span className="tag tag-green text-xs flex-shrink-0">Done</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Right Column (2 cols) ─────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Overall Progress */}
          <div className="glass-card p-5">
            <h3 className="text-base font-display font-bold text-white mb-4">Overall Progress</h3>
            <div className="flex items-center justify-center">
              <div className="relative w-28 h-28">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(92,111,255,0.15)" strokeWidth="10" />
                  <circle
                    cx="50" cy="50" r="40" fill="none"
                    stroke="url(#grad)" strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${overallProgress * 2.51} 251`}
                  />
                  <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#5c6fff" />
                      <stop offset="100%" stopColor="#34d399" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-display font-bold text-white">{overallProgress}%</span>
                  <span className="text-xs text-ink-400 font-body">Complete</span>
                </div>
              </div>
            </div>
            {todayMeta && (
              <div className="mt-4 text-center">
                <p className="text-xs text-ink-400 font-body">
                  Day {todayMeta.dayNumber} of your study plan
                </p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="glass-card p-5">
            <h3 className="text-base font-display font-bold text-white mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { to: '/dashboard/quiz', label: 'Take Quiz', icon: '🎯' },
                { to: '/dashboard/chat', label: 'Ask AI', icon: '🤖' },
                { to: '/dashboard/weak-topics', label: 'Weak Areas', icon: '⚠️' },
                { to: '/dashboard/roadmap', label: 'Roadmap', icon: '🗺️' },
              ].map(({ to, label, icon }) => (
                <Link key={to} to={to}>
                  <div className="glass-light border border-ink-600/20 hover:border-ink-500/30 rounded-xl p-3 text-center cursor-pointer transition-all duration-200 hover:-translate-y-0.5">
                    <div className="text-xl mb-1">{icon}</div>
                    <p className="text-xs font-display font-semibold text-ink-300">{label}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Today's Stats */}
          <div className="glass-card p-5">
            <h3 className="text-base font-display font-bold text-white mb-3">Today's Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-ink-400 font-body">Tasks Completed</span>
                <span className="text-sm font-display font-bold text-white">{completedCount} / {totalCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-ink-400 font-body">Scheduled Hours</span>
                <span className="text-sm font-display font-bold text-white">
                  {todayMeta?.totalHours || 0}h
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-ink-400 font-body">Day Progress</span>
                <span className="text-sm font-display font-bold text-sage-400">{dayProgress}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}