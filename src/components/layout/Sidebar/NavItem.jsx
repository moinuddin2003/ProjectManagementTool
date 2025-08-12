"use client"
import { ChevronDown } from "lucide-react"

const NavItem = ({ item, isActive, isExpanded, onToggleExpanded, onClick, onSubItemClick, selectedNav }) => {
  const Icon = item.icon
  const hasSubItems = item.subItems && item.subItems.length > 0

  const handleMainClick = () => {
    if (hasSubItems) {
      onToggleExpanded(item.name)
    }
    onClick()
  }

  return (
    <div>
      {/* Main Navigation Item */}
      <button
        onClick={handleMainClick}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
          isActive
            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
            : "text-gray-700 hover:bg-gray-100/80 hover:text-gray-900"
        }`}
      >
        <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-500 group-hover:text-gray-700"}`} />
        <span className="font-medium">{item.name}</span>

        {/* Show chevron for expandable items */}
        {hasSubItems && (
          <ChevronDown
            className={`ml-auto w-4 h-4 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            } ${isActive ? "text-white" : "text-gray-500 group-hover:text-gray-700"}`}
          />
        )}

        {/* Keep the original blue dot for Tasks when it's not a subitem */}
        {item.name === "Tasks" && !hasSubItems && <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full"></div>}
      </button>

      {/* Sub Items */}
      {hasSubItems && isExpanded && (
        <div className="ml-4 mt-1 space-y-1">
          {item.subItems.map((subItem) => {
            const SubIcon = subItem.icon
            const isSubActive = selectedNav === subItem.name

            return (
              <button
                key={subItem.name}
                onClick={() => onSubItemClick(subItem)}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-200 group ${
                  isSubActive
                    ? "bg-gradient-to-r from-blue-400 to-purple-400 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                }`}
              >
                <SubIcon
                  className={`w-4 h-4 ${isSubActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"}`}
                />
                <span className="font-medium text-sm">{subItem.name}</span>

                {/* Blue dot for Tasks when it's a subitem */}
                {subItem.name === "Tasks" && <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full"></div>}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default NavItem
