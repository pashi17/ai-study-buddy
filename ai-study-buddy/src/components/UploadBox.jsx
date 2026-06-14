import { useState, useRef } from 'react'
import { Upload, FileText, X, CheckCircle } from 'lucide-react'

export default function UploadBox({ onFileSelect, accept = '.pdf,.txt', label = 'Upload Syllabus' }) {
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState(null)
  const inputRef = useRef(null)

  const handleFile = (f) => {
    setFile(f)
    onFileSelect && onFileSelect(f)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const handleChange = (e) => {
    const f = e.target.files[0]
    if (f) handleFile(f)
  }

  const removeFile = (e) => {
    e.stopPropagation()
    setFile(null)
    if (inputRef.current) inputRef.current.value = ''
    onFileSelect && onFileSelect(null)
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => !file && inputRef.current?.click()}
      className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer
        ${dragging
          ? 'border-ink-500 bg-ink-600/20 scale-[1.01]'
          : file
            ? 'border-sage-500/50 bg-sage-600/5 cursor-default'
            : 'border-ink-600/40 bg-ink-900/30 hover:border-ink-500/60 hover:bg-ink-600/10'
        }`}
    >
      <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" />

      <div className="p-10 flex flex-col items-center justify-center gap-4 text-center">
        {file ? (
          <>
            <div className="w-16 h-16 rounded-2xl bg-sage-600/20 flex items-center justify-center">
              <CheckCircle size={28} className="text-sage-400" />
            </div>
            <div>
              <p className="font-display font-semibold text-white mb-1">{file.name}</p>
              <p className="text-sm text-ink-400">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <button
              onClick={removeFile}
              className="flex items-center gap-2 text-xs text-coral-400 hover:text-coral-300 bg-coral-600/10 hover:bg-coral-600/20 px-3 py-1.5 rounded-full border border-coral-600/20 transition-colors"
            >
              <X size={12} /> Remove file
            </button>
          </>
        ) : (
          <>
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${dragging ? 'bg-ink-500/30 scale-110' : 'bg-ink-600/20'}`}>
              <Upload size={28} className={dragging ? 'text-ink-400' : 'text-ink-500'} />
            </div>
            <div>
              <p className="font-display font-semibold text-white mb-1">{label}</p>
              <p className="text-sm text-ink-400">Drag & drop your PDF or text file here</p>
              <p className="text-xs text-ink-500 mt-1">or click to browse</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-ink-500">
              <FileText size={12} /> PDF, TXT supported · Max 20MB
            </div>
          </>
        )}
      </div>
    </div>
  )
}
