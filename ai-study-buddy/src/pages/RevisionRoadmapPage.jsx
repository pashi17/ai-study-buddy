import { useState, useEffect } from 'react'
import { Calendar, Clock, Flag, Sparkles, AlertCircle, RefreshCw, BookOpen, ChevronDown, ChevronUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

export default function RevisionRoadmapPage() {
  // ── State ───────────────────────────────────────────────────────────────────
  const [roadmap, setRoadmap] = useState([])
  const [strategy, setStrategy] = useState('')
  const [examDate, setExamDate] = useState('')
  const [dailyHours, setDailyHours] = useState(4)
  const [remainingDays, setRemainingDays] = useState(0)
  const [weakTopicsCount, setWeakTopicsCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [expandedDay, setExpandedDay] = useState(0)

  useEffect(() => {
    generateRoadmap()
  }, [])

  // ── Generate roadmap (GET uses stored exam date from study plan) ────────────
  const generateRoadmap = async (customExamDate, customHours) => {
    try {
      setGenerating(true)
      setError('')

      const payload = {}
      if (customExamDate) payload.examDate = customExamDate
      if (customHours) payload.dailyHours = customHours

      const { data } = await api.post('/roadmap/generate', payload)

      setRoadmap(data.data.roadmap || [])
      setStrategy(data.data.strategy || '')
      setRemainingDays(data.data.remainingDays || 0)
      setWeakTopicsCount(data.data.weakTopicsCount || 0)
      if (data.data.examDate) {
        setExamDate(new Date(data.data.examDate).toISOString().split('T')[0])
      }
      setShowForm(false)
    } catch (err) {
      if (err.response?.status === 400) {
        // No exam date set — show form
        setError('set-date')
        setShowForm(true)
      } else {
        setError(err.response?.data?.message || 'Failed to generate roadmap')
      }
    } finally {
      setLoading(false)
      setGenerating(false)
    }
  }

  const handleGenerate = () => {
    if (!examDate) return
    generateRoadmap(examDate, dailyHours)
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    })
  }

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-56 bg-white/5 rounded-xl shimmer" />
        <div className="h-24 bg-white/5 rounded-xl shimmer" />
        {[1,2,3].map(i => <div key={i} className="h-40 bg-white/5 rounded-xl shimmer" />)}
      </div>
    )
  }

  // ── Set Exam Date Form ──────────────────────────────────────────────────────
  if (showForm) {
    return (
      <div className="max-w-md mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Revision Roadmap</h1>
          <p className="text-ink-300 font-body text-sm">
            {error === 'set-date'
              ? 'Set your exam date to generate a focused revision plan.'
              : 'Customize your revision roadmap settings.'}
          </p>
        </div>

        <div className="glass-card p-6 space-y-5">
          <div>
            <label className="block text-xs font-display font-semibold text-ink-400 uppercase tracking-wider mb-2">
              Exam Date <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              value={examDate}
              onChange={e => setExamDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-xs font-display font-semibold text-ink-400 uppercase tracking-wider mb-2">
              Daily Study Hours: <span className="text-white">{dailyHours}h</span>
            </label>
            <input
              type="range" min={1} max={12} step={0.5}
              value={dailyHours}
              onChange={e => setDailyHours(parseFloat(e.target.value))}
              className="w-full accent-ink-500"
            />
            <div className="flex justify-between text-xs text-ink-500 font-body mt-1">
              <span>1h</span><span>6h</span><span>12h</span>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!examDate || generating}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {generating ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <><Sparkles size={15} /> Generate Roadmap</>
            )}
          </button>
        </div>
      </div>
    )
  }

  // ── No Weak Topics ──────────────────────────────────────────────────────────
  if (roadmap.length === 0 && !generating) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">Revision Roadmap</h1>
            <p className="text-ink-300 font-body">Your focused pre-exam revision plan.</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="btn-secondary flex items-center gap-2 text-sm"
          >
            <RefreshCw size={14} /> Regenerate
          </button>
        </div>

        <div className="glass-card p-10 text-center space-y-4">
          <div className="text-4xl">🎉</div>
          <h2 className="text-2xl font-display font-bold text-white">No Weak Topics!</h2>
          <p className="text-ink-400 font-body text-sm max-w-sm mx-auto">
            {strategy || 'You have no critical weak topics. Review all topics equally in the remaining days.'}
          </p>
          {remainingDays > 0 && (
            <div className="inline-flex items-center gap-2 tag tag-green text-sm px-4 py-2">
              <Clock size={13} /> {remainingDays} days until exam
            </div>
          )}
          <div className="pt-2">
            <Link to="/dashboard/quiz">
              <button className="btn-primary flex items-center gap-2 mx-auto">
                <BookOpen size={15} /> Keep Practicing
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ── Error ───────────────────────────────────────────────────────────────────
  if (error && error !== 'set-date') {
    return (
      <div className="flex items-center gap-3 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-4 max-w-xl">
        <AlertCircle size={16} className="flex-shrink-0" />
        <p className="text-sm font-body">{error}</p>
      </div>
    )
  }

  // ── Main Roadmap View ───────────────────────────────────────────────────────
  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Revision Roadmap</h1>
          <p className="text-ink-300 font-body">
            AI-generated plan · Prioritized on your {weakTopicsCount} weak topics
          </p>
        </div>
        <div className="flex items-center gap-3">
          {examDate && (
            <div className="glass-card px-4 py-2 flex items-center gap-2">
              <Calendar size={14} className="text-ink-400" />
              <span className="text-sm font-body text-ink-300">Exam: {formatDate(examDate)}</span>
            </div>
          )}
          {remainingDays > 0 && (
            <div className="glass-card px-4 py-2 flex items-center gap-2">
              <Clock size={14} className="text-ink-400" />
              <span className="text-sm font-body text-ink-300">{remainingDays} days left</span>
            </div>
          )}
          <button
            onClick={() => setShowForm(true)}
            className="btn-secondary text-sm flex items-center gap-2"
          >
            <RefreshCw size={13} /> Regenerate
          </button>
        </div>
      </div>

      {/* Strategy Banner */}
      {strategy && (
        <div className="glass-card p-5 border-ink-500/20">
          <div className="flex items-start gap-3">
            <Sparkles size={18} className="text-ink-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-display font-bold text-ink-400 uppercase tracking-wider mb-1">
                AI Strategy
              </p>
              <p className="text-sm text-ink-200 font-body leading-relaxed">{strategy}</p>
            </div>
          </div>
        </div>
      )}

      {/* Generating spinner */}
      {generating && (
        <div className="glass-card p-10 flex flex-col items-center gap-4">
          <Sparkles size={28} className="text-ink-400 animate-pulse" />
          <p className="text-white font-display font-semibold">Generating your revision roadmap...</p>
          <p className="text-ink-400 font-body text-sm">AI is analyzing your weak topics</p>
        </div>
      )}

      {/* Timeline */}
      {!generating && (
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-8 bottom-8 w-px bg-gradient-to-b from-ink-500/60 via-ink-600/30 to-transparent hidden md:block" />

          <div className="space-y-4">
            {roadmap.map((day, i) => {
              const isExpanded = expandedDay === i
              const isToday = i === 0

              return (
                <div key={i} className="md:pl-16 relative">
                  {/* Timeline dot */}
                  <div className={`absolute left-4 top-7 w-4 h-4 rounded-full border-2 hidden md:block
                    ${isToday ? 'bg-ink-500 border-ink-400 shadow-glow-sm' : 'bg-ink-800 border-ink-600'}`}
                  />

                  <div className={`glass-card transition-all duration-300 ${isToday ? 'border-ink-500/40' : ''}`}>
                    {/* Day header — clickable to expand */}
                    <div
                      className="p-5 cursor-pointer flex items-center justify-between"
                      onClick={() => setExpandedDay(isExpanded ? -1 : i)}
                    >
                      <div className="flex items-center gap-3">
                        {isToday && <span className="glow-dot" />}
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="text-base font-display font-bold text-white">
                              Day {day.dayNumber}
                              {day.date ? ` — ${formatDate(day.date)}` : ''}
                            </h3>
                            {isToday && <span className="tag tag-blue text-[10px]">Today</span>}
                          </div>
                          <p className="text-xs text-ink-400 font-body">
                            {day.focus} · ~{day.estimatedHours}h
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-wrap gap-1 hidden sm:flex">
                          {day.topics?.slice(0, 3).map((t, j) => (
                            <span key={j} className="tag tag-blue text-[10px]">{t}</span>
                          ))}
                          {day.topics?.length > 3 && (
                            <span className="tag tag-blue text-[10px]">+{day.topics.length - 3}</span>
                          )}
                        </div>
                        {isExpanded
                          ? <ChevronUp size={16} className="text-ink-400 flex-shrink-0" />
                          : <ChevronDown size={16} className="text-ink-400 flex-shrink-0" />
                        }
                      </div>
                    </div>

                    {/* Expanded content */}
                    {isExpanded && (
                      <div className="px-5 pb-5 border-t border-ink-600/20 pt-4 space-y-4 animate-fade-in">
                        {/* Topics list */}
                        {day.topics?.length > 0 && (
                          <div>
                            <p className="text-xs font-display font-bold text-ink-400 uppercase tracking-wider mb-2">
                              Topics to Cover
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {day.topics.map((t, j) => (
                                <span
                                  key={j}
                                  className="text-xs bg-ink-600/20 border border-ink-500/20 text-ink-200 px-3 py-1.5 rounded-xl font-body"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Study tips */}
                        {day.studyTips && (
                          <div className="bg-ink-600/20 border border-ink-500/20 rounded-xl p-3">
                            <p className="text-xs font-display font-bold text-ink-400 uppercase tracking-wider mb-1">
                              💡 Study Tip
                            </p>
                            <p className="text-sm text-ink-200 font-body">{day.studyTips}</p>
                          </div>
                        )}

                        {/* Practice button */}
                        {day.topics?.length > 0 && (
                          <Link to="/dashboard/quiz" state={{ topic: day.topics[0] }}>
                            <button className="btn-secondary text-xs flex items-center gap-2 py-2">
                              <BookOpen size={12} /> Practice {day.topics[0]}
                            </button>
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Exam Day flag */}
          <div className="md:pl-16 mt-4">
            <div className="flex items-center gap-3 p-4 rounded-xl border border-dashed border-ink-600/30">
              <Flag size={18} className="text-amber-400" />
              <span className="text-sm font-display font-semibold text-ink-300">
                Exam Day {examDate ? `— ${formatDate(examDate)}` : ''}
              </span>
              {remainingDays > 0 && (
                <span className="ml-auto tag tag-amber">{remainingDays} days</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}