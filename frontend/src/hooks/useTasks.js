import { useState, useCallback } from 'react'
import { taskService } from '../services/taskService'
import toast from 'react-hot-toast'

export function useTasks() {
  const [tasks, setTasks] = useState([])
  const [stats, setStats] = useState({ pending: 0, 'in-progress': 0, completed: 0 })
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 })
  const [loading, setLoading] = useState(false)

  const fetchTasks = useCallback(async (params = {}) => {
    setLoading(true)
    try {
      const { data } = await taskService.getTasks(params)
      setTasks(data.tasks)
      setStats(data.stats)
      setPagination(data.pagination)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }, [])

  const createTask = async (taskData) => {
    const { data } = await taskService.createTask(taskData)
    toast.success('Task created')
    return data.task
  }

  const updateTask = async (id, taskData) => {
    const { data } = await taskService.updateTask(id, taskData)
    toast.success('Task updated')
    return data.task
  }

  const deleteTask = async (id) => {
    await taskService.deleteTask(id)
    toast.success('Task deleted')
  }

  return { tasks, stats, pagination, loading, fetchTasks, createTask, updateTask, deleteTask }
}
