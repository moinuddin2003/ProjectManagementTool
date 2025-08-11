"use client"
import { ProgressBar } from "../ui/ProgressBar"

export const FeatureCard = ({ feature, onClick, variant = "grid" }) => {
  if (variant === "detailed") {
    return (
      <div
        className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => onClick(feature)}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{feature.name}</h3>
          <div className="flex items-center space-x-2">
            <img
              src={feature.assignee.avatar || "/placeholder.svg?height=32&width=32"}
              alt={feature.assignee.name}
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm text-gray-600">{feature.assignee.name}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">DUE DATE</span>
            </div>
            <ProgressBar value={feature.dueDate} color="orange" />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">STATUS</span>
            </div>
            <ProgressBar value={feature.status} color="gray" />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">PRIORITY</span>
            </div>
            <ProgressBar value={feature.priority} color="gray" />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">DEPENDENCIES</span>
            </div>
            <ProgressBar value={feature.dependencies} color="gray" />
          </div>

          <div>
            <div className="text-sm text-gray-600 mb-2">DESCRIPTION</div>
            <div className="bg-gray-100 rounded p-3 text-sm text-gray-700">{feature.description}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onClick(feature)}
    >
      <div className="mb-3">
        <h3 className="font-medium text-gray-900 mb-2">{feature.name}</h3>
        <div className="flex space-x-2 mb-3">
          <ProgressBar value={feature.dueDate} color={feature.statusColor} className="flex-1" />
          <ProgressBar value={feature.status} color="orange" className="flex-1" />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <img
          src={feature.assignee.avatar || "/placeholder.svg?height=24&width=24"}
          alt={feature.assignee.name}
          className="w-6 h-6 rounded-full"
        />
        <div>
          <div className="text-sm font-medium text-gray-900">{feature.assignee.name}</div>
          <div className="text-xs text-gray-500">{feature.lastActivity}</div>
        </div>
      </div>
    </div>
  )
}
