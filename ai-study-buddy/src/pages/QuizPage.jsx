import { useState, useEffect, useRef } from 'react'
import { ChevronRight, RotateCcw, Trophy, Target, Sparkles, BookOpen, CheckCircle2, XCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

export default function QuizPage() {
  // ── Setup State ────────────────────────────────────────────────────────────
  const [phase, setPhase] = useState('setup') // setup | loading | quiz | result
  const [topicInput, setTopicInput] = useState('')
  const [subjectInput, setSubjectInput] = useState('')
  const [numQuestions, setNumQuestions] = useState(5)
  const [difficulty, setDifficulty] = useState('mixed')
  const [setupError, setSetupError] = useState('')

  // ── Quiz State ─────────────────────────────────────────────────────────────
  const [quiz, setQuiz] = useState(null)
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [userAnswers, setUserAnswers] = useState([]) // [{ questionIndex, selectedAnswer }]
  const [answeredStatus, setAnsweredStatus] = useState([]) // track correct/wrong per Q for nav dots

  // ── Result State ───────────────────────────────────────────────────────────
  const [result, setResult] = useState(null)
  const [submitLoading, setSubmitLoading] = useState(false)

  // ── Timer ──────────────────────────────────────────────────────────────────
  const startTimeRef = useRef(null)

  // ── Generate Quiz ──────────────────────────────────────────────────────────
  const handleGenerate = async () => {
    if (!topicInput.trim()) return setSetupError('Please enter a topic')
    setSetupError('')
    setPhase('loading')

    try {
      const { data } = await api.post('/quiz/generate', {
        topic: topicInput.trim(),
        subject: subjectInput.trim() || undefined,
        numQuestions,
        difficulty,
      })
      setQuiz(data.data.quiz)
      setUserAnswers([])
      setAnsweredStatus([])
      setCurrent(0)
      setSelected(null)
      setRevealed(false)
      startTimeRef.current = Date.now()
      setPhase('quiz')
    } catch (err) {
      setSetupError(err.response?.data?.message || 'Failed to generate quiz. Try again.')
      setPhase('setup')
    }
  }

  // ── Submit single answer & reveal ─────────────────────────────────────────
  const handleSubmitAnswer = () => {
    if (selected === null) return
    setRevealed(true)
  }

  // ── Move to next question ──────────────────────────────────────────────────
  const handleNext = async () => {
    // Save this answer
    const newAnswers = [
      ...userAnswers,
      { questionIndex: current, selectedAnswer: selected },
    ]
    setUserAnswers(newAnswers)

    const isLast = current + 1 >= quiz.questions.length

    if (!isLast) {
      setCurrent(c => c + 1)
      setSelected(null)
      setRevealed(false)
    } else {
      // Submit all answers to backend
      setSubmitLoading(true)
      try {
        const timeTaken = Math.round((Date.now() - startTimeRef.current) / 1000)
        const { data } = await api.post('/quiz/submit', {
          quizId: quiz._id,
          answers: newAnswers,
          timeTaken,
        })
        setResult(data.data)

        // Build answered status for nav dots
        const statuses = data.data.answers.map(a => a.isCorrect)
        setAnsweredStatus(statuses)

        setPhase('result')
      } catch (err) {
        console.error('Submit failed:', err.message)
        setSetupError('Failed to submit quiz. Please try again.')
        setPhase('setup')
      } finally {
        setSubmitLoading(false)
      }
    }
  }

  // ── Reset ──────────────────────────────────────────────────────────────────
  const reset = () => {
    setPhase('setup')
    setQuiz(null)
    setResult(null)
    setUserAnswers([])
    setAnsweredStatus([])
    setCurrent(0)
    setSelected(null)
    setRevealed(false)
    setSetupError('')
  }

  const question = quiz?.questions?.[current]
  const total = quiz?.questions?.length || 0
  const percentage = result?.score || 0

  // ── SETUP PHASE ────────────────────────────────────────────────────────────
  if (phase === 'setup') {
    return (
      <div className="max-w-xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-1">AI Quiz Generator</h1>
          <p className="text-ink-300 font-body text-sm">Generate a quiz on any topic using AI</p>
        </div>

        <div className="glass-card p-6 space-y-5">
          {/* Topic */}
          <div>
            <label className="block text-xs font-display font-semibold text-ink-400 uppercase tracking-wider mb-2">
              Topic <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={topicInput}
              onChange={e => setTopicInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleGenerate()}
              placeholder="e.g. Kinematics, SQL Joins, Newton's Laws"
              className="input-field"
            />
          </div>

          {/* Subject (optional) */}
          <div>
            <label className="block text-xs font-display font-semibold text-ink-400 uppercase tracking-wider mb-2">
              Subject <span className="text-ink-500">(optional)</span>
            </label>
            <input
              type="text"
              value={subjectInput}
              onChange={e => setSubjectInput(e.target.value)}
              placeholder="e.g. Physics, Computer Science"
              className="input-field"
            />
          </div>

          {/* Num Questions */}
          <div>
            <label className="block text-xs font-display font-semibold text-ink-400 uppercase tracking-wider mb-2">
              Number of Questions
            </label>
            <div className="flex gap-2">
              {[3, 5, 8, 10].map(n => (
                <button
                  key={n}
                  onClick={() => setNumQuestions(n)}
                  className={`flex-1 py-2 rounded-xl text-sm font-display font-semibold transition-all ${
                    numQuestions === n
                      ? 'bg-ink-600/40 border border-ink-500/60 text-white'
                      : 'bg-white/5 border border-ink-600/20 text-ink-400 hover:text-white'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-xs font-display font-semibold text-ink-400 uppercase tracking-wider mb-2">
              Difficulty
            </label>
            <div className="flex gap-2">
              {['easy', 'mixed', 'medium', 'hard'].map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 py-2 rounded-xl text-xs font-display font-semibold capitalize transition-all ${
                    difficulty === d
                      ? 'bg-ink-600/40 border border-ink-500/60 text-white'
                      : 'bg-white/5 border border-ink-600/20 text-ink-400 hover:text-white'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {setupError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400 font-body">
              {setupError}
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!topicInput.trim()}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles size={16} />
            Generate Quiz with AI
          </button>
        </div>
      </div>
    )
  }

  // ── LOADING PHASE ──────────────────────────────────────────────────────────
  if (phase === 'loading') {
    return (
      <div className="max-w-xl mx-auto">
        <div className="glass-card p-16 flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-ink-600/20 flex items-center justify-center">
            <Sparkles size={28} className="text-ink-400 animate-pulse" />
          </div>
          <p className="text-white font-display font-semibold text-lg">Generating your quiz...</p>
          <p className="text-ink-400 font-body text-sm">AI is crafting {numQuestions} questions on "{topicInput}"</p>
          <div className="w-48 h-1.5 bg-ink-600/20 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-gradient-to-r from-ink-500 to-sage-500 rounded-full shimmer" style={{ width: '60%' }} />
          </div>
        </div>
      </div>
    )
  }

  // ── RESULT PHASE ───────────────────────────────────────────────────────────
  if (phase === 'result' && result) {
    return (
      <div className="max-w-xl mx-auto space-y-6">
        <div className="glass-card p-10 relative overflow-hidden text-center">
          <div className="orb orb-blue w-[300px] h-[300px] top-[-100px] left-[-100px] opacity-20" />
          <div className="relative z-10">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-ink-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-glow">
              <Trophy size={32} className="text-white" />
            </div>
            <h2 className="text-3xl font-display font-bold text-white mb-2">Quiz Complete!</h2>
            <p className="text-ink-300 font-body mb-6">Topic: {quiz.topic}</p>

            {/* Score */}
            <div
              className="text-6xl font-display font-black mb-2"
              style={{
                background: percentage >= 70
                  ? 'linear-gradient(135deg, #34d399, #6ee7b7)'
                  : percentage >= 40
                  ? 'linear-gradient(135deg, #fbbf24, #fcd34d)'
                  : 'linear-gradient(135deg, #f87171, #fca5a5)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {percentage}%
            </div>
            <p className="text-ink-300 font-body mb-2">
              {result.correctAnswers} out of {result.totalQuestions} correct
            </p>

            {/* Weak topic badge */}
            {result.isWeakTopic && (
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-1.5 mb-4">
                <span className="text-xs text-amber-400 font-body">⚠️ Added to weak topics for revision</span>
              </div>
            )}

            {/* Answer dots */}
            <div className="grid grid-cols-5 gap-2 mb-6">
              {result.answers.map((a, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full ${a.isCorrect ? 'bg-sage-500' : 'bg-coral-500'}`}
                />
              ))}
            </div>

            {/* AI Feedback */}
            {result.feedback && (
              <div className="bg-ink-600/20 border border-ink-500/20 rounded-xl p-4 text-left mb-6">
                <p className="text-xs font-display font-bold text-ink-400 uppercase tracking-wider mb-1">AI Feedback</p>
                <p className="text-sm text-ink-200 font-body">{result.feedback}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={reset} className="btn-secondary flex-1 flex items-center justify-center gap-2">
                <RotateCcw size={15} /> New Quiz
              </button>
              <Link to="/dashboard/weak-topics" className="flex-1">
                <button className="btn-primary w-full flex items-center justify-center gap-2">
                  <Target size={15} /> Weak Areas
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Answer Review */}
        <div className="glass-card p-6 space-y-4">
          <h3 className="text-base font-display font-bold text-white">Answer Review</h3>
          {result.answers.map((ans, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl border ${
                ans.isCorrect ? 'bg-sage-500/10 border-sage-500/20' : 'bg-red-500/10 border-red-500/20'
              }`}
            >
              <div className="flex items-start gap-2 mb-2">
                {ans.isCorrect
                  ? <CheckCircle2 size={16} className="text-sage-400 flex-shrink-0 mt-0.5" />
                  : <XCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                }
                <p className="text-sm font-body text-white">{ans.question}</p>
              </div>
              {!ans.isCorrect && (
                <p className="text-xs text-ink-400 font-body ml-6 mb-1">
                  Your answer: <span className="text-red-400">{quiz.questions[i]?.options?.[ans.selectedAnswer]}</span>
                  {' · '}Correct: <span className="text-sage-400">{quiz.questions[i]?.options?.[ans.correctAnswer]}</span>
                </p>
              )}
              {ans.explanation && (
                <p className="text-xs text-ink-400 font-body ml-6 mt-1 italic">{ans.explanation}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── QUIZ PHASE ─────────────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-1">{quiz.topic}</h1>
          <p className="text-ink-300 font-body text-sm">{quiz.subject || 'Quiz'} · {total} questions</p>
        </div>
        <div className="glass-card px-4 py-2 text-center">
          <p className="text-xs text-ink-400 font-body">Question</p>
          <p className="text-xl font-display font-bold text-white">{current + 1}/{total}</p>
        </div>
      </div>

      {/* Progress */}
      <div>
        <div className="progress-track h-2">
          <div
            className="progress-fill h-2 transition-all duration-500"
            style={{ width: `${((current + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Nav Dots */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {quiz.questions.map((_, i) => (
          <div
            key={i}
            className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-display font-bold transition-colors
              ${i < userAnswers.length
                ? answeredStatus[i]
                  ? 'bg-sage-600/30 text-sage-400 border border-sage-600/30'
                  : 'bg-coral-600/30 text-coral-400 border border-coral-600/30'
                : i === current
                ? 'bg-ink-600/30 text-ink-300 border border-ink-500/40'
                : 'bg-white/5 text-ink-600 border border-ink-600/20'
              }`}
          >
            {i + 1}
          </div>
        ))}
      </div>

      {/* Question Card */}
      {question && (
        <div className="glass-card p-6 space-y-5">
          <div className="flex items-start gap-3">
            <span className="tag tag-blue flex-shrink-0">Q{current + 1}</span>
            <p className="text-white font-body text-base leading-relaxed">{question.question}</p>
          </div>

          <div className="space-y-3">
            {question.options.map((opt, i) => {
              let cls = 'quiz-option'
              if (revealed) {
                // After reveal — highlight correct (from backend via result.answers on last Q)
                // During quiz we don't know correct answer, so just show selected
                if (i === selected) cls += ' selected'
              } else {
                if (i === selected) cls += ' selected'
              }
              return (
                <div
                  key={i}
                  className={cls}
                  onClick={() => !revealed && setSelected(i)}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-display font-bold flex-shrink-0 transition-colors
                    ${selected === i ? 'bg-ink-500 text-white' : 'bg-white/5 text-ink-400'}`}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                  <span className="text-sm font-body text-white">{opt}</span>
                </div>
              )
            })}
          </div>

          {/* Explanation after reveal */}
          {revealed && question.explanation && (
            <div className="bg-ink-600/20 border border-ink-500/20 rounded-xl p-3 animate-fade-in">
              <p className="text-xs font-display font-bold text-ink-400 uppercase tracking-wider mb-1">Note</p>
              <p className="text-sm text-ink-300 font-body">Answer recorded. Explanation will be shown in results.</p>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        {!revealed ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={selected === null}
            className="btn-primary px-8 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={submitLoading}
            className="btn-primary flex items-center gap-2 px-8"
          >
            {submitLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                {current + 1 >= total ? 'See Results' : 'Next Question'}
                <ChevronRight size={16} />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}