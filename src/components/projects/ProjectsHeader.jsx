"use client"

import { Plus, Filter, ChevronDown, Grid3X3, List } from "lucide-react"

const ProjectsControls = ({ onCreateProject }) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center bg-white/60 backdrop-blur-sm rounded-xl p-1 border border-white/20 shadow-lg">
        <button className="flex items-center px-4 py-2.5 bg-white text-slate-700 rounded-lg shadow-sm transition-all duration-200 font-medium">
          <List className="w-4 h-4 mr-2" />
          <span className="text-sm">List</span>
        </button>
        <button className="flex items-center px-4 py-2.5 text-slate-500 hover:text-slate-700 rounded-lg transition-all duration-200 font-medium">
          <Grid3X3 className="w-4 h-4 mr-2" />
          <span className="text-sm">Grid</span>
        </button>
      </div>

      <button className="flex items-center px-5 py-2.5 bg-white/60 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/80 transition-all duration-200 shadow-lg hover:shadow-xl">
        <Filter className="w-4 h-4 text-slate-500 mr-2" />
        <span className="text-sm font-medium text-slate-700">Filter</span>
        <ChevronDown className="w-4 h-4 text-slate-400 ml-2" />
      </button>

      <button
        onClick={onCreateProject}
        className="flex items-center px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
      >
        <Plus className="w-4 h-4 mr-2" />
        <span className="text-sm">Create Project</span>
      </button>
    </div>
  )
}

const ProjectsHeader = ({ projectCount = 0, onCreateProject }) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
      <div className="space-y-3">
        <h1 className="text-5xl font-bold text-slate-900 tracking-tight">
          Projects
          <span className="text-3xl font-normal text-slate-500 ml-3">({projectCount})</span>
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed max-w-2xl">
          Manage and track your active projects with enhanced visibility and modern tools
        </p>
      </div>
      <ProjectsControls onCreateProject={onCreateProject} />
    </div>
  )
}

export default ProjectsHeader
