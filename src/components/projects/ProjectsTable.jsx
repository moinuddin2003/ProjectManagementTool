import ProjectRow from "./ProjectRow"

const ProjectsTableHeader = () => {
  return (
    <thead className="bg-gradient-to-r from-slate-50 to-slate-100/50 backdrop-blur-sm">
      <tr>
        <th className="text-left px-8 py-6 text-xs font-bold text-slate-700 tracking-wider uppercase border-b border-slate-200/50">
          Project Name
        </th>
        <th className="text-left px-8 py-6 text-xs font-bold text-slate-700 tracking-wider uppercase border-b border-slate-200/50">
          Project Owner
        </th>
        <th className="text-left px-8 py-6 text-xs font-bold text-slate-700 tracking-wider uppercase border-b border-slate-200/50">
          Start Date
        </th>
        <th className="text-left px-8 py-6 text-xs font-bold text-slate-700 tracking-wider uppercase border-b border-slate-200/50">
          End Date
        </th>
        <th className="text-left px-8 py-6 text-xs font-bold text-slate-700 tracking-wider uppercase border-b border-slate-200/50">
          Actions
        </th>
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
    /* Enhanced modern card styling with glass morphism effect */
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
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
