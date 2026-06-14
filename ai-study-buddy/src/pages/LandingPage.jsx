import { Link } from 'react-router-dom'
import Navbar from '../layout/Navbar'
import Footer from '../layout/Footer'
import HeroSection from '../components/HeroSection'
import FeatureCard from '../components/FeatureCard'
import { features, testimonials } from '../data/dummyData'
import { Upload, Brain, BarChart2, CheckCircle, Star, ArrowRight } from 'lucide-react'
import Button from '../components/Button'

const steps = [
  { step: '01', icon: Upload, title: 'Upload Your Syllabus', desc: 'Drop in any PDF or text-based syllabus. The AI parses every topic, subtopic, and objective automatically.' },
  { step: '02', icon: Brain, title: 'AI Builds Your Plan', desc: 'A personalized daily study schedule is generated based on your exam date, topic weights, and available time.' },
  { step: '03', icon: BarChart2, title: 'Study, Quiz & Track', desc: 'Follow the plan, take daily quizzes, and watch your weak areas transform into your strongest subjects.' },
]

const benefits = [
  'AI-personalized study plans that adapt every day',
  'Syllabus coverage tracking with completion heatmaps',
  'Daily micro-quizzes with difficulty scaling',
  'Weak topic identification & targeted revision',
  'Exam countdown with smart priority reshuffling',
  '24/7 AI tutor for instant doubt resolution',
  'Progress analytics and performance insights',
  'Multi-subject support for any curriculum',
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#060b1a] text-white overflow-x-hidden">
      <Navbar />
      <HeroSection />

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="tag tag-blue mb-4 inline-block">Features</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Everything you need to ace any exam
            </h2>
            <p className="text-ink-300 font-body text-lg max-w-xl mx-auto">
              Powerful tools built specifically for students preparing for competitive and academic exams.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => <FeatureCard key={i} {...f} />)}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6 relative">
        <div className="orb orb-blue w-[400px] h-[400px] left-[-100px] top-[50%] opacity-20" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <span className="tag tag-blue mb-4 inline-block">How it Works</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              From syllabus to success in 3 steps
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map(({ step, icon: Icon, title, desc }, i) => (
              <div key={i} className="glass-card p-7 group hover:-translate-y-1 transition-all duration-300 hover:border-ink-500/40">
                <div className="flex items-start justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-ink-600/20 flex items-center justify-center group-hover:bg-ink-600/30 transition-colors">
                    <Icon size={22} className="text-ink-400" />
                  </div>
                  <span className="font-display font-black text-5xl text-ink-800 group-hover:text-ink-700 transition-colors">{step}</span>
                </div>
                <h3 className="text-lg font-display font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-ink-300 font-body leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="tag tag-green mb-5 inline-block">Benefits</span>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">
                Built to help you{' '}
                <span className="text-sage-400">actually learn</span>
              </h2>
              <p className="text-ink-300 font-body text-lg leading-relaxed mb-8">
                Unlike generic study apps, AI Study Buddy understands your exact syllabus and builds a preparation strategy that works — not one that looks good on paper.
              </p>
              <div className="grid grid-cols-1 gap-3">
                {benefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm font-body text-ink-200">
                    <CheckCircle size={16} className="text-sage-500 flex-shrink-0" />
                    {b}
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-card p-6 relative overflow-hidden">
              <div className="orb orb-blue w-[200px] h-[200px] right-[-50px] bottom-[-50px] opacity-30" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs text-ink-400 font-body mb-1">Week 3 Progress</p>
                    <p className="text-2xl font-display font-bold text-white">72% Complete</p>
                  </div>
                  <span className="tag tag-green">On Track ✓</span>
                </div>
                <div className="space-y-4">
                  {[
                    { subject: 'Data Structures', pct: 88 },
                    { subject: 'Operating Systems', pct: 65 },
                    { subject: 'Algorithms', pct: 74 },
                    { subject: 'DBMS', pct: 58 },
                    { subject: 'Computer Networks', pct: 70 },
                  ].map(({ subject, pct }) => (
                    <div key={subject}>
                      <div className="flex justify-between text-xs font-body mb-1.5">
                        <span className="text-ink-300">{subject}</span>
                        <span className="text-ink-400">{pct}%</span>
                      </div>
                      <div className="progress-track h-2">
                        <div className="progress-fill h-2" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="tag tag-amber mb-4 inline-block">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Students who leveled up
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <div key={i} className="glass-card p-6 hover:-translate-y-1 transition-all duration-300 hover:border-ink-500/30">
                <div className="flex items-center gap-1 mb-5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-ink-200 font-body leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ink-500 to-purple-600 flex items-center justify-center text-white text-sm font-display font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-display font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-ink-400 font-body">{t.role}</p>
                  </div>
                  <span className="ml-auto tag tag-green text-[10px]">{t.improvement}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-card p-12 relative overflow-hidden">
            <div className="orb orb-blue w-[300px] h-[300px] top-[-100px] left-[-100px] opacity-30" />
            <div className="orb orb-purple w-[300px] h-[300px] bottom-[-100px] right-[-100px] opacity-20" />
            <div className="relative z-10">
              <span className="tag tag-blue mb-5 inline-block">Get Started Today</span>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-5 leading-tight">
                Your next exam is your <span className="text-ink-400">best one yet</span>
              </h2>
              <p className="text-ink-300 font-body text-lg mb-8">
                Join 50,000+ students already using AI Study Buddy to prepare smarter.
              </p>
              <Link to="/signup">
                <Button variant="primary" size="lg" className="group">
                  Start for Free — No Card Needed
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
