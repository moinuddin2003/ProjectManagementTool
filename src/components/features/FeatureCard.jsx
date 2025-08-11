"use client"

export const FeatureCard = ({ feature, onClick, variant = "default" }) => {
  const getProgressColor = (value) => {
    if (value >= 70) return "bg-green-500"
    if (value >= 40) return "bg-orange-500"
    return "bg-gray-400"
  }

  if (variant === "detailed") {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700 w-24">DUE DATE</span>
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${getProgressColor(feature.progress.dueDate)}`}
              style={{ width: `${feature.progress.dueDate}%` }}
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700 w-24">STATUS</span>
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${getProgressColor(feature.progress.status)}`}
              style={{ width: `${feature.progress.status}%` }}
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700 w-24">PRIORITY</span>
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${getProgressColor(feature.progress.priority)}`}
              style={{ width: `${feature.progress.priority}%` }}
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700 w-24">DEPENDENCIES</span>
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${getProgressColor(feature.progress.dependencies)}`}
              style={{ width: `${feature.progress.dependencies}%` }}
            />
          </div>
        </div>
        <div className="pt-4">
          <span className="text-sm font-medium text-gray-700">DESCRIPTION</span>
          <div className="mt-2 h-16 bg-gray-100 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow ${
        feature.highlighted ? "ring-2 ring-blue-500" : ""
      }`}
      onClick={() => onClick(feature)}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-900">{feature.name}</h3>
        <div className="flex space-x-1">
          <div className="w-4 h-2 bg-blue-500 rounded"></div>
          <div className="w-4 h-2 bg-orange-500 rounded"></div>
          {feature.highlighted && <div className="w-4 h-2 bg-green-500 rounded"></div>}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <img
          src={feature.assignee.avatar || "/placeholder.svg"}
          alt={feature.assignee.name}
          className="w-6 h-6 rounded-full"
        />
        <div>
          <p className="text-sm font-medium text-gray-900">{feature.assignee.name}</p>
          <p className="text-xs text-gray-500">{feature.lastActivity}</p>
        </div>
      </div>
    </div>
  )
}
