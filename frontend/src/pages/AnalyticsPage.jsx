import { useState, useEffect } from 'react'
import { useTasks } from '../hooks/useTasks'
import Spinner from '../components/common/Spinner'

function DonutChart({ segments, size = 120, strokeWidth = 14 }) {
  const r = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  const cx = size / 2, cy = size / 2
  let offset = 0
  const total = segments.reduce((a, s) => a + s.value, 0)
  if (total === 0) {
    return (
      <svg width={size} height={size}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#2a2520" strokeWidth={strokeWidth} />
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fill="#7d7264" fontSize="13" fontWeight="bold">0</text>
      </svg>
    )
  }
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#2a2520" strokeWidth={strokeWidth} />
      {segments.map((seg, i) => {
        const pct = seg.value / total
        const dash = pct * circ
        const gap = circ - dash
        const el = (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={seg.color} strokeWidth={strokeWidth}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.6s ease' }}
          />
        )
        offset += dash
        return el
      })}
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central"
        fill="#e8e0d0" fontSize="18" fontWeight="bold"
        style={{ transform: 'rotate(90deg)', transformOrigin: `${cx}px ${cy}px` }}
      >
        {total}
      </text>
    </svg>
  )
}

function BarChart({ data, maxVal }) {
  return (
    <div className="flex items-end gap-2 h-32">
      {data.map(({ label, value, color }) => {
        const pct = maxVal > 0 ? (value / maxVal) * 100 : 0
        return (
          <div key={label} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-xs font-mono text-ink-400">{value}</span>
            <div className="w-full bg-ink-800 rounded-t-md overflow-hidden" style={{ height: '80px' }}>
              <div
                className="w-full rounded-t-md transition-all duration-700"
                style={{ height: `${pct}%`, background: color, marginTop: `${100 - pct}%` }}
              />
            </div>
            <span className="text-[10px] text-ink-600 font-mono">{label}</span>
          </div>
        )
      })}
    </div>
  )
}

export default function AnalyticsPage() {
  const { tasks, stats, loading, fetchTasks } = useTasks()
  const [allTasks, setAllTasks] = useState([])

  useEffect(() => { fetchTasks({ limit: 200 }) }, [])
  useEffect(() => { if (tasks.length) setAllTasks(tasks) }, [tasks])

  const total      = (stats.pending || 0) + (stats['in-progress'] || 0) + (stats.completed || 0)
  const completePct = total > 0 ? Math.round(((stats.completed || 0) / total) * 100) : 0

  const priorityCounts = { low: 0, medium: 0, high: 0 }
  allTasks.forEach(t => { if (priorityCounts[t.priority] !== undefined) priorityCounts[t.priority]++ })

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const label = d.toLocaleDateString('en-US', { weekday: 'short' })
    const dateStr = d.toISOString().split('T')[0]
    const value = allTasks.filter(t => t.createdAt?.startsWith(dateStr)).length
    return { label, value, color: '#f59e0b' }
  })
  const maxBar = Math.max(...last7Days.map(d => d.value), 1)

  const completedThisWeek = allTasks.filter(t => {
    if (t.status !== 'completed') return false
    const d = new Date(t.updatedAt || t.createdAt)
    const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7)
    return d >= weekAgo
  }).length

  const highPriorityPending = allTasks.filter(t => t.priority === 'high' && t.status !== 'completed').length

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="animate-fade-in space-y-6">

      {/* ── Summary cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Completion Rate', value: `${completePct}%`,          color: 'text-emerald-400', sub: `${stats.completed || 0} of ${total} done`       },
          { label: 'This Week',       value: completedThisWeek,           color: 'text-amber-400',   sub: 'tasks completed'                                  },
          { label: 'High Priority',   value: highPriorityPending,         color: 'text-rose-400',    sub: 'pending urgent tasks'                             },
          { label: 'In Flight',       value: stats['in-progress'] || 0,  color: 'text-blue-400',    sub: 'tasks in progress'                                },
        ].map(({ label, value, color, sub }) => (
          <div key={label} className="card p-5">
            <div className={`text-3xl font-black font-mono ${color} mb-1`}>{value}</div>
            <div className="text-ink-300 text-xs font-semibold">{label}</div>
            <div className="text-ink-600 text-xs mt-0.5">{sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Status donut ── */}
        <div className="card p-6">
          <h3 className="font-bold text-ink-100 mb-5 text-sm uppercase tracking-wider">Status Breakdown</h3>
          <div className="flex items-center gap-8">
            <DonutChart
              size={140}
              strokeWidth={16}
              segments={[
                { value: stats.completed     || 0, color: '#10b981' },
                { value: stats['in-progress'] || 0, color: '#3b82f6' },
                { value: stats.pending       || 0, color: '#f59e0b' },
              ]}
            />
            <div className="space-y-3 flex-1">
              {[
                { label: 'Completed',   value: stats.completed     || 0, color: 'bg-emerald-500' },
                { label: 'In Progress', value: stats['in-progress'] || 0, color: 'bg-blue-500'   },
                { label: 'Pending',     value: stats.pending       || 0, color: 'bg-amber-500'   },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                    <span className="text-sm text-ink-300">{label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono font-bold text-ink-100">{value}</span>
                    <span className="text-xs text-ink-600 font-mono w-8">
                      {total > 0 ? Math.round((value / total) * 100) : 0}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Priority breakdown ── */}
        <div className="card p-6">
          <h3 className="font-bold text-ink-100 mb-5 text-sm uppercase tracking-wider">Priority Breakdown</h3>
          <div className="flex items-center gap-8">
            <DonutChart
              size={140}
              strokeWidth={16}
              segments={[
                { value: priorityCounts.high,   color: '#f43f5e' },
                { value: priorityCounts.medium, color: '#f59e0b' },
                { value: priorityCounts.low,    color: '#6b7280' },
              ]}
            />
            <div className="space-y-3 flex-1">
              {[
                { label: 'High',   value: priorityCounts.high,   color: 'bg-rose-500'  },
                { label: 'Medium', value: priorityCounts.medium, color: 'bg-amber-500' },
                { label: 'Low',    value: priorityCounts.low,    color: 'bg-ink-500'   },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                    <span className="text-sm text-ink-300">{label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono font-bold text-ink-100">{value}</span>
                    <span className="text-xs text-ink-600 font-mono w-8">
                      {total > 0 ? Math.round((value / total) * 100) : 0}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Weekly activity bar ── */}
      <div className="card p-6">
        <h3 className="font-bold text-ink-100 mb-5 text-sm uppercase tracking-wider">Tasks Created — Last 7 Days</h3>
        <BarChart data={last7Days} maxVal={maxBar} />
      </div>

      {/* ── Recent tasks table ── */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-ink-800 flex items-center justify-between">
          <h3 className="font-bold text-ink-100 text-sm uppercase tracking-wider">Recent Tasks</h3>
          <span className="text-xs text-ink-500 font-mono">{allTasks.length} total</span>
        </div>
        {allTasks.length === 0 ? (
          <div className="py-12 text-center text-ink-500 text-sm">No tasks yet</div>
        ) : (
          <div className="divide-y divide-ink-800/50">
            {allTasks.slice(0, 8).map(task => (
              <div key={task._id} className="flex items-center gap-4 px-6 py-3 hover:bg-ink-800/30 transition-colors">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  task.status === 'completed' ? 'bg-emerald-500' :
                  task.status === 'in-progress' ? 'bg-blue-500' : 'bg-amber-500'
                }`} />
                <span className={`flex-1 text-sm text-ink-200 truncate ${task.status === 'completed' ? 'line-through text-ink-500' : ''}`}>
                  {task.title}
                </span>
                <span className={`text-xs font-mono badge-${task.priority} hidden sm:block`}>{task.priority}</span>
                <span className="text-xs text-ink-600 font-mono whitespace-nowrap">
                  {new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}