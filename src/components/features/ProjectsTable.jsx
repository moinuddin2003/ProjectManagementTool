"use client"
import { ChevronDown, Filter } from "react-feather"

export const ProjectsTable = ({ projects, onCreateProject }) => {
  const getHealthBadge = (health) => {
    const colors = {
      "At Risk": "bg-red-100 text-red-800",
      Good: "bg-green-100 text-green-800",
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[health] || "bg-gray-100 text-gray-800"}`}>
        {health}
      </span>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Projects ({projects.length})</h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <button className="flex items-center justify-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg">
              <span>List View</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            <button className="flex items-center justify-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
            <button
              onClick={onCreateProject}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              + Create Project
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project Owner
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project Health
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Start Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                End Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{project.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.owner}</td>
                <td className="px-6 py-4 whitespace-nowrap">{getHealthBadge(project.health)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.startDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.endDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
