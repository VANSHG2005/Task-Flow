import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTasks } from '../hooks/useTasks'
import TaskCard from '../components/tasks/TaskCard'
import TaskForm from '../components/tasks/TaskForm'
import TaskFilters from '../components/tasks/TaskFilters'
import Modal from '../components/common/Modal'
import EmptyState from '../components/common/EmptyState'
import Spinner from '../components/common/Spinner'
import toast from 'react-hot-toast'

function StatCard({ label, value, color }) {
  const colors = {
    amber: 'text-amber-400',
    blue: 'text-blue-400',
    emerald: 'text-emerald-400',
    ink: 'text-ink-400'
  }
  return (
    <div className="card p-5">
      <div className={`text-3xl font-black font-mono ${colors[color] || colors.ink} mb-1`}>{value}</div>
      <div className="text-ink-500 text-sm">{label}</div>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { tasks, stats, pagination, loading, fetchTasks, createTask, updateTask, deleteTask } = useTasks()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTasks({ search, status: statusFilter })
    }, 300)
    return () => clearTimeout(timer)
  }, [search, statusFilter, fetchTasks])

  const handleCreate = () => {
    setEditingTask(null)
    setModalOpen(true)
  }

  const handleEdit = (task) => {
    setEditingTask(task)
    setModalOpen(true)
  }

  const handleSubmitTask = async (formData) => {
    setSubmitting(true)
    try {
      if (editingTask) {
        await updateTask(editingTask._id, formData)
      } else {
        await createTask(formData)
      }
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
      toast.error(err.response?.data?.message || 'Failed to delete task')
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateTask(id, { status: newStatus })
      fetchTasks({ search, status: statusFilter })
    } catch {
      toast.error('Failed to update status')
    }
  }

  const totalTasks = (stats.pending || 0) + (stats['in-progress'] || 0) + (stats.completed || 0)

  return (
    <div className="animate-fade-in space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-ink-50">
            Hey, {user?.name?.split(' ')[0]} 👋
          </h2>
          <p className="text-ink-500 text-sm mt-0.5">
            {totalTasks === 0 ? "You're all caught up!" : `You have ${stats.pending + (stats['in-progress'] || 0)} tasks remaining`}
          </p>
        </div>
        <button onClick={handleCreate} className="btn-primary flex items-center gap-2">
          <span>+</span>
          New Task
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total Tasks" value={totalTasks} color="ink" />
        <StatCard label="Pending" value={stats.pending || 0} color="amber" />
        <StatCard label="In Progress" value={stats['in-progress'] || 0} color="blue" />
        <StatCard label="Completed" value={stats.completed || 0} color="emerald" />
      </div>

      {/* Filters */}
      <TaskFilters
        search={search}
        onSearch={setSearch}
        status={statusFilter}
        onStatus={setStatusFilter}
      />

      {/* Tasks grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState
          icon="📋"
          title={search || statusFilter !== 'all' ? 'No tasks match your filters' : 'No tasks yet'}
          description={search || statusFilter !== 'all' ? 'Try different search terms or filters' : 'Create your first task to get started'}
          action={
            !search && statusFilter === 'all' ? (
              <button onClick={handleCreate} className="btn-primary">
                Create Your First Task
              </button>
            ) : null
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={handleEdit}
                onDelete={(id) => setDeleteConfirmId(id)}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
          {pagination.total > 0 && (
            <p className="text-center text-xs text-ink-600 font-mono">
              Showing {tasks.length} of {pagination.total} tasks
            </p>
          )}
        </>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTask ? 'Edit Task' : 'New Task'}
      >
        <TaskForm
          onSubmit={handleSubmitTask}
          initialData={editingTask}
          loading={submitting}
        />
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Task"
        size="sm"
      >
        <p className="text-ink-400 text-sm mb-5">
          Are you sure you want to delete this task? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button className="btn-secondary" onClick={() => setDeleteConfirmId(null)}>Cancel</button>
          <button
            className="bg-rose-500 hover:bg-rose-400 text-white font-semibold px-5 py-2.5 rounded-lg transition-all active:scale-95"
            onClick={() => handleDelete(deleteConfirmId)}
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  )
}
