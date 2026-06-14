import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Brain, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'
import api from '../api/axios'

export default function ResetPasswordPage() {
  const [form, setForm] = useState({ password: '', confirmPassword: '' })
  const [showPass, setShowPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const { id, token } = useParams()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }
    
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      await api.post(`/auth/reset-password/${id}/${token}`, { password: form.password })
      setSuccess(true)
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Link may be expired.')
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
          <h1 className="text-3xl font-display font-bold text-white mb-2">Create New Password</h1>
          <p className="text-ink-400 font-body text-sm">Your new password must be different from previous used passwords.</p>
        </div>

        <div className="glass-card p-8">
          {success ? (
            <div className="text-center">
              <h2 className="text-xl font-display font-bold text-sage-400 mb-2">Password Reset Successfully</h2>
              <p className="text-ink-300 font-body text-sm mb-6">
                You will be redirected to the login page shortly.
              </p>
              <Link to="/login" className="btn-primary w-full flex items-center justify-center gap-2">
                Go to Login <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Password */}
              <div>
                <label className="block text-xs font-display font-semibold text-ink-400 uppercase tracking-wider mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-500" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className="input-field pl-11 pr-11"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-500 hover:text-ink-300"
                  >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-display font-semibold text-ink-400 uppercase tracking-wider mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-500" />
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className="input-field pl-11 pr-11"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-500 hover:text-ink-300"
                  >
                    {showConfirmPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400 font-body">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Resetting...
                  </>
                ) : (
                  <>
                    Reset Password <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
