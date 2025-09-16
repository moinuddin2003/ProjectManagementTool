import { useState, useMemo } from "react"
import ProjectsHeader from "./ProjectsHeader"
import ProjectsTable from "./ProjectsTable"
import ProjectsGrid from "./ProjectsGrid"

const ProjectsView = ({
  projects,
  onCreateProject,
  onUpdateProject,
  onDeleteProject,
  onManageMembers,
  onManageTasks,
  onManageFiles,
  onOpenSlack,
  onEditProject,
}) => {
  const [viewMode, setViewMode] = useState("list") // 'list' or 'grid'
  const [filter, setFilter] = useState({
    owner: "",
    status: "",
    dateRange: "",
  })

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      if (filter.owner && !project.owner.toLowerCase().includes(filter.owner.toLowerCase())) {
        return false
      }

      if (filter.status && (project.status || "active") !== filter.status) {
        return false
      }

      if (filter.dateRange) {
        const now = new Date()
        const projectDate = new Date(project.startDate)

        switch (filter.dateRange) {
          case "this_week":
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            if (projectDate < weekAgo) return false
            break
          case "this_month":
            if (projectDate.getMonth() !== now.getMonth() || projectDate.getFullYear() !== now.getFullYear())
              return false
            break
          case "this_quarter":
            const currentQuarter = Math.floor(now.getMonth() / 3)
            const projectQuarter = Math.floor(projectDate.getMonth() / 3)
            if (projectQuarter !== currentQuarter || projectDate.getFullYear() !== now.getFullYear()) return false
            break
          case "this_year":
            if (projectDate.getFullYear() !== now.getFullYear()) return false
            break
        }
      }

      return true
    })
  }, [projects, filter])

  const handleViewModeChange = (mode) => {
    setViewMode(mode)
  }

  const handleApplyFilter = (newFilter) => {
    setFilter(newFilter)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <ProjectsHeader
          projectCount={filteredProjects.length}
          onCreateProject={onCreateProject}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          onApplyFilter={handleApplyFilter}
          currentFilter={filter}
        />

        {viewMode === "list" ? (
          <ProjectsTable
            projects={filteredProjects}
            onUpdateProject={onUpdateProject}
            onDeleteProject={onDeleteProject}
            onManageMembers={onManageMembers}
            onManageTasks={onManageTasks}
            onManageFiles={onManageFiles}
            onOpenSlack={onOpenSlack}
            onEditProject={onEditProject}
          />
        ) : (
          <ProjectsGrid
            projects={filteredProjects}
            onUpdateProject={onUpdateProject}
            onDeleteProject={onDeleteProject}
            onManageMembers={onManageMembers}
            onManageTasks={onManageTasks}
            onManageFiles={onManageFiles}
            onOpenSlack={onOpenSlack}
            onEditProject={onEditProject}
          />
        )}
      </div>
    </div>
  )
}

export default ProjectsView
