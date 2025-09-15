"use client"

import { useParams, useNavigate, Navigate } from "react-router-dom"
import {
  Calendar,
  User,
  ListTodo,
  ArrowLeft,
  Clock,
  Target,
  Users,
  CheckCircle,
  AlertCircle,
  Circle,
} from "lucide-react"

const ProjectDetails = ({ projects }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const project = projects.find((p) => p.id === Number.parseInt(id))

  if (!project) {
    return <Navigate to="/projects" replace />
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "in_progress":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "open":
        return "bg-amber-100 text-amber-700 border-amber-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200"
      case "medium":
        return "bg-orange-100 text-orange-700 border-orange-200"
      case "low":
        return "bg-green-100 text-green-700 border-green-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getTaskStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-emerald-600" />
      case "in_progress":
        return <AlertCircle className="w-4 h-4 text-blue-600" />
      default:
        return <Circle className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center">
          <button
            onClick={() => navigate("/projects")}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white/60 rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/20"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </button>
        </div>

        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-8 py-12 text-white">
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight">{project.name}</h1>
                <p className="text-xl text-indigo-100 max-w-3xl leading-relaxed">{project.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(project.status)} bg-white/90`}
                >
                  {project.status}
                </span>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold border ${getPriorityColor(project.priorityLevel)} bg-white/90`}
                >
                  {project.priorityLevel} Priority
                </span>
              </div>
            </div>
          </div>
        </div>

        {project.devInstruction && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Development Instructions</h3>
                <p className="text-slate-700 leading-relaxed">{project.devInstruction}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-sm font-medium text-slate-500">Status</span>
            </div>
            <p className="text-xl font-semibold text-slate-900 capitalize">{project.status}</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Target className="w-5 h-5 text-orange-600" />
              </div>
              <span className="text-sm font-medium text-slate-500">Priority</span>
            </div>
            <p className="text-xl font-semibold text-slate-900 capitalize">{project.priorityLevel}</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-slate-500">Owner</span>
            </div>
            <p className="text-xl font-semibold text-slate-900">{project.owner}</p>
          </div>

          {project.startDate && project.endDate && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-slate-500">Timeline</span>
              </div>
              <p className="text-sm font-medium text-slate-900">{project.startDate}</p>
              <p className="text-sm text-slate-600">to {project.endDate}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {project.members && project.members.length > 0 && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Team Members</h3>
                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium">
                  {project.members.length}
                </span>
              </div>
              <div className="space-y-4">
                {project.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {member.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{member.name}</p>
                      <p className="text-sm text-slate-600">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {project.tasks && project.tasks.length > 0 && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <ListTodo className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Tasks</h3>
                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium">
                  {project.tasks.length}
                </span>
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {project.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 bg-slate-50/50 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      {getTaskStatusIcon(task.status)}
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 mb-1">{task.title}</h4>
                        {task.description && <p className="text-sm text-slate-600 mb-3">{task.description}</p>}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority_level)}`}
                      >
                        {task.priority_level}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status || "todo")}`}
                      >
                        {task.status || "todo"}
                      </span>
                      {task.assignee && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs">
                          <User className="w-3 h-3" />
                          {task.assignee.name}
                        </span>
                      )}
                      {task.due_date && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs">
                          <Clock className="w-3 h-3" />
                          {new Date(task.due_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProjectDetails
