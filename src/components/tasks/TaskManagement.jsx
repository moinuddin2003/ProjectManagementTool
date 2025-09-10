"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Calendar, User } from "lucide-react"
import { taskApi, projectApi } from "../../services/projectApi"

const TaskManagement = ({ project, onClose, onTasksUpdated }) => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showCreateTask, setShowCreateTask] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [internalProjectId, setInternalProjectId] = useState(project?.id)
  const [availableProjects, setAvailableProjects] = useState([])

  useEffect(() => {
    const initializeTasks = async () => {
      if (project) {
        setInternalProjectId(project.id)
        setTasks(project.tasks.filter(task => !task.parent_id) || [])
        setLoading(false)
        setError("")
      } else {
        await fetchAndSetProjects()
      }
    }
    initializeTasks()
  }, [project])

  // Reintroduce this useEffect to handle project selection from dropdown when no initial project prop is provided
  useEffect(() => {
    if (internalProjectId && !project && availableProjects.length > 0) {
      const selectedProjData = availableProjects.find(p => p.id === internalProjectId)
      if (selectedProjData) {
        setTasks(selectedProjData.tasks.filter(task => !task.parent_id) || [])
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
      const result = await projectApi.getProjects(15, 1) // Fetch all projects
      if (result.projects && result.projects.length > 0) {
        setAvailableProjects(result.projects)
        // Set initial internalProjectId to the first project, or keep existing if still valid
        const initialProjectId = internalProjectId || result.projects[0].id;
        setInternalProjectId(initialProjectId)

        // Find the selected project and extract its top-level tasks
        const selectedProjData = result.projects.find(p => p.id === initialProjectId)
        if (selectedProjData) {
          setTasks(selectedProjData.tasks.filter(task => !task.parent_id) || [])
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
      await taskApi.createTask(internalProjectId, taskData)
      if (onTasksUpdated) onTasksUpdated()
      if (!project) await fetchAndSetProjects() // Re-add: Refresh internal state if in standalone mode
      setShowCreateTask(false)
    } catch (err) {
      console.error("Error in handleCreateTask:", err)
      setError("Failed to create task")
    }
  }

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      await taskApi.updateTask(internalProjectId, taskId, taskData)
      if (onTasksUpdated) onTasksUpdated()
      if (!project) await fetchAndSetProjects() // Re-add: Refresh internal state if in standalone mode
      setEditingTask(null)
    } catch (err) {
      console.error("Error in handleUpdateTask:", err)
      setError("Failed to update task")
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await taskApi.deleteTask(internalProjectId, taskId)
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId)) // Optimistic UI update
        if (onTasksUpdated) onTasksUpdated()
        if (!project) await fetchAndSetProjects() // Re-add: Refresh internal state if in standalone mode
      } catch (err) {
        console.error("Error in handleDeleteTask:", err)
        setError("Failed to delete task")
      }
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical":
        return "text-red-600 bg-red-100"
      case "high":
        return "text-orange-600 bg-orange-100"
      case "medium":
        return "text-yellow-600 bg-yellow-100"
      case "low":
        return "text-green-600 bg-green-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100"
      case "in_progress":
        return "text-blue-600 bg-blue-100"
      case "open": // Map "open" to a visual style
        return "text-gray-600 bg-gray-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading tasks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Task Management</h2>
          <div className="flex items-center gap-2">
            {availableProjects.length > 0 && (
              <select
                value={internalProjectId}
                onChange={(e) => setInternalProjectId(Number(e.target.value))}
                className="text-sm border rounded px-3 py-2"
              >
                {availableProjects.map((proj) => (
                  <option key={proj.id} value={proj.id}>
                    {proj.name}
                  </option>
                ))}
              </select>
            )}
            <button
              onClick={() => setShowCreateTask(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Task
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>
        </div>

        {error && <div className="mx-6 mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">No tasks yet</div>
              <p className="text-gray-500">Create your first task to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={() => setEditingTask(task)}
                  onDelete={() => handleDeleteTask(task.id)}
                  onUpdate={handleUpdateTask}
                  getPriorityColor={getPriorityColor}
                  getStatusColor={getStatusColor}
                />
              ))}
            </div>
          )}
        </div>

        {showCreateTask && (
          <CreateTaskModal onClose={() => setShowCreateTask(false)} onSubmit={handleCreateTask} tasks={tasks} />
        )}

        {editingTask && (
          <EditTaskModal
            task={editingTask}
            onClose={() => setEditingTask(null)}
            onSubmit={(taskData) => handleUpdateTask(editingTask.id, taskData)}
          />
        )}
      </div>
    </div>
  )
}

const TaskCard = ({ task, onEdit, onDelete, onUpdate, getPriorityColor, getStatusColor }) => {
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
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-medium text-gray-900">{task.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority_level)}`}>
              {task.priority_level}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
              {task.status || "open"}
            </span>
          </div>

          {task.description && <p className="text-gray-600 text-sm mb-3">{task.description}</p>}

          <div className="flex items-center gap-4 text-sm text-gray-500">
            {task.assignee && (
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{task.assignee.name}</span>
              </div>
            )}
            {task.due_date && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(task.due_date).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {task.subtasks && task.subtasks.length > 0 && (
            <div className="mt-3 space-y-2 pl-4 border-l-2 border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Subtasks ({task.subtasks.length})</p>
              {task.subtasks.map((subtask) => (
                <TaskCard
                  key={subtask.id}
                  task={subtask}
                  onEdit={onEdit} // Pass down edit handler
                  onDelete={onDelete} // Pass down delete handler
                  onUpdate={onUpdate} // Pass down update handler
                  getPriorityColor={getPriorityColor}
                  getStatusColor={getStatusColor}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 ml-4">
          <select
            value={task.status || "open"}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={isUpdating}
            className="text-sm border rounded px-2 py-1"
          >
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
          </select>

          <button onClick={onEdit} className="p-1 text-gray-400 hover:text-blue-600">
            <Edit className="w-4 h-4" />
          </button>

          <button onClick={onDelete} className="p-1 text-gray-400 hover:text-red-600">
            <Trash2 className="w-4 h-4" />
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h3 className="text-lg font-semibold mb-4">Create New Task</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority Level</label>
            <select
              value={formData.priority_level}
              onChange={(e) => setFormData({ ...formData, priority_level: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assignee ID</label>
            <input
              type="number"
              value={formData.assignee_id}
              onChange={(e) => setFormData({ ...formData, assignee_id: e.target.value })}
              placeholder="Enter user ID"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {parentTasks.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parent Task (for subtask)</label>
              <select
                value={formData.parent_id}
                onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h3 className="text-lg font-semibold mb-4">Edit Task</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todo">Todo</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority Level</label>
            <select
              value={formData.priority_level}
              onChange={(e) => setFormData({ ...formData, priority_level: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
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
