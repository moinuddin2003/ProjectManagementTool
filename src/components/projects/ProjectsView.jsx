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
    <div className="space-y-6">
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
  )
}

export default ProjectsView
