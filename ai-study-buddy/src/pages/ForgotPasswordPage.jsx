import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Brain, Mail, ArrowRight, CheckCircle2 } from 'lucide-react'
import api from '../api/axios'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.post('/auth/forgot-password', { email })
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request password reset. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#060b1a] grid-bg flex items-center justify-center px-4 relative overflow-hidden">
      <div className="orb orb-blue w-[500px] h-[500px] top-[-150px] right-[-100px] opacity-30" />
      <div className="orb orb-purple w-[400px] h-[400px] bottom-[-100px] left-[-100px] opacity-20" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ink-500 to-ink-700 flex items-center justify-center shadow-glow">
              <Brain size={20} className="text-white" />
            </div>
            <span className="font-display font-bold text-white text-xl">
              Study<span className="text-ink-400">Buddy</span>
            </span>
          </Link>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Reset Password</h1>
          <p className="text-ink-400 font-body text-sm">Enter your email and we'll send you a reset link.</p>
        </div>

        <div className="glass-card p-8">
          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-sage-500/20 text-sage-400 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-xl font-display font-bold text-white mb-2">Check your email</h2>
              <p className="text-ink-400 font-body text-sm mb-6">
                If an account exists for that email, we have sent a reset link to it. <br/>
                <span className="text-xs text-ink-500 italic mt-2 block">(For dev: check the backend server terminal for the link)</span>
              </p>
              <Link to="/login" className="btn-primary w-full flex items-center justify-center gap-2">
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-display font-semibold text-ink-400 uppercase tracking-wider mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="input-field pl-11"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400 font-body">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending link...
                  </>
                ) : (
                  <>
                    Send Reset Link <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          )}

          {!success && (
            <p className="text-center text-sm text-ink-400 font-body mt-6">
              Remember your password?{' '}
              <Link to="/login" className="text-ink-300 hover:text-white font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
