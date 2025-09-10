import ProjectRow from "./ProjectRow"

const ProjectsTableHeader = () => {
  return (
    <thead className="bg-gray-50/80 backdrop-blur-sm">
      <tr>
        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Project Name</th>
        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Project Owner</th>
        {/* <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Project Health</th> */}
        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Start Date</th>
        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">End Date</th>
        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Actions</th>
      </tr>
    </thead>
  )
}

const ProjectsTableBody = ({
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
    <tbody className="divide-y divide-gray-100">
      {projects.map((project) => (
        <ProjectRow
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
    </tbody>
  )
}

const ProjectsTable = ({
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
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <ProjectsTableHeader />
          <ProjectsTableBody
            projects={projects}
            onUpdateProject={onUpdateProject}
            onDeleteProject={onDeleteProject}
            onManageMembers={onManageMembers}
            onManageTasks={onManageTasks}
            onManageFiles={onManageFiles}
            onOpenSlack={onOpenSlack}
            onEditProject={onEditProject}
          />
        </table>
      </div>
    </div>
  )
}

export default ProjectsTable
