"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Edit2, Trash2, Users, MoreHorizontal, CheckSquare, MessageCircle, FileText, Calendar } from "lucide-react"

const ProjectRow = ({
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
  const navigate = useNavigate()

  // const handleHealthChange = async (newHealth) => {
  //   try {
  //     const statusMap = {
  //       Good: "open",
  //       "At Risk": "on_hold",
  //     }

  //     const updatedProject = await onUpdateProject(projectData.id, {
  //       status: statusMap[newHealth] || "open",
  //     })

  //     setProjectData(updatedProject)
  //   } catch (error) {
  //     console.error("Error updating project health:", error)
  //   }
  // }

  const handleRowClick = (e) => {
    // Don't navigate if clicking on action buttons
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

  // const handleManageFiles = (e) => {
  //   e.stopPropagation()
  //   // onManageFiles(projectData) - function not passed as prop yet
  //   console.log("Manage files for project:", projectData.name)
  // }

  const handleOpenSlack = (e) => {
    e.stopPropagation()
    onOpenSlack()
  }

  return (
    <tr
      className="hover:bg-slate-50/50 transition-all duration-300 group cursor-pointer border-b border-slate-100/50 last:border-b-0"
      onClick={handleRowClick}
    >
      <td className="px-8 py-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
          <div>
            <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors text-lg">
              {projectData.name}
            </div>
            <div className="text-sm text-slate-500 font-medium">Active Project</div>
          </div>
        </div>
      </td>
      <td className="px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {projectData.owner.charAt(0)}
          </div>
          <span className="text-slate-900 font-medium">{projectData.owner}</span>
        </div>
      </td>
      <td className="px-8 py-6">
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className="text-slate-700 font-medium text-sm">{projectData.startDate}</span>
        </div>
      </td>
      <td className="px-8 py-6">
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className="text-slate-700 font-medium text-sm">{projectData.endDate}</span>
        </div>
      </td>
      <td className="px-8 py-6">
        <div className="relative">
          <button
            className="action-button p-3 rounded-xl hover:bg-slate-100 transition-all duration-200 border border-transparent hover:border-slate-200 hover:shadow-md"
            onClick={(e) => {
              e.stopPropagation()
              setShowActions(!showActions)
            }}
          >
            <MoreHorizontal className="w-5 h-5 text-slate-600" />
          </button>

          {showActions && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowActions(false)
                }}
              />
              <div
                className="absolute right-0 top-12 z-20 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 py-4 min-w-[280px] max-h-[480px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-3 mb-2">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-3">
                    Quick Actions
                  </div>
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
                    {/* <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleManageFiles(e)
                      }}
                      className="action-button w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-orange-50/80 hover:text-orange-700 flex items-center gap-4 rounded-xl transition-all duration-200 group"
                    >
                      <div className="w-11 h-11 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition-colors shadow-sm">
                        <FileText className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <span className="font-semibold">Manage Files</span>
                        <div className="text-xs text-slate-500">Upload and organize files</div>
                      </div>
                    </button> */}
                  </div>
                </div>

                <div className="px-3 mb-2">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-3">
                    Integrations
                  </div>
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
            </>
          )}
        </div>
      </td>
    </tr>
  )
}

export default ProjectRow
