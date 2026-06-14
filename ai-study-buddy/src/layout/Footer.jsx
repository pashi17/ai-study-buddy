import { Brain, Github, Twitter, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-ink-600/20 bg-ink-950/60 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-ink-500 to-ink-700 flex items-center justify-center">
                <Brain size={18} className="text-white" />
              </div>
              <span className="font-display font-bold text-white text-lg">
                Study<span className="text-ink-400">Buddy</span>
              </span>
            </div>
            <p className="text-sm text-ink-400 font-body leading-relaxed max-w-xs">
              AI-powered personalized learning that adapts to your syllabus, pace, and goals. Smarter prep, better results.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {[Github, Twitter, Mail].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-xl bg-white/5 border border-ink-600/20 flex items-center justify-center text-ink-400 hover:text-white hover:bg-white/10 transition-colors">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-display font-bold text-ink-400 uppercase tracking-widest mb-4">Product</p>
            <ul className="space-y-2.5">
              {['Features', 'How it Works', 'Pricing', 'Changelog'].map(l => (
                <li key={l}><a href="#" className="text-sm text-ink-400 hover:text-white transition-colors font-body">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-display font-bold text-ink-400 uppercase tracking-widest mb-4">Company</p>
            <ul className="space-y-2.5">
              {['About', 'Blog', 'Careers', 'Contact'].map(l => (
                <li key={l}><a href="#" className="text-sm text-ink-400 hover:text-white transition-colors font-body">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-ink-600/20 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-ink-500 font-body">© 2025 AI Study Buddy · Team Pashi17. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {['Privacy Policy', 'Terms of Service'].map(l => (
              <a key={l} href="#" className="text-xs text-ink-500 hover:text-ink-300 transition-colors font-body">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
