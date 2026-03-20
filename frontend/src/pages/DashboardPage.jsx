import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTasks } from '../hooks/useTasks'
import TaskCard from '../components/tasks/TaskCard'
import TaskForm from '../components/tasks/TaskForm'
import TaskFilters from '../components/tasks/TaskFilters'
import Modal from '../components/common/Modal'
import EmptyState from '../components/common/EmptyState'
import Spinner from '../components/common/Spinner'
import toast from 'react-hot-toast'

function StatCard({ label, value, color, icon, change }) {
  const colors = {
    amber:   { text: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/20'   },
    blue:    { text: 'text-blue-400',    bg: 'bg-blue-500/10',    border: 'border-blue-500/20'    },
    emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    ink:     { text: 'text-ink-300',     bg: 'bg-ink-800/50',     border: 'border-ink-700'        },
  }
  const c = colors[color] || colors.ink
  return (
    <div className={`card p-5 border ${c.border} hover:scale-[1.02] transition-transform duration-200`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 ${c.bg} ${c.border} border rounded-lg flex items-center justify-center text-base`}>{icon}</div>
        {change !== undefined && (
          <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${change >= 0 ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <div className={`text-3xl font-black font-mono ${c.text} mb-1`}>{value}</div>
      <div className="text-ink-500 text-xs">{label}</div>
    </div>
  )
}

function ProgressBar({ stats }) {
  const total = (stats.pending || 0) + (stats['in-progress'] || 0) + (stats.completed || 0)
  if (total === 0) return null
  const pct = {
    completed:   Math.round(((stats.completed   || 0) / total) * 100),
    inProgress:  Math.round(((stats['in-progress'] || 0) / total) * 100),
    pending:     Math.round(((stats.pending     || 0) / total) * 100),
  }
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-ink-200">Overall Progress</span>
        <span className="text-2xl font-black font-mono text-emerald-400">{pct.completed}%</span>
      </div>
      <div className="flex h-2.5 rounded-full overflow-hidden gap-0.5 bg-ink-800">
        {pct.completed  > 0 && <div className="bg-emerald-500 rounded-full transition-all duration-700" style={{ width: `${pct.completed}%` }} />}
        {pct.inProgress > 0 && <div className="bg-blue-500 rounded-full transition-all duration-700"    style={{ width: `${pct.inProgress}%` }} />}
        {pct.pending    > 0 && <div className="bg-amber-500 rounded-full transition-all duration-700"   style={{ width: `${pct.pending}%` }} />}
      </div>
      <div className="flex gap-4 mt-3">
        {[
          { color: 'bg-emerald-500', label: 'Done',        val: stats.completed     || 0 },
          { color: 'bg-blue-500',    label: 'In Progress',  val: stats['in-progress'] || 0 },
          { color: 'bg-amber-500',   label: 'Pending',      val: stats.pending       || 0 },
        ].map(({ color, label, val }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${color}`} />
            <span className="text-xs text-ink-500">{label} <span className="text-ink-300 font-mono">{val}</span></span>
          </div>
        ))}
      </div>
    </div>
  )
}

function KanbanColumn({ title, tasks, color, onEdit, onDelete, onStatusChange, onAddNew }) {
  const colors = {
    amber:   'border-amber-500/30 text-amber-400',
    blue:    'border-blue-500/30 text-blue-400',
    emerald: 'border-emerald-500/30 text-emerald-400',
  }
  return (
    <div className="flex-1 min-w-[260px]">
      <div className={`flex items-center justify-between mb-3 pb-2 border-b ${colors[color]}`}>
        <span className="text-sm font-bold uppercase tracking-wider">{title}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-ink-800 px-2 py-0.5 rounded-full text-ink-400">{tasks.length}</span>
          {onAddNew && (
            <button onClick={onAddNew} className="w-5 h-5 rounded flex items-center justify-center text-ink-500 hover:text-amber-400 hover:bg-ink-800 transition-colors text-sm">+</button>
          )}
        </div>
      </div>
      <div className="space-y-3 min-h-[100px]">
        {tasks.map(task => (
          <TaskCard key={task._id} task={task} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />
        ))}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { tasks, stats, pagination, loading, fetchTasks, createTask, updateTask, deleteTask } = useTasks()

  const [search, setSearch]             = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewMode, setViewMode]         = useState('grid')   // 'grid' | 'kanban' | 'list'
  const [modalOpen, setModalOpen]       = useState(false)
  const [editingTask, setEditingTask]   = useState(null)
  const [submitting, setSubmitting]     = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [initialStatus, setInitialStatus]     = useState('pending')

  useEffect(() => {
    const t = setTimeout(() => fetchTasks({ search, status: statusFilter }), 300)
    return () => clearTimeout(t)
  }, [search, statusFilter, fetchTasks])

  const handleCreate = (status = 'pending') => {
    setEditingTask(null)
    setInitialStatus(status)
    setModalOpen(true)
  }

  const handleSubmit = async (formData) => {
    setSubmitting(true)
    try {
      if (editingTask) await updateTask(editingTask._id, formData)
      else             await createTask(formData)
      setModalOpen(false)
      fetchTasks({ search, status: statusFilter })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save task')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteTask(id)
      fetchTasks({ search, status: statusFilter })
      setDeleteConfirmId(null)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete')
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateTask(id, { status: newStatus })
      fetchTasks({ search, status: statusFilter })
    } catch { toast.error('Failed to update') }
  }

  const handleEdit = (task) => { setEditingTask(task); setModalOpen(true) }

  const totalTasks    = (stats.pending || 0) + (stats['in-progress'] || 0) + (stats.completed || 0)
  const remaining     = (stats.pending || 0) + (stats['in-progress'] || 0)
  const completionPct = totalTasks > 0 ? Math.round(((stats.completed || 0) / totalTasks) * 100) : 0

  const pendingTasks    = tasks.filter(t => t.status === 'pending')
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress')
  const completedTasks  = tasks.filter(t => t.status === 'completed')

  const greetingHour = new Date().getHours()
  const greeting = greetingHour < 12 ? 'Good morning' : greetingHour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="animate-fade-in space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-ink-50">
            {greeting}, {user?.name?.split(' ')[0]} 👋
          </h2>
          <p className="text-ink-500 text-sm mt-0.5">
            {totalTasks === 0
              ? "Start by creating your first task."
              : remaining === 0
              ? "🎉 All tasks complete! Great work."
              : `${remaining} task${remaining !== 1 ? 's' : ''} remaining · ${completionPct}% complete`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center bg-ink-900 border border-ink-800 rounded-lg p-1 gap-0.5">
            {[
              { mode: 'grid',   icon: '▦' },
              { mode: 'kanban', icon: '⊟' },
              { mode: 'list',   icon: '≡' },
            ].map(({ mode, icon }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`w-8 h-7 rounded flex items-center justify-center text-sm transition-all ${
                  viewMode === mode
                    ? 'bg-amber-500 text-ink-950'
                    : 'text-ink-500 hover:text-ink-200'
                }`}
              >
                {icon}
              </button>
            ))}
          </div>
          <button onClick={() => handleCreate()} className="btn-primary flex items-center gap-2">
            <span>+</span> New Task
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total Tasks"  value={totalTasks}               color="ink"     icon="◈" />
        <StatCard label="Pending"      value={stats.pending     || 0}   color="amber"   icon="◷" />
        <StatCard label="In Progress"  value={stats['in-progress'] || 0} color="blue"   icon="⟳" />
        <StatCard label="Completed"    value={stats.completed   || 0}   color="emerald" icon="✓" />
      </div>

      {/* ── Progress bar ── */}
      <ProgressBar stats={stats} />

      {/* ── Quick links ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Analytics',      to: '/analytics', icon: '◈', desc: 'View insights'    },
          { label: 'Profile',        to: '/profile',   icon: '◎', desc: 'Edit your info'   },
          { label: 'Settings',       to: '/settings',  icon: '⊙', desc: 'Preferences'      },
          { label: 'High Priority',  action: () => { setStatusFilter('all'); setSearch('') }, icon: '!', desc: 'Filter urgent' },
        ].map(({ label, to, icon, desc, action }) => (
          to
            ? <Link key={label} to={to} className="card p-4 hover:border-amber-500/20 hover:bg-ink-800/50 transition-all duration-200 group">
                <div className="text-amber-500 text-lg mb-2 group-hover:scale-110 transition-transform">{icon}</div>
                <div className="text-xs font-semibold text-ink-200">{label}</div>
                <div className="text-xs text-ink-600 mt-0.5">{desc}</div>
              </Link>
            : <button key={label} onClick={action} className="card p-4 hover:border-amber-500/20 hover:bg-ink-800/50 transition-all duration-200 group text-left">
                <div className="text-amber-500 text-lg mb-2 group-hover:scale-110 transition-transform">{icon}</div>
                <div className="text-xs font-semibold text-ink-200">{label}</div>
                <div className="text-xs text-ink-600 mt-0.5">{desc}</div>
              </button>
        ))}
      </div>

      {/* ── Filters ── */}
      <TaskFilters search={search} onSearch={setSearch} status={statusFilter} onStatus={setStatusFilter} />

      {/* ── Task views ── */}
      {loading ? (
        <div className="flex items-center justify-center py-20"><Spinner size="lg" /></div>
      ) : tasks.length === 0 ? (
        <EmptyState
          icon="📋"
          title={search || statusFilter !== 'all' ? 'No tasks match your filters' : 'No tasks yet'}
          description={search || statusFilter !== 'all' ? 'Try adjusting your search or filter.' : 'Create your first task to get started.'}
          action={!search && statusFilter === 'all' && (
            <button onClick={() => handleCreate()} className="btn-primary">Create Your First Task</button>
          )}
        />
      ) : (
        <>
          {/* GRID */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {tasks.map(task => (
                <TaskCard key={task._id} task={task} onEdit={handleEdit}
                  onDelete={(id) => setDeleteConfirmId(id)} onStatusChange={handleStatusChange} />
              ))}
            </div>
          )}

          {/* KANBAN */}
          {viewMode === 'kanban' && (
            <div className="flex gap-4 overflow-x-auto pb-4">
              <KanbanColumn title="Pending"     color="amber"   tasks={pendingTasks}    onEdit={handleEdit} onDelete={(id) => setDeleteConfirmId(id)} onStatusChange={handleStatusChange} onAddNew={() => handleCreate('pending')} />
              <KanbanColumn title="In Progress" color="blue"    tasks={inProgressTasks} onEdit={handleEdit} onDelete={(id) => setDeleteConfirmId(id)} onStatusChange={handleStatusChange} onAddNew={() => handleCreate('in-progress')} />
              <KanbanColumn title="Completed"   color="emerald" tasks={completedTasks}  onEdit={handleEdit} onDelete={(id) => setDeleteConfirmId(id)} onStatusChange={handleStatusChange} />
            </div>
          )}

          {/* LIST */}
          {viewMode === 'list' && (
            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ink-800">
                    <th className="text-left px-4 py-3 text-ink-500 font-medium text-xs uppercase tracking-wider">Task</th>
                    <th className="text-left px-4 py-3 text-ink-500 font-medium text-xs uppercase tracking-wider hidden sm:table-cell">Status</th>
                    <th className="text-left px-4 py-3 text-ink-500 font-medium text-xs uppercase tracking-wider hidden md:table-cell">Priority</th>
                    <th className="text-left px-4 py-3 text-ink-500 font-medium text-xs uppercase tracking-wider hidden lg:table-cell">Created</th>
                    <th className="px-4 py-3 text-ink-500 font-medium text-xs uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task, i) => (
                    <tr key={task._id} className={`border-b border-ink-800/50 hover:bg-ink-800/30 transition-colors ${task.status === 'completed' ? 'opacity-50' : ''}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleStatusChange(task._id, task.status === 'completed' ? 'pending' : 'completed')}
                            className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${task.status === 'completed' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-ink-600 hover:border-amber-500'}`}
                          >
                            {task.status === 'completed' && <span className="text-[9px]">✓</span>}
                          </button>
                          <span className={`font-medium text-ink-100 ${task.status === 'completed' ? 'line-through' : ''}`}>{task.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${
                          task.status === 'pending' ? 'badge-pending' :
                          task.status === 'in-progress' ? 'badge-in-progress' : 'badge-completed'
                        }`}>{task.status}</span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className={`text-xs font-mono badge-${task.priority}`}>{task.priority}</span>
                      </td>
                      <td className="px-4 py-3 text-ink-500 text-xs font-mono hidden lg:table-cell">
                        {new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-center">
                          <button onClick={() => handleEdit(task)} className="text-xs btn-ghost py-1 px-2">Edit</button>
                          <button onClick={() => setDeleteConfirmId(task._id)} className="text-xs py-1 px-2 text-rose-500/70 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all">Del</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {pagination.total > tasks.length && (
            <p className="text-center text-xs text-ink-600 font-mono">
              Showing {tasks.length} of {pagination.total} tasks
            </p>
          )}
        </>
      )}

      {/* Modals */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingTask ? 'Edit Task' : 'New Task'}>
        <TaskForm onSubmit={handleSubmit} initialData={editingTask || { status: initialStatus }} loading={submitting} />
      </Modal>

      <Modal isOpen={!!deleteConfirmId} onClose={() => setDeleteConfirmId(null)} title="Delete Task" size="sm">
        <p className="text-ink-400 text-sm mb-5">Are you sure? This cannot be undone.</p>
        <div className="flex gap-3 justify-end">
          <button className="btn-secondary" onClick={() => setDeleteConfirmId(null)}>Cancel</button>
          <button className="bg-rose-500 hover:bg-rose-400 text-white font-semibold px-5 py-2.5 rounded-lg transition-all active:scale-95" onClick={() => handleDelete(deleteConfirmId)}>Delete</button>
        </div>
      </Modal>
    </div>
  )
}