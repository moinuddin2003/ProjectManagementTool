"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Calendar, User, Clock, AlertCircle, CheckCircle2, Circle, Play } from "lucide-react"
import { taskApi, projectApi } from "../../services/projectApi"
import { createPortal } from "react-dom"

const TaskManagement = ({ project, onClose, onTasksUpdated }) => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showCreateTask, setShowCreateTask] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [internalProjectId, setInternalProjectId] = useState(project?.id)
  const [availableProjects, setAvailableProjects] = useState([])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  useEffect(() => {
    const initializeTasks = async () => {
      if (project) {
        setInternalProjectId(project.id)
        setTasks(project.tasks.filter((task) => !task.parent_id) || [])
        setLoading(false)
        setError("")
      } else {
        await fetchAndSetProjects()
      }
    }
    initializeTasks()
  }, [project])

  useEffect(() => {
    if (internalProjectId && !project && availableProjects.length > 0) {
      const selectedProjData = availableProjects.find((p) => p.id === internalProjectId)
      if (selectedProjData) {
        setTasks(selectedProjData.tasks.filter((task) => !task.parent_id) || [])
        setError("")
      } else {
        setTasks([])
        setError("No tasks found for selected project.")
      }
    }
  }, [internalProjectId, project, availableProjects])

  const fetchAndSetProjects = async () => {
    setLoading(true)
    setError("")
    try {
      const result = await projectApi.getProjects(15, 1)
      if (result.projects && result.projects.length > 0) {
        setAvailableProjects(result.projects)
        const initialProjectId = internalProjectId || result.projects[0].id
        setInternalProjectId(initialProjectId)

        const selectedProjData = result.projects.find((p) => p.id === initialProjectId)
        if (selectedProjData) {
          setTasks(selectedProjData.tasks.filter((task) => !task.parent_id) || [])
        } else {
          setTasks([])
        }
      } else {
        setTasks([])
        setAvailableProjects([])
        setError("No projects available. Please create a project to manage tasks.")
      }
    } catch (err) {
      console.error("Error in fetchAndSetProjects:", err)
      setError("Failed to load projects.")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await taskApi.createTask(internalProjectId, taskData)
      // Optimistic update
      setTasks((prevTasks) => [...prevTasks, newTask])
      if (onTasksUpdated) onTasksUpdated()
      setShowCreateTask(false)
    } catch (err) {
      console.error("Error in handleCreateTask:", err)
      setError("Failed to create task")
    }
  }

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      // Optimistic update
      setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? { ...task, ...taskData } : task)))

      await taskApi.updateTask(internalProjectId, taskId, taskData)
      if (onTasksUpdated) onTasksUpdated()
      setEditingTask(null)
    } catch (err) {
      console.error("Error in handleUpdateTask:", err)
      setError("Failed to update task")
      // Revert optimistic update on error
      if (!project) await fetchAndSetProjects()
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        // Optimistic update
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))

        await taskApi.deleteTask(internalProjectId, taskId)
        if (onTasksUpdated) onTasksUpdated()
      } catch (err) {
        console.error("Error in handleDeleteTask:", err)
        setError("Failed to delete task")
        // Revert optimistic update on error
        if (!project) await fetchAndSetProjects()
      }
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      // case "critical":
      //   return "text-red-600 bg-gradient-to-r from-red-50 to-red-100 border-red-200"
      case "high":
        return "text-orange-600 bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200"
      case "medium":
        return "text-yellow-600 bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200"
      case "low":
        return "text-green-600 bg-gradient-to-r from-green-50 to-green-100 border-green-200"
      default:
        return "text-gray-600 bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-gradient-to-r from-green-50 to-green-100 border-green-200"
      case "in_progress":
        return "text-blue-600 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200"
      case "open":
        return "text-gray-600 bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200"
      default:
        return "text-gray-600 bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />
      case "in_progress":
        return <Play className="w-4 h-4 text-blue-600" />
      default:
        return <Circle className="w-4 h-4 text-gray-400" />
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-700 font-medium">Loading tasks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl w-full max-w-7xl max-h-[90vh] overflow-hidden shadow-2xl border border-white/20">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Task Management</h2>
              <p className="text-blue-100">Organize and track your project tasks</p>
            </div>
            <div className="flex items-center gap-4">
              {availableProjects.length > 0 && (
                <select
                  value={internalProjectId}
                  onChange={(e) => setInternalProjectId(Number(e.target.value))}
                  className="bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  {availableProjects.map((proj) => (
                    <option key={proj.id} value={proj.id} className="text-gray-900">
                      {proj.name}
                    </option>
                  ))}
                </select>
              )}
              <button
                onClick={() => setShowCreateTask(true)}
                className="bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-200 flex items-center gap-2 font-medium border border-white/30"
              >
                <Plus className="w-5 h-5" />
                Create Task
              </button>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/20 transition-all duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mx-8 mt-6 p-4 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
          {tasks.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No tasks yet</h3>
              <p className="text-gray-600 mb-6">Create your first task to get started with project management</p>
              <button
                onClick={() => setShowCreateTask(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
              >
                Create First Task
              </button>
            </div>
          ) : (
            <div className="grid gap-6">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={() => setEditingTask(task)}
                  onDelete={() => handleDeleteTask(task.id)}
                  onUpdate={handleUpdateTask}
                  getPriorityColor={getPriorityColor}
                  getStatusColor={getStatusColor}
                  getStatusIcon={getStatusIcon}
                />
              ))}
            </div>
          )}
        </div>

        {showCreateTask &&
          createPortal(
            <CreateTaskModal onClose={() => setShowCreateTask(false)} onSubmit={handleCreateTask} tasks={tasks} />,
            document.body
          )}
        {editingTask &&
          createPortal(
            <EditTaskModal
              task={editingTask}
              onClose={() => setEditingTask(null)}
              onSubmit={(taskData) => handleUpdateTask(editingTask.id, taskData)}
            />,
            document.body
          )}
      </div>
    </div>
  )
}

const TaskCard = ({ task, onEdit, onDelete, onUpdate, getPriorityColor, getStatusColor, getStatusIcon }) => {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true)
    try {
      await onUpdate(task.id, { status: newStatus })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:bg-white/90">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            {getStatusIcon(task.status)}
            <h3 className="font-bold text-xl text-gray-900">{task.title}</h3>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(task.priority_level)}`}
            >
              {task.priority_level}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(task.status)}`}>
              {task.status || "open"}
            </span>
          </div>

          {task.description && <p className="text-gray-700 text-base mb-4 leading-relaxed">{task.description}</p>}

          <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
            {task.assignee && (
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                <User className="w-4 h-4" />
                <span className="font-medium">{task.assignee.name}</span>
              </div>
            )}
            {task.due_date && (
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">{new Date(task.due_date).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {task.subtasks && task.subtasks.length > 0 && (
            <div className="mt-6 space-y-4 pl-6 border-l-4 border-gradient-to-b from-blue-200 to-purple-200">
              <p className="text-sm font-semibold text-gray-700 mb-3">Subtasks ({task.subtasks.length})</p>
              {task.subtasks.map((subtask) => (
                <TaskCard
                  key={subtask.id}
                  task={subtask}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onUpdate={onUpdate}
                  getPriorityColor={getPriorityColor}
                  getStatusColor={getStatusColor}
                  getStatusIcon={getStatusIcon}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 ml-6">
          <select
            value={task.status || "open"}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={isUpdating}
            className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <button
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
          >
            <Edit className="w-5 h-5" />
          </button>

          <button
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

const CreateTaskModal = ({ onClose, onSubmit, tasks }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority_level: "medium",
    due_date: "",
    assignee_id: "",
    parent_id: "",
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const submitData = { ...formData }
      if (!submitData.assignee_id) delete submitData.assignee_id
      if (!submitData.parent_id) delete submitData.parent_id
      if (!submitData.due_date) delete submitData.due_date

      await onSubmit(submitData)
    } finally {
      setLoading(false)
    }
  }

  const parentTasks = tasks.filter((task) => !task.parent_id)

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[70]">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl w-full max-w-2xl p-8 shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto">
        <div className="mb-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-2">Create New Task</h3>
          <p className="text-gray-600">Add a new task to your project</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 backdrop-blur-md"
              placeholder="Enter task title"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 backdrop-blur-md resize-none"
              placeholder="Describe the task details"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Priority Level</label>
              <select
                value={formData.priority_level}
                onChange={(e) => setFormData({ ...formData, priority_level: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 backdrop-blur-md"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                {/* <option value="critical">Critical</option> */}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date</label>
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 backdrop-blur-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Assignee ID</label>
            <input
              type="number"
              value={formData.assignee_id}
              onChange={(e) => setFormData({ ...formData, assignee_id: e.target.value })}
              placeholder="Enter user ID"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 backdrop-blur-md"
            />
          </div>

          {parentTasks.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Parent Task (for subtask)</label>
              <select
                value={formData.parent_id}
                onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 backdrop-blur-md"
              >
                <option value="">None (Main Task)</option>
                {parentTasks.map((task) => (
                  <option key={task.id} value={task.id}>
                    {task.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 font-medium transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 font-medium transition-all duration-200"
            >
              {loading ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const EditTaskModal = ({ task, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: task.title || "",
    description: task.description || "",
    priority_level: task.priority_level || "medium",
    due_date: task.due_date || "",
    assignee_id: task.assignee?.id || "",
    status: task.status || "todo",
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const submitData = { ...formData }
      if (!submitData.assignee_id) delete submitData.assignee_id
      if (!submitData.due_date) delete submitData.due_date

      await onSubmit(submitData)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[70]">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl w-full max-w-2xl p-8 shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto">
        <div className="mb-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-2">Edit Task</h3>
          <p className="text-gray-600">Update task information</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 backdrop-blur-md"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 backdrop-blur-md resize-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 backdrop-blur-md"
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Priority Level</label>
              <select
                value={formData.priority_level}
                onChange={(e) => setFormData({ ...formData, priority_level: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 backdrop-blur-md"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                {/* <option value="critical">Critical</option> */}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date</label>
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 backdrop-blur-md"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 font-medium transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 font-medium transition-all duration-200"
            >
              {loading ? "Updating..." : "Update Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskManagement
