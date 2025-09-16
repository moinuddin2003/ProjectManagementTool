import { useState } from "react"
import { Plus, Filter, ChevronDown, Grid3X3, List, X } from "lucide-react"

const FilterDropdown = ({ isOpen, onClose, onApplyFilter, currentFilter }) => {
  const [tempFilter, setTempFilter] = useState(currentFilter)

  const handleApply = () => {
    onApplyFilter(tempFilter)
    onClose()
  }

  const handleClear = () => {
    const clearedFilter = { owner: "", status: "", dateRange: "" }
    setTempFilter(clearedFilter)
    onApplyFilter(clearedFilter)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 z-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-900">Filter Projects</h3>
        <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
          <X className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Owner Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Project Owner</label>
          <input
            type="text"
            placeholder="Filter by owner name..."
            value={tempFilter.owner}
            onChange={(e) => setTempFilter({ ...tempFilter, owner: e.target.value })}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
          <select
            value={tempFilter.status}
            onChange={(e) => setTempFilter({ ...tempFilter, status: e.target.value })}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="open">Active</option>
            <option value="completed">Completed</option>
            <option value="in_progress">In Progress</option>
          </select>
        </div>

        {/* Date Range Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Date Range</label>
          <select
            value={tempFilter.dateRange}
            onChange={(e) => setTempFilter({ ...tempFilter, dateRange: e.target.value })}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">All Time</option>
            <option value="this_week">This Week</option>
            <option value="this_month">This Month</option>
            <option value="this_quarter">This Quarter</option>
            <option value="this_year">This Year</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={handleClear}
          className="flex-1 px-4 py-2 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Clear All
        </button>
        <button
          onClick={handleApply}
          className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Apply Filter
        </button>
      </div>
    </div>
  )
}

const ProjectsControls = ({ onCreateProject, viewMode, onViewModeChange, onApplyFilter, currentFilter }) => {
  const [showFilter, setShowFilter] = useState(false)

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center bg-white/60 backdrop-blur-sm rounded-xl p-1 border border-white/20 shadow-lg">
        <button
          onClick={() => onViewModeChange("list")}
          className={`flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 font-medium ${
            viewMode === "list" ? "bg-white text-slate-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <List className="w-4 h-4 mr-2" />
          <span className="text-sm">List</span>
        </button>
        <button
          onClick={() => onViewModeChange("grid")}
          className={`flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 font-medium ${
            viewMode === "grid" ? "bg-white text-slate-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <Grid3X3 className="w-4 h-4 mr-2" />
          <span className="text-sm">Grid</span>
        </button>
      </div>

      <div className="relative">
        <button
          onClick={() => setShowFilter(!showFilter)}
          className={`flex items-center px-5 py-2.5 bg-white/60 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/80 transition-all duration-200 shadow-lg hover:shadow-xl ${
            Object.values(currentFilter).some((value) => value !== "") ? "ring-2 ring-indigo-500" : ""
          }`}
        >
          <Filter className="w-4 h-4 text-slate-500 mr-2" />
          <span className="text-sm font-medium text-slate-700">Filter</span>
          {Object.values(currentFilter).some((value) => value !== "") && (
            <div className="w-2 h-2 bg-indigo-500 rounded-full ml-2"></div>
          )}
          <ChevronDown
            className={`w-4 h-4 text-slate-400 ml-2 transition-transform ${showFilter ? "rotate-180" : ""}`}
          />
        </button>

        <FilterDropdown
          isOpen={showFilter}
          onClose={() => setShowFilter(false)}
          onApplyFilter={onApplyFilter}
          currentFilter={currentFilter}
        />
      </div>

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

const ProjectsHeader = ({
  projectCount = 0,
  onCreateProject,
  viewMode,
  onViewModeChange,
  onApplyFilter,
  currentFilter,
}) => {
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
      <ProjectsControls
        onCreateProject={onCreateProject}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        onApplyFilter={onApplyFilter}
        currentFilter={currentFilter}
      />
    </div>
  )
}

export default ProjectsHeader
