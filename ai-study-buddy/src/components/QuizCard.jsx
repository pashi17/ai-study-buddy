import { CheckCircle2, XCircle } from 'lucide-react'

export default function QuizCard({ question, selected, onSelect, revealed }) {
  const letters = ['A', 'B', 'C', 'D']

  const getOptionClass = (i) => {
    if (!revealed) {
      return selected === i ? 'quiz-option selected' : 'quiz-option'
    }
    if (i === question.correct) return 'quiz-option correct'
    if (i === selected && i !== question.correct) return 'quiz-option wrong'
    return 'quiz-option opacity-50'
  }

  return (
    <div className="glass-card p-8 w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <span className="tag tag-blue">{question.subject}</span>
        <span className={`tag ${question.difficulty === 'Hard' ? 'tag-red' : question.difficulty === 'Medium' ? 'tag-amber' : 'tag-green'}`}>
          {question.difficulty}
        </span>
      </div>

      <h2 className="text-lg font-display font-bold text-white mb-8 leading-snug">
        {question.question}
      </h2>

      <div className="space-y-3 mb-6">
        {question.options.map((opt, i) => (
          <div key={i} className={getOptionClass(i)} onClick={() => !revealed && onSelect(i)}>
            <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-display font-bold flex-shrink-0
              ${revealed && i === question.correct ? 'bg-sage-600/30 text-sage-400' :
                revealed && i === selected && i !== question.correct ? 'bg-coral-600/30 text-coral-400' :
                'bg-white/5 text-ink-400'
              }`}>
              {letters[i]}
            </span>
            <span className="text-sm font-body text-ink-200 flex-1">{opt}</span>
            {revealed && i === question.correct && <CheckCircle2 size={16} className="text-sage-400 flex-shrink-0" />}
            {revealed && i === selected && i !== question.correct && <XCircle size={16} className="text-coral-400 flex-shrink-0" />}
          </div>
        ))}
      </div>

      {revealed && (
        <div className="mt-6 p-4 rounded-xl bg-ink-600/10 border border-ink-600/20 animate-fade-in">
          <p className="text-xs font-display font-bold text-ink-400 uppercase tracking-wider mb-1">Explanation</p>
          <p className="text-sm font-body text-ink-200 leading-relaxed">{question.explanation}</p>
        </div>
      )}
    </div>
  )
}
