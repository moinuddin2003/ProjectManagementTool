import ProjectsHeader from "./ProjectsHeader"
import ProjectsTable from "./ProjectsTable"

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
  return (
    /* Enhanced background with beautiful gradient and better spacing */
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <ProjectsHeader projectCount={projects.length} onCreateProject={onCreateProject} />
        <ProjectsTable
          projects={projects}
          onUpdateProject={onUpdateProject}
          onDeleteProject={onDeleteProject}
          onManageMembers={onManageMembers}
          onManageTasks={onManageTasks}
          onManageFiles={onManageFiles}
          onOpenSlack={onOpenSlack}
          onEditProject={onEditProject}
        />
      </div>
    </div>
  )
}

export default ProjectsView
