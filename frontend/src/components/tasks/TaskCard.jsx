function StatusBadge({ status }) {
  const map = {
    pending: 'badge-pending',
    'in-progress': 'badge-in-progress',
    completed: 'badge-completed'
  }
  const labels = {
    pending: 'Pending',
    'in-progress': 'In Progress',
    completed: 'Completed'
  }
  return <span className={map[status] || 'badge-pending'}>{labels[status] || status}</span>
}

function PriorityBadge({ priority }) {
  const map = { low: 'badge-low', medium: 'badge-medium', high: 'badge-high' }
  return <span className={map[priority] || 'badge-medium'}>{priority}</span>
}

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const isCompleted = task.status === 'completed'
  const formattedDate = new Date(task.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric'
  })
  const dueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : null

  return (
    <div
      className={`card p-4 transition-all duration-200 hover:border-ink-700 animate-fade-in
        ${isCompleted ? 'opacity-60' : ''}
      `}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onStatusChange(task._id, isCompleted ? 'pending' : 'completed')}
          className={`mt-0.5 w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all
            ${isCompleted
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : 'border-ink-600 hover:border-amber-500'
            }`}
        >
          {isCompleted && <span className="text-xs">✓</span>}
        </button>

        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-sm text-ink-100 mb-1 ${isCompleted ? 'line-through text-ink-400' : ''}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className="text-xs text-ink-500 mb-2 line-clamp-2">{task.description}</p>
          )}
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
            <span className="text-xs text-ink-600 font-mono ml-auto">{formattedDate}</span>
            {dueDate && (
              <span className="text-xs text-amber-500/70 font-mono">↳ {dueDate}</span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 mt-3 pt-3 border-t border-ink-800">
        <button
          onClick={() => onEdit(task)}
          className="text-xs btn-ghost py-1 px-2 text-ink-400"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task._id)}
          className="text-xs py-1 px-2 rounded-lg text-rose-500/70 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
