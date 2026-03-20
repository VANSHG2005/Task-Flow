import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const FEATURES = [
  { icon: '▦', title: 'Grid, Kanban & List', desc: 'Switch between three view modes to see your tasks exactly how you think.' },
  { icon: '◈', title: 'Analytics Dashboard', desc: 'Visual breakdowns by status and priority. See completion rates at a glance.' },
  { icon: '◎', title: 'Smart Filtering', desc: 'Search, filter by status or priority. Find any task in under a second.' },
  { icon: '⊙', title: 'Full Profile Control', desc: 'Avatar colors, bio, password management, and account settings all in one place.' },
  { icon: '⬡', title: 'Progress Tracking', desc: 'Live progress bar shows your completion rate across all tasks.' },
  { icon: '⊕', title: 'Priority System', desc: 'Flag tasks as high, medium or low. Filter urgent items instantly.' },
]

const TICKER_ITEMS = ['GRID VIEW', 'KANBAN BOARD', 'ANALYTICS', 'TASK FILTERS', 'PROGRESS TRACKING', 'PRIORITY FLAGS', 'DARK THEME']

function AnimatedCounter({ target, duration = 1600 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true
        const start = performance.now()
        const tick = (now) => {
          const p = Math.min((now - start) / duration, 1)
          setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [target, duration])
  return <span ref={ref}>{count.toLocaleString()}</span>
}

export default function LandingPage() {
  const { token } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (token) navigate('/dashboard', { replace: true })
  }, [token, navigate])

  return (
    <div className="min-h-screen bg-[#0c0a08] text-[#e8e0d0] font-sans overflow-x-hidden">

      {/* ── Background ── */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[700px] h-[700px] bg-amber-500/4 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-600/3 rounded-full blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: 'linear-gradient(#e8e0d0 1px, transparent 1px), linear-gradient(90deg, #e8e0d0 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }} />
      </div>

      {/* ── Navbar ── */}
      <nav className="relative z-20 flex items-center justify-between px-6 lg:px-14 py-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-[#0c0a08] font-black text-sm">TF</div>
          <span className="font-black text-xl tracking-tight">TaskFlow</span>
        </div>
        <div className="hidden sm:flex items-center gap-6 text-sm text-[#7d7264]">
          <a href="#features" className="hover:text-[#e8e0d0] transition-colors">Features</a>
          <a href="#stats"    className="hover:text-[#e8e0d0] transition-colors">Stats</a>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login"    className="text-sm font-medium text-[#9a8f7c] hover:text-[#e8e0d0] transition-colors px-4 py-2">Sign In</Link>
          <Link to="/register" className="text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-[#0c0a08] px-5 py-2 rounded-lg transition-all duration-200 active:scale-95">Get Started</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative z-10 px-6 lg:px-14 pt-24 pb-16 max-w-7xl mx-auto">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 border border-amber-500/25 bg-amber-500/8 rounded-full px-4 py-1.5 mb-8"
            style={{ animation: 'fadeSlideUp 0.5s ease both' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-amber-400 text-xs font-mono tracking-widest uppercase">Free forever · No credit card</span>
          </div>

          <h1 className="text-[clamp(3rem,8vw,6.5rem)] font-black leading-[0.88] tracking-tight mb-8"
            style={{ animation: 'fadeSlideUp 0.5s 0.1s ease both' }}>
            <span className="block text-[#e8e0d0]">Work without</span>
            <span className="block text-amber-500">the noise.</span>
          </h1>

          <p className="text-[#9a8f7c] text-lg lg:text-xl max-w-xl leading-relaxed mb-10"
            style={{ animation: 'fadeSlideUp 0.5s 0.2s ease both' }}>
            TaskFlow gives you three ways to view your work — grid, kanban, or list — with built-in analytics, priority tracking, and a profile you actually want to use.
          </p>

          <div className="flex flex-wrap gap-4 items-center" style={{ animation: 'fadeSlideUp 0.5s 0.3s ease both' }}>
            <Link to="/register" className="group flex items-center gap-3 bg-amber-500 hover:bg-amber-400 text-[#0c0a08] font-bold px-8 py-4 rounded-xl transition-all duration-200 active:scale-95 text-base">
              Start for free
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link to="/login" className="flex items-center gap-2 border border-white/10 hover:border-white/25 text-[#9a8f7c] hover:text-[#e8e0d0] font-medium px-8 py-4 rounded-xl transition-all text-base">
              Sign in
            </Link>
          </div>

          <div className="mt-12 flex items-center gap-5 flex-wrap" style={{ animation: 'fadeSlideUp 0.5s 0.4s ease both' }}>
            <div className="flex -space-x-2">
              {['#d97706','#b45309','#92400e','#78350f'].map((c, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0c0a08] flex items-center justify-center text-[#0c0a08] text-xs font-bold" style={{ background: c }}>
                  {['J','A','S','M'][i]}
                </div>
              ))}
            </div>
            <p className="text-sm text-[#7d7264]">
              Join <span className="text-amber-400 font-semibold">2,400+</span> focused workers
            </p>
          </div>
        </div>
      </section>

      {/* ── Ticker ── */}
      <div className="relative z-10 border-y border-white/5 py-3.5 overflow-hidden bg-white/[0.02]">
        <div className="flex gap-10 whitespace-nowrap" style={{ animation: 'ticker 22s linear infinite' }}>
          {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="flex items-center gap-4 text-xs font-mono tracking-widest text-[#3d3832] uppercase">
              <span className="text-amber-500/40">◆</span>{item}
            </span>
          ))}
        </div>
      </div>

      {/* ── App preview ── */}
      <section className="relative z-10 px-6 lg:px-14 py-20 max-w-7xl mx-auto">
        <div className="relative rounded-2xl overflow-hidden border border-white/8 shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
          <div className="bg-[#161310] border-b border-white/8 px-4 py-3 flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500/60" />
              <div className="w-3 h-3 rounded-full bg-amber-500/60" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
            </div>
            <div className="flex-1 bg-[#0c0a08] rounded-md px-3 py-1 text-xs text-[#504942] font-mono text-center max-w-xs mx-auto">
              app.taskflow.io/dashboard
            </div>
            <div className="hidden sm:flex gap-1">
              {['▦','⊟','≡'].map(v => (
                <div key={v} className="w-7 h-6 bg-ink-800/60 rounded text-[10px] text-[#504942] flex items-center justify-center">{v}</div>
              ))}
            </div>
          </div>
          <div className="bg-[#0e0b09] flex min-h-[420px]">
            <div className="w-52 bg-[#0c0a08] border-r border-white/5 p-4 hidden sm:flex flex-col gap-1">
              <div className="flex items-center gap-2 px-3 py-2 mb-4">
                <div className="w-6 h-6 bg-amber-500 rounded text-[#0c0a08] font-black text-xs flex items-center justify-center">TF</div>
                <span className="text-xs font-black text-[#e8e0d0]">TaskFlow</span>
              </div>
              {[['▦','Dashboard',true],['◈','Analytics',false],['◎','Profile',false],['⊙','Settings',false]].map(([icon,label,active]) => (
                <div key={label} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${active ? 'bg-amber-500/15 text-amber-400' : 'text-[#504942]'}`}>
                  <span>{icon}</span>{label}
                </div>
              ))}
            </div>
            <div className="flex-1 p-5 space-y-4 overflow-hidden">
              <div className="grid grid-cols-4 gap-3">
                {[['12','Total','text-[#e8e0d0]'],['5','Pending','text-amber-400'],['3','In Progress','text-blue-400'],['4','Done','text-emerald-400']].map(([n,l,c]) => (
                  <div key={l} className="bg-[#161310] border border-white/5 rounded-xl p-3">
                    <div className={`text-xl font-black font-mono ${c}`}>{n}</div>
                    <div className="text-[10px] text-[#504942] mt-0.5">{l}</div>
                  </div>
                ))}
              </div>
              <div className="bg-[#161310] border border-white/5 rounded-xl p-3">
                <div className="flex justify-between text-[10px] text-[#504942] mb-2"><span>Overall Progress</span><span className="text-emerald-400 font-mono">33%</span></div>
                <div className="h-2 bg-[#0c0a08] rounded-full overflow-hidden flex gap-0.5">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '33%' }} />
                  <div className="h-full bg-blue-500 rounded-full"    style={{ width: '25%' }} />
                  <div className="h-full bg-amber-500 rounded-full"   style={{ width: '42%' }} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { title: 'Design dashboard UI', s: 'in-progress', p: 'high' },
                  { title: 'Write API docs',       s: 'pending',     p: 'medium' },
                  { title: 'Set up CI/CD',         s: 'completed',   p: 'high' },
                  { title: 'User interviews',      s: 'pending',     p: 'low' },
                  { title: 'Fix auth refresh',     s: 'in-progress', p: 'high' },
                  { title: 'Update packages',      s: 'completed',   p: 'low' },
                ].map((task, i) => (
                  <div key={i} className={`bg-[#161310] border border-white/5 rounded-xl p-3 ${task.s === 'completed' ? 'opacity-40' : ''}`}>
                    <div className={`text-xs font-medium mb-2 ${task.s === 'completed' ? 'line-through text-[#504942]' : 'text-[#e8e0d0]'}`}>{task.title}</div>
                    <div className="flex gap-1.5">
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full border ${task.s === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : task.s === 'in-progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>{task.s}</span>
                      <span className={`text-[9px] font-mono ${task.p === 'high' ? 'text-rose-400' : task.p === 'medium' ? 'text-amber-400' : 'text-[#504942]'}`}>{task.p}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0c0a08] to-transparent pointer-events-none" />
        </div>
      </section>

      {/* ── Stats ── */}
      <section id="stats" className="relative z-10 px-6 lg:px-14 py-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-3 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
          {[
            { value: 2400,  suffix: '+', label: 'Active users'     },
            { value: 48000, suffix: '+', label: 'Tasks completed'  },
            { value: 99,    suffix: '%', label: 'Uptime'           },
          ].map(({ value, suffix, label }) => (
            <div key={label} className="bg-[#0e0b09] px-6 py-10 text-center">
              <div className="text-4xl lg:text-5xl font-black font-mono text-amber-500 mb-2">
                <AnimatedCounter target={value} />{suffix}
              </div>
              <div className="text-sm text-[#7d7264]">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="relative z-10 px-6 lg:px-14 py-16 max-w-7xl mx-auto">
        <div className="mb-12">
          <p className="text-xs font-mono text-amber-500/70 tracking-widest uppercase mb-3">What you get</p>
          <h2 className="text-3xl lg:text-4xl font-black text-[#e8e0d0] max-w-lg leading-tight">
            Every feature you need. Nothing you don't.
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <div key={i} className="group bg-[#0e0b09] border border-white/5 hover:border-amber-500/20 rounded-xl p-6 transition-all duration-300 hover:bg-[#121008]">
              <div className="text-2xl text-amber-500 mb-4 group-hover:scale-110 transition-transform inline-block">{f.icon}</div>
              <h3 className="font-bold text-[#e8e0d0] mb-2 text-sm">{f.title}</h3>
              <p className="text-xs text-[#7d7264] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 px-6 lg:px-14 py-16 max-w-7xl mx-auto">
        <div className="relative rounded-2xl border border-amber-500/15 bg-amber-500/5 overflow-hidden px-8 lg:px-16 py-14 text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-24 bg-amber-500/15 blur-3xl rounded-full" />
          <p className="text-xs font-mono text-amber-500/60 tracking-widest uppercase mb-4 relative">Get started today</p>
          <h2 className="text-3xl lg:text-5xl font-black text-[#e8e0d0] mb-4 relative">Your tasks are waiting.</h2>
          <p className="text-[#9a8f7c] mb-10 max-w-md mx-auto relative">Free account. No credit card. Up and running in 60 seconds.</p>
          <div className="flex flex-wrap gap-4 justify-center relative">
            <Link to="/register" className="group flex items-center gap-3 bg-amber-500 hover:bg-amber-400 text-[#0c0a08] font-bold px-8 py-4 rounded-xl transition-all active:scale-95">
              Create free account <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link to="/login" className="flex items-center gap-2 border border-white/10 hover:border-white/20 text-[#9a8f7c] hover:text-[#e8e0d0] font-medium px-8 py-4 rounded-xl transition-all">
              Already have an account
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/5 px-6 lg:px-14 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-amber-500 rounded flex items-center justify-center text-[#0c0a08] font-black text-xs">TF</div>
            <span className="text-sm font-bold text-[#e8e0d0]">TaskFlow</span>
          </div>
          <p className="text-xs text-[#3d3832] font-mono">React · Express · MongoDB · JWT</p>
          <div className="flex gap-6">
            <Link to="/login"    className="text-xs text-[#504942] hover:text-[#e8e0d0] transition-colors">Sign In</Link>
            <Link to="/register" className="text-xs text-[#504942] hover:text-[#e8e0d0] transition-colors">Register</Link>
          </div>
        </div>
      </footer>

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