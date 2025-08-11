"use client"
import { FolderOpen, CheckSquare, BarChart3, Users, MessageCircle, Brain } from "lucide-react"

const menuItems = [
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "tasks", label: "Tasks", icon: CheckSquare },
  { id: "status-update", label: "Status Update", icon: BarChart3 },
  { id: "ai-status-update", label: "AI Status Update", icon: Brain },
  { id: "ai-summaries", label: "AI Summaries", icon: Brain },
  { id: "reporting", label: "Reporting", icon: BarChart3 },
  { id: "users", label: "Users", icon: Users },
  { id: "chat", label: "Chat", icon: MessageCircle },
]

export const Sidebar = ({ activeItem, onItemClick, isOpen = true }) => {
  return (
    <aside
      className={`bg-gray-50 border-r border-gray-200 transition-all duration-300 ${isOpen ? "w-64" : "w-0 overflow-hidden"} lg:w-64`}
    >
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeItem === item.id

          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                isActive
                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {item.id === "tasks" && isActive && <div className="w-2 h-2 bg-blue-500 rounded-full ml-auto" />}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
