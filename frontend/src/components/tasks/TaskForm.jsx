import { useState, useEffect } from 'react'
import Spinner from '../common/Spinner'

const defaultForm = {
  title: '',
  description: '',
  status: 'pending',
  priority: 'medium',
  dueDate: ''
}

export default function TaskForm({ onSubmit, initialData, loading }) {
  const [form, setForm] = useState(defaultForm)

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        status: initialData.status || 'pending',
        priority: initialData.priority || 'medium',
        dueDate: initialData.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : ''
      })
    } else {
      setForm(defaultForm)
    }
  }, [initialData])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-ink-300 mb-1.5">
          Title <span className="text-rose-400">*</span>
        </label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="What needs to be done?"
          className="input-field"
          required
          maxLength={100}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ink-300 mb-1.5">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Add details..."
          className="input-field resize-none"
          rows={3}
          maxLength={500}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-ink-300 mb-1.5">Status</label>
          <select name="status" value={form.status} onChange={handleChange} className="input-field">
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-300 mb-1.5">Priority</label>
          <select name="priority" value={form.priority} onChange={handleChange} className="input-field">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-ink-300 mb-1.5">Due Date</label>
        <input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
          className="input-field"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="submit" className="btn-primary flex items-center gap-2" disabled={loading}>
          {loading && <Spinner size="sm" />}
          {initialData ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  )
}
