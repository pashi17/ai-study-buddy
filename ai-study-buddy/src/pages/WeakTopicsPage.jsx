import { useState, useEffect } from 'react'
import { AlertTriangle, TrendingDown, TrendingUp, RefreshCw, BookOpen, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

const severityConfig = {
  critical: { tag: 'tag-red', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', label: 'Critical' },
  moderate: { tag: 'tag-amber', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', label: 'Moderate' },
  mild: { tag: 'tag-blue', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', label: 'Mild' },
}

export default function WeakTopicsPage() {
  const [weakTopics, setWeakTopics] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [breakdown, setBreakdown] = useState({ critical: 0, moderate: 0, mild: 0 })

  useEffect(() => {
    fetchWeakTopics()
  }, [])

  const fetchWeakTopics = async () => {
    try {
      setLoading(true)
      setError('')
      const { data } = await api.get('/weaktopics')
      setWeakTopics(data.data.weakTopics)
      setBreakdown(data.data.breakdown)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load weak topics')
    } finally {
      setLoading(false)
    }
  }

  const avg = weakTopics.length
    ? Math.round(weakTopics.reduce((s, t) => s + t.averageScore, 0) / weakTopics.length)
    : 0

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-white/5 rounded-xl shimmer" />
        <div className="h-32 bg-white/5 rounded-xl shimmer" />
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-40 bg-white/5 rounded-xl shimmer" />
          ))}
        </div>
      </div>
    )
  }

  // ── Error ───────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex items-center gap-3 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-4 max-w-xl">
        <AlertTriangle size={16} className="flex-shrink-0" />
        <p className="text-sm font-body">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">

      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Weak Topics</h1>
          <p className="text-ink-300 font-body">
            AI-identified areas that need more attention based on your quiz performance.
          </p>
        </div>
        <button
          onClick={fetchWeakTopics}
          className="flex items-center gap-2 text-sm font-body text-ink-400 hover:text-white transition-colors"
        >
          <RefreshCw size={14} /> Refresh Analysis
        </button>
      </div>

      {/* ── No Weak Topics (all good!) ────────────────────────────────────── */}
      {weakTopics.length === 0 && (
        <div className="text-center py-16 space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-sage-500/20 flex items-center justify-center mx-auto">
            <CheckCircle2 size={32} className="text-sage-400" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold text-white mb-2">No Weak Topics! 🎉</h2>
            <p className="text-ink-400 font-body text-sm max-w-sm mx-auto">
              You're doing great! Take more quizzes to keep tracking your performance.
            </p>
          </div>
          <Link to="/dashboard/quiz">
            <button className="btn-primary inline-flex items-center gap-2 mt-2">
              Take a Quiz
            </button>
          </Link>
        </div>
      )}

      {weakTopics.length > 0 && (
        <>
          {/* ── Summary Banner ─────────────────────────────────────────────── */}
          <div className="glass-card p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-coral-600/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={24} className="text-coral-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-ink-400 font-body mb-1">Average Score on Weak Topics</p>
              <div className="flex items-end gap-3 mb-3">
                <span className="text-4xl font-display font-black text-white">{avg}%</span>
                <span className="flex items-center gap-1 text-sm text-coral-400 font-body mb-1">
                  <TrendingDown size={14} /> Needs improvement
                </span>
              </div>
              {/* Progress bar */}
              <div className="progress-track h-2">
                <div
                  className="h-2 rounded-full transition-all duration-700"
                  style={{
                    width: `${avg}%`,
                    background: avg >= 70 ? 'linear-gradient(90deg,#34d399,#6ee7b7)' :
                      avg >= 40 ? 'linear-gradient(90deg,#fbbf24,#fcd34d)' :
                      'linear-gradient(90deg,#f87171,#fca5a5)',
                  }}
                />
              </div>
            </div>
            {/* Breakdown */}
            <div className="sm:text-right space-y-1">
              <p className="text-sm text-ink-400 font-body">{weakTopics.length} weak topics</p>
              <div className="flex sm:flex-col gap-2 sm:items-end mt-1">
                {breakdown.critical > 0 && (
                  <span className="tag tag-red text-xs">{breakdown.critical} Critical</span>
                )}
                {breakdown.moderate > 0 && (
                  <span className="tag tag-amber text-xs">{breakdown.moderate} Moderate</span>
                )}
                {breakdown.mild > 0 && (
                  <span className="tag tag-blue text-xs">{breakdown.mild} Mild</span>
                )}
              </div>
            </div>
          </div>

          {/* ── Topics Grid ────────────────────────────────────────────────── */}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {weakTopics.map((topic) => {
              const cfg = severityConfig[topic.severity] || severityConfig.mild
              const scoreColor = topic.averageScore >= 70 ? 'text-sage-400' :
                topic.averageScore >= 40 ? 'text-amber-400' : 'text-red-400'

              return (
                <div
                  key={topic._id}
                  className={`glass-card p-5 border transition-all duration-200 hover:-translate-y-0.5 ${cfg.bg}`}
                >
                  {/* Topic name + severity */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="text-sm font-display font-bold text-white leading-snug flex-1">
                      {topic.topic}
                    </h3>
                    <span className={`tag ${cfg.tag} text-[10px] flex-shrink-0`}>
                      {cfg.label}
                    </span>
                  </div>

                  {/* Subject */}
                  {topic.subject && (
                    <p className="text-xs text-ink-500 font-body mb-3">{topic.subject}</p>
                  )}

                  {/* Score bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs font-body mb-1.5">
                      <span className="text-ink-400">Avg Score</span>
                      <span className={`font-semibold ${scoreColor}`}>{topic.averageScore}%</span>
                    </div>
                    <div className="progress-track h-1.5">
                      <div
                        className="h-1.5 rounded-full transition-all duration-700"
                        style={{
                          width: `${topic.averageScore}%`,
                          background: topic.averageScore >= 70
                            ? 'linear-gradient(90deg,#34d399,#6ee7b7)'
                            : topic.averageScore >= 40
                            ? 'linear-gradient(90deg,#fbbf24,#fcd34d)'
                            : 'linear-gradient(90deg,#f87171,#fca5a5)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center justify-between text-xs text-ink-500 font-body">
                    <span>{topic.attempts} attempt{topic.attempts !== 1 ? 's' : ''}</span>
                    <span>Last: {topic.lastAttemptScore ?? '—'}%</span>
                  </div>

                  {/* Practice button */}
                  <Link to="/dashboard/quiz" state={{ topic: topic.topic, subject: topic.subject }}>
                    <button className="mt-4 w-full btn-secondary text-xs py-2 flex items-center justify-center gap-1.5">
                      <BookOpen size={12} /> Practice This Topic
                    </button>
                  </Link>
                </div>
              )
            })}
          </div>

          {/* ── AI Recommendation ──────────────────────────────────────────── */}
          {weakTopics.length > 0 && (
            <div className="glass-card p-6 border-ink-500/20">
              <div className="flex items-start gap-4">
                <div className="text-2xl">💡</div>
                <div>
                  <h3 className="text-base font-display font-bold text-white mb-2">
                    AI Recommendation
                  </h3>
                  <p className="text-sm text-ink-300 font-body leading-relaxed">
                    Based on your performance, focus on{' '}
                    <span className="text-white font-semibold">
                      {weakTopics.find(t => t.severity === 'critical')?.topic ||
                        weakTopics[0]?.topic}
                    </span>{' '}
                    first — it has the lowest score ({
                      Math.min(...weakTopics.map(t => t.averageScore))
                    }%). Dedicate 2 focused sessions of 45 minutes before attempting a new quiz.
                    Use the <span className="text-white font-semibold">"Practice This Topic"</span> button
                    to generate a targeted quiz instantly.
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}