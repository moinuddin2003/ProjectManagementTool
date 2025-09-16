import { useState, useRef } from "react"
import { createPortal } from "react-dom"
import { useNavigate } from "react-router-dom"
import { Edit2, Trash2, Users, MoreHorizontal, CheckSquare, MessageCircle, Calendar } from "lucide-react"

const ProjectCard = ({
  project,
  onUpdateProject,
  onDeleteProject,
  onManageMembers,
  onManageTasks,
  onOpenSlack,
  onEditProject,
}) => {
  const [projectData, setProjectData] = useState(project)
  const [showActions, setShowActions] = useState(false)
  const [dropdownPos, setDropdownPos] = useState(null)
  const actionBtnRef = useRef(null)
  const navigate = useNavigate()

  const DROPDOWN_WIDTH = 300
  const DROPDOWN_HEIGHT = 520

  const handleCardClick = (e) => {
    if (e.target.closest(".action-button")) {
      return
    }
    navigate(`/projects/${projectData.id}`)
  }

  const handleEdit = (e) => {
    e.stopPropagation()
    onEditProject(projectData)
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    if (window.confirm(`Are you sure you want to delete "${projectData.name}"?`)) {
      onDeleteProject(projectData.id)
    }
  }

  const handleManageMembers = (e) => {
    e.stopPropagation()
    onManageMembers(projectData)
  }

  const handleManageTasks = (e) => {
    e.stopPropagation()
    onManageTasks(projectData)
  }

  const handleOpenSlack = (e) => {
    e.stopPropagation()
    onOpenSlack()
  }

  return (
    <>
      <div
        className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer"
        onClick={handleCardClick}
      >
        {/* Card Header */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <button
              ref={actionBtnRef}
              className="action-button p-2 rounded-lg hover:bg-slate-100 transition-all duration-200 opacity-0 group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation()
                const rect = actionBtnRef.current.getBoundingClientRect()
                let top = rect.bottom + window.scrollY
                let left = rect.left + window.scrollX

                if (left + DROPDOWN_WIDTH > window.innerWidth) {
                  left = window.innerWidth - DROPDOWN_WIDTH - 16
                }
                if (top + DROPDOWN_HEIGHT > window.innerHeight + window.scrollY) {
                  top = window.innerHeight + window.scrollY - DROPDOWN_HEIGHT - 16
                }
                setDropdownPos({ top, left, width: rect.width })
                setShowActions(!showActions)
              }}
            >
              <MoreHorizontal className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors text-lg mb-2">
            {projectData.name}
          </h3>
          <p className="text-sm text-slate-500 font-medium mb-4">Active Project</p>

          {/* Owner */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {projectData.owner.charAt(0)}
            </div>
            <div>
              <span className="text-slate-900 font-medium text-sm">{projectData.owner}</span>
              <div className="text-xs text-slate-500">Project Owner</div>
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100/50">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-slate-600">{projectData.startDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-slate-600">{projectData.endDate}</span>
            </div>
          </div>
        </div>
      </div>

      {showActions &&
        dropdownPos &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={(e) => {
                e.stopPropagation()
                setShowActions(false)
              }}
            />
            <div
              style={{
                position: "absolute",
                top: dropdownPos.top,
                left: dropdownPos.left,
                zIndex: 1000,
                minWidth: DROPDOWN_WIDTH,
                maxWidth: DROPDOWN_WIDTH,
                maxHeight: DROPDOWN_HEIGHT,
              }}
              className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 py-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-3 mb-2">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-3">Quick Actions</div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEdit(e)
                  }}
                  className="action-button w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-blue-50/80 hover:text-blue-700 flex items-center gap-4 rounded-xl transition-all duration-200 group"
                >
                  <div className="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors shadow-sm">
                    <Edit2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <span className="font-semibold">Edit Project</span>
                    <div className="text-xs text-slate-500">Modify project details</div>
                  </div>
                </button>
              </div>

              <div className="px-3 mb-2">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-3">Management</div>
                <div className="space-y-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleManageMembers(e)
                    }}
                    className="action-button w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-emerald-50/80 hover:text-emerald-700 flex items-center gap-4 rounded-xl transition-all duration-200 group"
                  >
                    <div className="w-11 h-11 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-200 transition-colors shadow-sm">
                      <Users className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <span className="font-semibold">Manage Members</span>
                      <div className="text-xs text-slate-500">Add or remove team members</div>
                    </div>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleManageTasks(e)
                    }}
                    className="action-button w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-purple-50/80 hover:text-purple-700 flex items-center gap-4 rounded-xl transition-all duration-200 group"
                  >
                    <div className="w-11 h-11 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors shadow-sm">
                      <CheckSquare className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <span className="font-semibold">Manage Tasks</span>
                      <div className="text-xs text-slate-500">View and organize tasks</div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="px-3 mb-2">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-3">Integrations</div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleOpenSlack(e)
                  }}
                  className="action-button w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-indigo-50/80 hover:text-indigo-700 flex items-center gap-4 rounded-xl transition-all duration-200 group"
                >
                  <div className="w-11 h-11 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-200 transition-colors shadow-sm">
                    <MessageCircle className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <span className="font-semibold">Slack Integration</span>
                    <div className="text-xs text-slate-500">Connect with Slack workspace</div>
                  </div>
                </button>
              </div>

              <div className="border-t border-slate-200/50 mt-4 pt-3 px-3">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-3">Danger Zone</div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(e)
                  }}
                  className="action-button w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50/80 hover:text-red-700 flex items-center gap-4 rounded-xl transition-all duration-200 group"
                >
                  <div className="w-11 h-11 bg-red-100 rounded-xl flex items-center justify-center group-hover:bg-red-200 transition-colors shadow-sm">
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <span className="font-semibold">Delete Project</span>
                    <div className="text-xs text-slate-500">Permanently remove project</div>
                  </div>
                </button>
              </div>
            </div>
          </>,
          document.body,
        )}
    </>
  )
}

const ProjectsGrid = ({
  projects,
  onUpdateProject,
  onDeleteProject,
  onManageMembers,
  onManageTasks,
  onManageFiles,
  onOpenSlack,
  onEditProject,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onUpdateProject={onUpdateProject}
          onDeleteProject={onDeleteProject}
          onManageMembers={onManageMembers}
          onManageTasks={onManageTasks}
          onManageFiles={onManageFiles}
          onOpenSlack={onOpenSlack}
          onEditProject={onEditProject}
        />
      ))}
    </div>
  )
}

export default ProjectsGrid
