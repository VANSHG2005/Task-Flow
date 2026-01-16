const statusOptions = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' }
]

export default function TaskFilters({ search, onSearch, status, onStatus }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500 text-sm">⌕</span>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search tasks..."
          className="input-field pl-9"
        />
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {statusOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onStatus(opt.value)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border
              ${status === opt.value
                ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                : 'bg-ink-900 text-ink-400 border-ink-700 hover:text-ink-100 hover:border-ink-600'
              }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
