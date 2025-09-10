import { useParams, useNavigate, Navigate } from "react-router-dom"
import { Calendar, User, ListTodo } from "lucide-react"

const ProjectDetails = ({ projects }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const project = projects.find((p) => p.id === Number.parseInt(id))

  if (!project) {
    return <Navigate to="/projects" replace />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate("/projects")} className="text-blue-600 hover:text-blue-800">
          ← Back to Projects
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Project: {project.name}</h2>
        </div>
        <div className="p-6 space-y-8">
          {/* Project Overview */}
          <section className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Overview</h3>
            <div>
              <p className="text-gray-700 text-lg mb-4">{project.description}</p>
              {project.devInstruction && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-blue-800">
                  <p className="font-medium">Development Instructions:</p>
                  <p className="text-sm">{project.devInstruction}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <span className="text-sm font-medium text-gray-500">Status</span>
                <p className="text-base text-gray-900 capitalize font-medium">{project.status}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Priority</span>
                <p className="text-base text-gray-900 capitalize font-medium">{project.priorityLevel}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Owner</span>
                <p className="text-base text-gray-900 font-medium">{project.owner}</p>
              </div>
              {project.startDate && project.endDate && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Timeline</span>
                  <p className="text-base text-gray-900 font-medium flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    {project.startDate} - {project.endDate}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Team Members */}
          {project.members && project.members.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Team Members</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.members.map((member) => (
                  <div key={member.id} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg shadow-sm">
                    <User className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Project Tasks */}
          {project.tasks && project.tasks.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center">
                <ListTodo className="w-5 h-5 mr-2" />
                Tasks ({project.tasks.length})
              </h3>
              <div className="space-y-4">
                {project.tasks.map((task) => (
                  <div key={task.id} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100">
                    <h4 className="font-semibold text-gray-900 text-lg mb-1">{task.title}</h4>
                    {task.description && <p className="text-sm text-gray-700 mb-2">{task.description}</p>}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${task.priority_level === "high" ? "bg-red-100 text-red-600" : task.priority_level === "medium" ? "bg-yellow-100 text-yellow-600" : "bg-green-100 text-green-600"}`}
                      >
                        {task.priority_level}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${task.status === "completed" ? "bg-green-100 text-green-600" : task.status === "in_progress" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"}`}
                      >
                        {task.status || "todo"}
                      </span>
                      {task.assignee && (
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {task.assignee.name}
                        </span>
                      )}
                      {task.due_date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(task.due_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProjectDetails
