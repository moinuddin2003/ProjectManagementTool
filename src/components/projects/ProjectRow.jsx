"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Edit2, Trash2, Users, MoreHorizontal, CheckSquare, MessageCircle } from "lucide-react"

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

  const handleManageFiles = (e) => {
    e.stopPropagation()
    onManageFiles(projectData)
  }

  const handleOpenSlack = (e) => {
    e.stopPropagation()
    onOpenSlack()
  }

  return (
    <tr className="hover:bg-gray-50/50 transition-colors group cursor-pointer" onClick={handleRowClick}>
      <td className="px-6 py-4">
        <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{projectData.name}</div>
      </td>
      <td className="px-6 py-4 text-gray-700">{projectData.owner}</td>
      <td className="px-6 py-4 text-gray-700">{projectData.startDate}</td>
      <td className="px-6 py-4 text-gray-700">{projectData.endDate}</td>
      <td className="px-6 py-4">
        <div className="relative">
          <button
            className="action-button p-1 rounded-full hover:bg-gray-100 transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              setShowActions(!showActions)
            }}
          >
            <MoreHorizontal className="w-4 h-4 text-gray-500" />
          </button>

          {showActions && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowActions(false)} />
              <div className="absolute right-0 top-8 z-20 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[150px]">
                <button
                  onClick={handleEdit}
                  className="action-button w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Project
                </button>
                <button
                  onClick={handleManageMembers}
                  className="action-button w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Manage Members
                </button>
                <button
                  onClick={handleManageTasks}
                  className="action-button w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <CheckSquare className="w-4 h-4 mr-2" />
                  Manage Tasks
                </button>
                
                <button
                  onClick={handleOpenSlack}
                  className="action-button w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Slack Integration
                </button>
                <button
                  onClick={handleDelete}
                  className="action-button w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Project
                </button>
              </div>
            </>
          )}
        </div>
      </td>
    </tr>
  )
}

export default ProjectRow
