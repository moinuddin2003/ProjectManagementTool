"use client"
import { Plus, Filter, ChevronDown } from "lucide-react"

const ProjectsControls = ({ onCreateProject }) => {
  return (
    <div className="flex items-center space-x-3">
      <button className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
        <span className="text-sm text-gray-700">List View</span>
        <ChevronDown className="w-4 h-4 text-gray-500 ml-2" />
      </button>
      <button className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
        <Filter className="w-4 h-4 text-gray-500 mr-2" />
        <span className="text-sm text-gray-700">Filter</span>
      </button>
      <button
        onClick={onCreateProject}
        className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
      >
        <Plus className="w-4 h-4 mr-2" />
        <span className="text-sm font-medium">Create Project</span>
      </button>
    </div>
  )
}

const ProjectsHeader = ({ projectCount = 0, onCreateProject }) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Projects ({projectCount})
        </h1>
        <p className="text-gray-600 mt-1">Manage and track your active projects</p>
      </div>
      <ProjectsControls onCreateProject={onCreateProject} />
    </div>
  )
}

export default ProjectsHeader
