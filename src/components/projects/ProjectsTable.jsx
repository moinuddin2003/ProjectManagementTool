"use client"

import ProjectRow from "./ProjectRow"

const ProjectsTableHeader = () => {
  return (
    <thead className="bg-gray-50/80 backdrop-blur-sm">
      <tr>
        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Project Name</th>
        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Project Owner</th>
        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Project Health</th>
        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Start Date</th>
        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">End Date</th>
      </tr>
    </thead>
  )
}

const ProjectsTableBody = ({ projects }) => {
  return (
    <tbody className="divide-y divide-gray-100">
      {projects.map((project) => (
        <ProjectRow key={project.id} project={project} />
      ))}
    </tbody>
  )
}

const ProjectsTable = ({ projects }) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <ProjectsTableHeader />
          <ProjectsTableBody projects={projects} />
        </table>
      </div>
    </div>
  )
}

export default ProjectsTable
