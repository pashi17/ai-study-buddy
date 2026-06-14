import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, BookOpen, Target, Zap } from 'lucide-react'
import Button from '../components/Button'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6">
      {/* Background orbs */}
      <div className="orb orb-blue w-[600px] h-[600px] top-[-100px] left-[-200px] opacity-60" />
      <div className="orb orb-purple w-[500px] h-[500px] bottom-[-100px] right-[-150px] opacity-40" />
      <div className="orb orb-teal w-[300px] h-[300px] top-[40%] right-[20%] opacity-30" />

      {/* Grid bg */}
      <div className="absolute inset-0 grid-bg opacity-10" />

      {/* Logo - Right Side */}
      <div className="absolute right-250 top-1/4 transform -translate-y-0/3 z-5 hidden lg:block">
        <div className="">
          <img 
            src="src/assest/concept-ai-machine-learning-artificial-intelligence-robot-learning-network-system-advance-ai-on-blue-futuristic-modern-hi-tech-background-vector-removebg-preview.png" 
            alt="AI Study Buddy Logo" 
            className="w-[1400px] h-[700px] opacity-65"
          />
        </div>
      </div>

       <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 tag tag-blue mb-8 text-sm py-2 px-4">
          <Sparkles size={13} />
          <span>AI-Powered EdTech · Built for Serious Learners</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-display font-extrabold text-white leading-[0.95] mb-6 tracking-tight">
          Study Smarter,{' '}
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-ink-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Not Harder
            </span>
            <svg className="absolute -bottom-2 left-0 w-full" height="6" viewBox="0 0 200 6" fill="none">
              <path d="M0 3 Q100 0 200 3" stroke="url(#grad)" strokeWidth="2" strokeLinecap="round" />
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#5c6fff" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
          </span>
        </h1>

        <p className="text-lg md:text-xl text-ink-300 font-body max-w-2xl mx-auto leading-relaxed mb-10">
          Upload your syllabus and get a personalized AI study plan, daily quizzes, weak topic tracking, and a 24/7 doubt-solving tutor — all in one place.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <Link to="/signup">
            <Button variant="primary" size="lg" className="group">
              Start Learning Free
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="secondary" size="lg">
              View Dashboard Demo
            </Button>
          </Link>
        </div>

        {/* Floating Stats */}
        <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto">
          {[
            { icon: BookOpen, label: 'Topics Covered', value: '10,000+' },
            { icon: Target, label: 'Avg Score Boost', value: '+28%' },
            { icon: Zap, label: 'Students Using', value: '50,000+' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="glass-card p-4 text-center hover:-translate-y-1 transition-transform duration-300">
              <Icon size={18} className="text-ink-400 mx-auto mb-2" />
              <div className="text-xl font-display font-bold text-white">{value}</div>
              <div className="text-xs text-ink-400 font-body mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <div className="w-5 h-8 rounded-full border border-ink-500 flex items-start justify-center p-1">
          <div className="w-1 h-2 rounded-full bg-ink-500 animate-bounce" />
        </div>
      </div>

      {/* Animation for floating logo */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

    </section>
  )
}