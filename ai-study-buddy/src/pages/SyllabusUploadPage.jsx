import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Sparkles, CheckCircle2, ChevronRight, X } from 'lucide-react'
import api from '../api/axios'

export default function SyllabusUploadPage() {
  const [file, setFile] = useState(null)
  const [subject, setSubject] = useState('')
  const [status, setStatus] = useState('idle') // idle | analyzing | done
  const [error, setError] = useState('')
  const [analyzedData, setAnalyzedData] = useState(null)
  const navigate = useNavigate()

  const handleFileChange = (e) => {
    const selected = e.target.files[0]
    if (!selected) return
    const ext = selected.name.split('.').pop().toLowerCase()
    if (!['pdf', 'txt'].includes(ext)) {
      setError('Only PDF or TXT files are allowed')
      return
    }
    setError('')
    setFile(selected)
  }

  const handleAnalyze = async () => {
    if (!file) return setError('Please select a file first')
    if (!subject.trim()) return setError('Please enter the subject name')

    setError('')
    setStatus('analyzing')

    try {
      const formData = new FormData()
      formData.append('syllabus', file)
      formData.append('subject', subject.trim())

      const { data } = await api.post('/syllabus/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      // Save syllabusId to sessionStorage for study plan generation
      sessionStorage.setItem('syllabusId', data.data.syllabus._id)
      sessionStorage.setItem('syllabusSubject', data.data.syllabus.subject)

      setAnalyzedData(data.data.syllabus)
      setStatus('done')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze syllabus. Please try again.')
      setStatus('idle')
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <span className="tag tag-blue mb-3 inline-block">Step 1 of 2</span>
        <h1 className="text-3xl font-display font-bold text-white mb-2">Upload Your Syllabus</h1>
        <p className="text-ink-300 font-body">Let the AI parse your syllabus and build a personalized study plan.</p>
      </div>

      {/* ── IDLE STATE ─────────────────────────────────────────────────────── */}
      {status === 'idle' && (
        <div className="space-y-6">

          {/* Subject Name Input */}
          <div>
            <label className="block text-xs font-display font-semibold text-ink-400 uppercase tracking-wider mb-2">
              Subject Name
            </label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="e.g. Physics, Data Structures, Mathematics"
              className="input-field"
            />
          </div>

          {/* File Upload Box */}
          <div>
            <label className="block text-xs font-display font-semibold text-ink-400 uppercase tracking-wider mb-2">
              Syllabus File
            </label>
            <label className="glass-card p-8 flex flex-col items-center justify-center gap-3 border-dashed cursor-pointer hover:border-ink-500/40 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-ink-600/20 flex items-center justify-center group-hover:bg-ink-600/30 transition-colors">
                <FileText size={24} className="text-ink-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-display font-semibold text-white mb-1">
                  Click to upload or drag & drop
                </p>
                <p className="text-xs text-ink-400 font-body">PDF or TXT · Max 10MB</p>
              </div>
              <input
                type="file"
                accept=".pdf,.txt"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Selected File Preview */}
          {file && (
            <div className="glass-card p-5 flex items-center gap-4 animate-slide-up">
              <div className="w-10 h-10 rounded-xl bg-ink-600/20 flex items-center justify-center flex-shrink-0">
                <FileText size={18} className="text-ink-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-display font-semibold text-white truncate">{file.name}</p>
                <p className="text-xs text-ink-400 font-body mt-0.5">
                  {(file.size / 1024).toFixed(1)} KB · {file.name.endsWith('.pdf') ? 'PDF Document' : 'Text File'}
                </p>
              </div>
              <button onClick={() => setFile(null)} className="text-ink-500 hover:text-coral-400 transition-colors">
                <X size={16} />
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400 font-body">
              {error}
            </div>
          )}

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={!file || !subject.trim()}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles size={16} />
            Analyze Syllabus with AI
          </button>

          {/* Tips */}
          <div className="glass-card p-5">
            <p className="text-xs font-display font-bold text-ink-400 uppercase tracking-wider mb-3">
              Tips for Best Results
            </p>
            <ul className="space-y-2">
              {[
                'Upload the official university/board syllabus PDF',
                'Ensure the PDF has selectable text (not scanned images)',
                'Enter the correct subject name before uploading',
                'Exam date will be asked next to calibrate your plan',
              ].map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink-300 font-body">
                  <ChevronRight size={14} className="text-ink-500 mt-0.5 flex-shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ── ANALYZING STATE ─────────────────────────────────────────────────── */}
      {status === 'analyzing' && (
        <div className="glass-card p-12 animate-fade-in">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-ink-600/20 flex items-center justify-center">
              <Sparkles size={28} className="text-ink-400 animate-pulse" />
            </div>
            <p className="text-white font-display font-semibold text-lg">AI is analyzing your syllabus...</p>
          </div>
          <div className="mt-6 space-y-2 max-w-xs mx-auto">
            {[
              'Parsing document structure...',
              'Identifying key topics...',
              'Estimating study hours...',
              'Building knowledge graph...',
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-ink-400 font-body">
                <div
                  className="w-1.5 h-1.5 rounded-full bg-ink-500 animate-pulse"
                  style={{ animationDelay: `${i * 0.3}s` }}
                />
                {s}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── DONE STATE ──────────────────────────────────────────────────────── */}
      {status === 'done' && analyzedData && (
        <div className="space-y-6 animate-slide-up">

          {/* Success Banner */}
          <div className="glass-card p-5 flex items-center gap-3 border-sage-500/30">
            <CheckCircle2 size={20} className="text-sage-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-display font-semibold text-white">Analysis Complete!</p>
              <p className="text-xs text-ink-400 font-body">
                Found {analyzedData.totalTopics} topics · Est. {analyzedData.totalEstimatedHours}h of prep
              </p>
            </div>
          </div>

          {/* Topics List */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-display font-bold text-white">{analyzedData.subject}</h3>
              <span className="tag tag-blue">{analyzedData.totalTopics} topics</span>
            </div>
            <div className="space-y-3">
              {analyzedData.topics.map((topic, i) => (
                <div key={i} className="p-3 bg-white/5 rounded-xl border border-ink-600/20">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-display font-semibold text-white">{topic.name}</p>
                    <div className="flex items-center gap-2">
                      <span className={`tag ${
                        topic.priority === 'high' ? 'tag-red' :
                        topic.priority === 'medium' ? 'tag-amber' : 'tag-green'
                      }`}>
                        {topic.priority}
                      </span>
                      <span className="text-xs text-ink-400 font-body">~{topic.estimatedHours}h</span>
                    </div>
                  </div>
                  {topic.subtopics && topic.subtopics.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {topic.subtopics.map((sub, j) => (
                        <span
                          key={j}
                          className="text-xs bg-white/5 border border-ink-600/20 text-ink-300 px-2.5 py-1 rounded-lg font-body"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => { setStatus('idle'); setFile(null); setAnalyzedData(null) }}
              className="btn-secondary flex-1 flex items-center justify-center gap-2"
            >
              Re-upload
            </button>
            <button
              onClick={() => navigate('/dashboard/study-plan')}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              Generate Study Plan <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}