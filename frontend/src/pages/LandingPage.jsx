import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const FEATURES = [
  {
    icon: '⬡',
    title: 'Capture Everything',
    desc: 'Dump tasks fast. Title, description, priority — no friction, no forms in your way.'
  },
  {
    icon: '◈',
    title: 'Filter & Focus',
    desc: 'Slice by status or priority. Search across everything instantly. See only what matters now.'
  },
  {
    icon: '◎',
    title: 'Track Progress',
    desc: 'Pending → In Progress → Done. Live stats show exactly where your work stands.'
  },
  {
    icon: '⊕',
    title: 'Your Profile',
    desc: 'Personal workspace. Edit your name, bio, and password. Everything tied to your account.'
  }
]

const TICKER_ITEMS = [
  'CAPTURE TASKS', 'TRACK PROGRESS', 'STAY FOCUSED', 'SHIP FASTER',
  'ZERO CLUTTER', 'FULL CONTROL', 'BUILT FOR WORK'
]

function AnimatedCounter({ target, duration = 1500 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const start = performance.now()
        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1)
          const ease = 1 - Math.pow(1 - progress, 3)
          setCount(Math.floor(ease * target))
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.5 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])

  return <span ref={ref}>{count.toLocaleString()}</span>
}

export default function LandingPage() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const tickerRef = useRef(null)

  // If already logged in, go to dashboard
  useEffect(() => {
    if (token) navigate('/dashboard', { replace: true })
  }, [token, navigate])

  return (
    <div className="min-h-screen bg-[#0c0a08] text-[#e8e0d0] font-sans overflow-x-hidden">

      {/* ── Ambient background ── */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-0 w-[400px] h-[400px] bg-amber-600/4 rounded-full blur-[100px]" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#e8e0d0 1px, transparent 1px), linear-gradient(90deg, #e8e0d0 1px, transparent 1px)',
            backgroundSize: '80px 80px'
          }}
        />
      </div>

      {/* ── Nav ── */}
      <nav className="relative z-20 flex items-center justify-between px-6 lg:px-12 py-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-[#0c0a08] font-black text-sm">
            TF
          </div>
          <span className="font-black text-xl tracking-tight">TaskFlow</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-medium text-[#9a8f7c] hover:text-[#e8e0d0] transition-colors px-4 py-2"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-[#0c0a08] px-5 py-2 rounded-lg transition-all duration-200 active:scale-95"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative z-10 px-6 lg:px-12 pt-24 pb-20 max-w-6xl mx-auto">
        {/* Eyebrow */}
        <div
          className="inline-flex items-center gap-2 border border-amber-500/25 bg-amber-500/8 rounded-full px-4 py-1.5 mb-8"
          style={{ animation: 'fadeSlideUp 0.5s ease both' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-amber-400 text-xs font-mono tracking-widest uppercase">
            Free to use · No credit card
          </span>
        </div>

        {/* Headline */}
        <h1
          className="text-[clamp(3rem,8vw,7rem)] font-black leading-[0.9] tracking-tight mb-8"
          style={{ animation: 'fadeSlideUp 0.5s 0.1s ease both' }}
        >
          <span className="block text-[#e8e0d0]">Work without</span>
          <span className="block relative">
            <span className="text-amber-500">the noise.</span>
          </span>
        </h1>

        <p
          className="text-[#9a8f7c] text-lg lg:text-xl max-w-xl leading-relaxed mb-12"
          style={{ animation: 'fadeSlideUp 0.5s 0.2s ease both' }}
        >
          TaskFlow is a focused task manager for people who need to get things done —
          not spend time configuring tools.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-wrap gap-4 items-center"
          style={{ animation: 'fadeSlideUp 0.5s 0.3s ease both' }}
        >
          <Link
            to="/register"
            className="group flex items-center gap-3 bg-amber-500 hover:bg-amber-400 text-[#0c0a08] font-bold px-8 py-4 rounded-xl transition-all duration-200 active:scale-95 text-base"
          >
            Start for free
            <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
          </Link>
          <Link
            to="/login"
            className="flex items-center gap-2 border border-white/10 hover:border-white/20 text-[#9a8f7c] hover:text-[#e8e0d0] font-medium px-8 py-4 rounded-xl transition-all duration-200 text-base"
          >
            Sign in
          </Link>
        </div>

        {/* Social proof */}
        <div
          className="mt-14 flex items-center gap-6 flex-wrap"
          style={{ animation: 'fadeSlideUp 0.5s 0.4s ease both' }}
        >
          <div className="flex -space-x-2">
            {['#d97706','#b45309','#92400e','#78350f'].map((c, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-[#0c0a08] flex items-center justify-center text-[#0c0a08] text-xs font-bold"
                style={{ background: c }}
              >
                {['J','S','A','M'][i]}
              </div>
            ))}
          </div>
          <p className="text-sm text-[#7d7264]">
            Join <span className="text-amber-400 font-semibold">2,400+</span> people already using TaskFlow
          </p>
        </div>
      </section>

      {/* ── Ticker ── */}
      <div className="relative z-10 border-y border-white/5 py-4 overflow-hidden bg-white/[0.02]">
        <div
          ref={tickerRef}
          className="flex gap-12 whitespace-nowrap"
          style={{ animation: 'ticker 20s linear infinite' }}
        >
          {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="flex items-center gap-4 text-xs font-mono tracking-widest text-[#504942] uppercase">
              <span className="text-amber-500/50">◆</span>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── Dashboard preview ── */}
      <section className="relative z-10 px-6 lg:px-12 py-20 max-w-6xl mx-auto">
        <div className="relative rounded-2xl overflow-hidden border border-white/8 shadow-2xl shadow-black/50">
          {/* Fake browser chrome */}
          <div className="bg-[#161310] border-b border-white/8 px-4 py-3 flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500/60" />
              <div className="w-3 h-3 rounded-full bg-amber-500/60" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
            </div>
            <div className="flex-1 bg-[#0c0a08] rounded-md px-3 py-1 text-xs text-[#504942] font-mono text-center max-w-xs mx-auto">
              app.taskflow.io/dashboard
            </div>
          </div>

          {/* Dashboard mockup */}
          <div className="bg-[#0e0b09] p-0 flex min-h-[380px]">
            {/* Sidebar */}
            <div className="w-48 bg-[#0c0a08] border-r border-white/5 p-4 flex flex-col gap-1 hidden sm:flex">
              <div className="flex items-center gap-2 px-3 py-2 mb-3">
                <div className="w-6 h-6 bg-amber-500 rounded text-[#0c0a08] font-black text-xs flex items-center justify-center">TF</div>
                <span className="text-xs font-black text-[#e8e0d0]">TaskFlow</span>
              </div>
              {['Dashboard', 'Profile'].map((item, i) => (
                <div key={i} className={`px-3 py-2 rounded-lg text-xs ${i === 0 ? 'bg-amber-500/15 text-amber-400' : 'text-[#504942]'}`}>
                  {item}
                </div>
              ))}
            </div>

            {/* Main */}
            <div className="flex-1 p-5 space-y-4 overflow-hidden">
              {/* Stats row */}
              <div className="grid grid-cols-4 gap-3">
                {[['12', 'Total'], ['5', 'Pending'], ['3', 'In Progress'], ['4', 'Done']].map(([n, l], i) => (
                  <div key={i} className="bg-[#161310] border border-white/5 rounded-lg p-3">
                    <div className={`text-xl font-black font-mono ${['text-[#e8e0d0]','text-amber-400','text-blue-400','text-emerald-400'][i]}`}>{n}</div>
                    <div className="text-[10px] text-[#504942] mt-0.5">{l}</div>
                  </div>
                ))}
              </div>
              {/* Task cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { title: 'Design new dashboard UI', status: 'in-progress', priority: 'high' },
                  { title: 'Write API documentation', status: 'pending', priority: 'medium' },
                  { title: 'Set up CI/CD pipeline', status: 'completed', priority: 'high' },
                  { title: 'User interview sessions', status: 'pending', priority: 'low' },
                  { title: 'Fix auth token refresh', status: 'in-progress', priority: 'high' },
                  { title: 'Update dependencies', status: 'completed', priority: 'low' },
                ].map((task, i) => (
                  <div key={i} className={`bg-[#161310] border border-white/5 rounded-lg p-3 ${task.status === 'completed' ? 'opacity-50' : ''}`}>
                    <div className={`text-xs font-medium mb-2 ${task.status === 'completed' ? 'line-through text-[#504942]' : 'text-[#e8e0d0]'}`}>{task.title}</div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full border ${
                        task.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        task.status === 'in-progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                        {task.status}
                      </span>
                      <span className={`text-[10px] font-mono ${task.priority === 'high' ? 'text-rose-400' : task.priority === 'medium' ? 'text-amber-400' : 'text-[#504942]'}`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Gradient overlay bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0c0a08] to-transparent pointer-events-none" />
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="relative z-10 px-6 lg:px-12 py-16 max-w-6xl mx-auto">
        <div className="grid grid-cols-3 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
          {[
            { value: 2400, suffix: '+', label: 'Active users' },
            { value: 48000, suffix: '+', label: 'Tasks completed' },
            { value: 99, suffix: '%', label: 'Uptime' }
          ].map(({ value, suffix, label }, i) => (
            <div key={i} className="bg-[#0e0b09] px-8 py-10 text-center">
              <div className="text-4xl lg:text-5xl font-black font-mono text-amber-500 mb-2">
                <AnimatedCounter target={value} />{suffix}
              </div>
              <div className="text-sm text-[#7d7264]">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="relative z-10 px-6 lg:px-12 py-16 max-w-6xl mx-auto">
        <div className="mb-12">
          <p className="text-xs font-mono text-amber-500/70 tracking-widest uppercase mb-3">What's inside</p>
          <h2 className="text-3xl lg:text-4xl font-black text-[#e8e0d0] max-w-md leading-tight">
            Everything you need, nothing you don't.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="group bg-[#0e0b09] border border-white/5 hover:border-amber-500/20 rounded-xl p-6 transition-all duration-300 hover:bg-[#121008]"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="text-2xl text-amber-500 mb-4 group-hover:scale-110 transition-transform duration-200 inline-block">
                {f.icon}
              </div>
              <h3 className="font-bold text-[#e8e0d0] mb-2 text-sm">{f.title}</h3>
              <p className="text-xs text-[#7d7264] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="relative z-10 px-6 lg:px-12 py-16 max-w-6xl mx-auto">
        <div className="relative rounded-2xl border border-amber-500/15 bg-amber-500/5 overflow-hidden px-8 lg:px-16 py-14 text-center">
          {/* glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-24 bg-amber-500/15 blur-3xl rounded-full" />

          <p className="text-xs font-mono text-amber-500/70 tracking-widest uppercase mb-4 relative">Ready to start?</p>
          <h2 className="text-3xl lg:text-5xl font-black text-[#e8e0d0] mb-4 relative">
            Your tasks are waiting.
          </h2>
          <p className="text-[#9a8f7c] mb-10 max-w-md mx-auto relative">
            Create a free account and start organizing your work in under 60 seconds.
          </p>
          <div className="flex flex-wrap gap-4 justify-center relative">
            <Link
              to="/register"
              className="group flex items-center gap-3 bg-amber-500 hover:bg-amber-400 text-[#0c0a08] font-bold px-8 py-4 rounded-xl transition-all duration-200 active:scale-95"
            >
              Create free account
              <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-2 border border-white/10 hover:border-white/20 text-[#9a8f7c] hover:text-[#e8e0d0] font-medium px-8 py-4 rounded-xl transition-all duration-200"
            >
              Already have an account
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/5 px-6 lg:px-12 py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-amber-500 rounded flex items-center justify-center text-[#0c0a08] font-black text-xs">TF</div>
            <span className="text-sm font-bold text-[#e8e0d0]">TaskFlow</span>
          </div>
          <p className="text-xs text-[#504942] font-mono">
            Built with React · Express · MongoDB
          </p>
          <div className="flex gap-6">
            <Link to="/login" className="text-xs text-[#504942] hover:text-[#e8e0d0] transition-colors">Sign In</Link>
            <Link to="/register" className="text-xs text-[#504942] hover:text-[#e8e0d0] transition-colors">Register</Link>
          </div>
        </div>
      </footer>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.33%); }
        }
      `}</style>
    </div>
  )
}
