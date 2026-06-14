import { useState, useEffect } from 'react'
import { CheckCircle2, Circle, Clock, ChevronRight, Calendar, BookOpen, ArrowRight, AlertCircle } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function StudyPlanPage() {
  // ── Fetch State ─────────────────────────────────────────────────────────────
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeDay, setActiveDay] = useState(0)

  // ── Generate Form State ─────────────────────────────────────────────────────
  const [showGenerate, setShowGenerate] = useState(false)
  const [examDate, setExamDate] = useState('')
  const [examName, setExamName] = useState('')
  const [dailyHours, setDailyHours] = useState(4)
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError] = useState('')

  const navigate = useNavigate()

  // ── Fetch active study plan on mount ───────────────────────────────────────
  useEffect(() => {
    fetchPlan()
  }, [])

  const fetchPlan = async () => {
    try {
      setLoading(true)
      setError('')
      const { data } = await api.get('/studyplan')
      setPlan(data.data.studyPlan)

      // Auto-select today's day index
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const todayIdx = data.data.studyPlan.dailyPlans.findIndex(day => {
        const d = new Date(day.date)
        d.setHours(0, 0, 0, 0)
        return d >= today
      })
      setActiveDay(todayIdx >= 0 ? todayIdx : 0)
    } catch (err) {
      if (err.response?.status === 404) {
        setError('no-plan')
      } else {
        setError(err.response?.data?.message || 'Failed to load study plan')
      }
    } finally {
      setLoading(false)
    }
  }

  // ── Generate new plan ───────────────────────────────────────────────────────
  const handleGenerate = async () => {
    const syllabusId = sessionStorage.getItem('syllabusId')
    if (!syllabusId) {
      setGenError('No syllabus found. Please upload your syllabus first.')
      return
    }
    if (!examDate) {
      setGenError('Please select your exam date')
      return
    }
    if (new Date(examDate) <= new Date()) {
      setGenError('Exam date must be in the future')
      return
    }

    setGenError('')
    setGenerating(true)
    try {
      await api.post('/studyplan/generate', {
        syllabusId,
        examDate,
        examName: examName || sessionStorage.getItem('syllabusSubject') || 'Exam',
        dailyStudyHours: dailyHours,
      })
      setShowGenerate(false)
      await fetchPlan()
    } catch (err) {
      setGenError(err.response?.data?.message || 'Failed to generate plan. Try again.')
    } finally {
      setGenerating(false)
    }
  }

  // ── Mark task complete (calls dashboard task API) ───────────────────────────
  const toggleTask = async (taskId, isCompleted) => {
    if (isCompleted) return
    try {
      // Optimistic update
      setPlan(prev => ({
        ...prev,
        dailyPlans: prev.dailyPlans.map((day, di) =>
          di !== activeDay ? day : {
            ...day,
            topics: day.topics.map(t =>
              t._id === taskId ? { ...t, isCompleted: true } : t
            ),
          }
        ),
      }))
      const { data } = await api.put(`/tasks/${taskId}/complete`)
      // Update overall progress
      setPlan(prev => ({ ...prev, overallProgress: data.data.overallProgress }))
    } catch (err) {
      // Revert
      setPlan(prev => ({
        ...prev,
        dailyPlans: prev.dailyPlans.map((day, di) =>
          di !== activeDay ? day : {
            ...day,
            topics: day.topics.map(t =>
              t._id === taskId ? { ...t, isCompleted: false } : t
            ),
          }
        ),
      }))
    }
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const daysRemaining = plan
    ? Math.max(0, Math.ceil((new Date(plan.examDate) - new Date()) / (1000 * 60 * 60 * 24)))
    : 0

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  }

  const dayLabel = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-IN', { weekday: 'short' })
  }

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-white/5 rounded-xl shimmer" />
        <div className="grid grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-20 bg-white/5 rounded-xl shimmer" />)}
        </div>
        <div className="h-64 bg-white/5 rounded-xl shimmer" />
      </div>
    )
  }

  // ── No Plan State ───────────────────────────────────────────────────────────
  if (error === 'no-plan' && !showGenerate) {
    return (
      <div className="max-w-xl mx-auto text-center space-y-6 py-16">
        <div className="w-20 h-20 rounded-2xl bg-ink-600/20 flex items-center justify-center mx-auto">
          <BookOpen size={32} className="text-ink-400" />
        </div>
        <div>
          <h2 className="text-2xl font-display font-bold text-white mb-2">No Study Plan Yet</h2>
          <p className="text-ink-400 font-body text-sm">
            Upload your syllabus first, then generate a personalized AI study plan.
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <Link to="/dashboard/syllabus">
            <button className="btn-secondary flex items-center gap-2">
              Upload Syllabus
            </button>
          </Link>
          <button
            onClick={() => setShowGenerate(true)}
            className="btn-primary flex items-center gap-2"
          >
            Generate Plan <ArrowRight size={15} />
          </button>
        </div>
      </div>
    )
  }

  // ── Generate Form ───────────────────────────────────────────────────────────
  if (showGenerate || (error === 'no-plan' && showGenerate)) {
    return (
      <div className="max-w-md mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-1">Generate Study Plan</h1>
          <p className="text-ink-300 font-body text-sm">AI will create a day-wise plan based on your syllabus</p>
        </div>

        <div className="glass-card p-6 space-y-5">
          <div>
            <label className="block text-xs font-display font-semibold text-ink-400 uppercase tracking-wider mb-2">
              Exam Name
            </label>
            <input
              type="text"
              value={examName}
              onChange={e => setExamName(e.target.value)}
              placeholder="e.g. JEE Advanced, GATE 2025"
              className="input-field"
            />
          </div>

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
              type="range"
              min={1} max={12} step={0.5}
              value={dailyHours}
              onChange={e => setDailyHours(parseFloat(e.target.value))}
              className="w-full accent-ink-500"
            />
            <div className="flex justify-between text-xs text-ink-500 font-body mt-1">
              <span>1h</span><span>6h</span><span>12h</span>
            </div>
          </div>

          {genError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400 font-body">
              {genError}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setShowGenerate(false)}
              className="btn-secondary flex-1 flex items-center justify-center"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {generating ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>Generate Plan <ArrowRight size={15} /></>
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Error State ─────────────────────────────────────────────────────────────
  if (error && error !== 'no-plan') {
    return (
      <div className="flex items-center gap-3 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-4 max-w-xl">
        <AlertCircle size={16} className="flex-shrink-0" />
        <p className="text-sm font-body">{error}</p>
      </div>
    )
  }

  // ── Plan View ───────────────────────────────────────────────────────────────
  const currentDay = plan?.dailyPlans?.[activeDay]
  const allTopics = plan?.dailyPlans?.flatMap(d => d.topics) || []
  const completedTotal = allTopics.filter(t => t.isCompleted).length

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            {plan.examName || 'Your Study Plan'}
          </h1>
          <p className="text-ink-300 font-body">AI-generated plan · {plan.totalDays} days total</p>
        </div>
        <button
          onClick={() => setShowGenerate(true)}
          className="btn-secondary text-sm flex items-center gap-2"
        >
          Regenerate
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Overall Progress', value: `${plan.overallProgress || 0}%` },
          { label: 'Topics Done', value: `${completedTotal}/${allTopics.length}` },
          { label: 'Exam Date', value: formatDate(plan.examDate) },
          { label: 'Days Remaining', value: daysRemaining },
        ].map(({ label, value }) => (
          <div key={label} className="glass-card p-4 text-center">
            <p className="text-2xl font-display font-bold text-white">{value}</p>
            <p className="text-xs text-ink-400 font-body mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Overall Progress Bar */}
      <div>
        <div className="flex justify-between text-xs text-ink-400 font-body mb-2">
          <span>Overall Completion</span>
          <span>{plan.overallProgress || 0}%</span>
        </div>
        <div className="progress-track h-3">
          <div className="progress-fill h-3" style={{ width: `${plan.overallProgress || 0}%` }} />
        </div>
      </div>

      {/* Day Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {plan.dailyPlans.map((day, i) => {
          const dayDone = day.topics.filter(t => t.isCompleted).length
          const isActive = activeDay === i
          const isToday = (() => {
            const d = new Date(day.date); d.setHours(0,0,0,0)
            const t = new Date(); t.setHours(0,0,0,0)
            return d.getTime() === t.getTime()
          })()
          return (
            <button
              key={i}
              onClick={() => setActiveDay(i)}
              className={`flex-shrink-0 px-4 py-3 rounded-xl text-sm font-display font-semibold transition-all duration-200 border min-w-[80px]
                ${isActive
                  ? 'bg-ink-600/20 border-ink-500/40 text-white'
                  : 'bg-transparent border-ink-600/20 text-ink-400 hover:text-white hover:border-ink-500/30'
                }`}
            >
              <div className="text-xs font-body opacity-60 mb-0.5">{formatDate(day.date)}</div>
              <div>{isToday ? '📍 Today' : `Day ${day.dayNumber}`}</div>
              <div className={`text-xs mt-0.5 ${dayDone === day.topics.length && day.topics.length > 0 ? 'text-sage-400' : 'opacity-50'}`}>
                {day.isRestDay ? '😴 Rest' : `${dayDone}/${day.topics.length}`}
              </div>
            </button>
          )
        })}
      </div>

      {/* Task List */}
      {currentDay && (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-display font-bold text-white">
              Day {currentDay.dayNumber} — {formatDate(currentDay.date)} ({dayLabel(currentDay.date)})
            </h2>
            <span className="tag tag-blue">{currentDay.totalHours}h scheduled</span>
          </div>

          {currentDay.isRestDay ? (
            <div className="text-center py-10">
              <p className="text-4xl mb-3">😴</p>
              <p className="text-white font-display font-semibold">Rest Day</p>
              <p className="text-ink-400 font-body text-sm mt-1">Take a break — you've earned it!</p>
            </div>
          ) : currentDay.topics.length === 0 ? (
            <p className="text-ink-400 font-body text-sm text-center py-8">No tasks for this day.</p>
          ) : (
            <div className="space-y-3">
              {currentDay.topics.map(task => (
                <div
                  key={task._id}
                  onClick={() => toggleTask(task._id, task.isCompleted)}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer
                    ${task.isCompleted
                      ? 'bg-sage-600/5 border-sage-600/20 opacity-70'
                      : 'bg-white/3 border-ink-600/20 hover:border-ink-500/30 hover:bg-white/5'
                    }`}
                >
                  <button className="flex-shrink-0 hover:scale-110 transition-transform">
                    {task.isCompleted
                      ? <CheckCircle2 size={22} className="text-sage-500" />
                      : <Circle size={22} className="text-ink-500" />
                    }
                  </button>

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-body font-medium ${task.isCompleted ? 'line-through text-ink-500' : 'text-white'}`}>
                      {task.topicName}
                    </p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {task.subject && (
                        <span className="text-[10px] font-display font-semibold px-2 py-0.5 rounded-full border bg-ink-600/20 text-ink-400 border-ink-600/30">
                          {task.subject}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-xs text-ink-500 font-body">
                        <Clock size={10} /> ~{task.estimatedHours}h
                      </span>
                      {task.subtopics?.length > 0 && (
                        <span className="text-xs text-ink-500 font-body truncate max-w-[200px]">
                          {task.subtopics.slice(0, 2).join(', ')}
                        </span>
                      )}
                    </div>
                  </div>

                  {task.isCompleted
                    ? <span className="tag tag-green text-xs flex-shrink-0">Done</span>
                    : <ChevronRight size={14} className="text-ink-600 flex-shrink-0" />
                  }
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}