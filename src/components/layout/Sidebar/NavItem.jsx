
import { ChevronDown } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

const NavItem = ({ item, isExpanded, onToggleExpanded }) => {
  const location = useLocation()
  const Icon = item.icon
  const hasSubItems = item.subItems && item.subItems.length > 0

  const isActive =
    location.pathname === item.path ||
    (hasSubItems && item.subItems.some((subItem) => location.pathname === subItem.path))

  const handleMainClick = (e) => {
    if (hasSubItems) {
      e.preventDefault()
      onToggleExpanded(item.name)
    }
  }

  const NavButton = ({ children, to, onClick }) => {
    if (to && !hasSubItems) {
      return (
        <Link
          to={to}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
            isActive
              ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
              : "text-gray-700 hover:bg-gray-100/80 hover:text-gray-900"
          }`}
        >
          {children}
        </Link>
      )
    }

    return (
      <button
        onClick={onClick}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
          isActive
            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
            : "text-gray-700 hover:bg-gray-100/80 hover:text-gray-900"
        }`}
      >
        {children}
      </button>
    )
  }

  return (
    <div>
      {/* Main Navigation Item */}
      <NavButton to={item.path} onClick={handleMainClick}>
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
      </NavButton>

      {/* Sub Items */}
      {hasSubItems && isExpanded && (
        <div className="ml-4 mt-1 space-y-1">
          {item.subItems.map((subItem) => {
            const SubIcon = subItem.icon
            const isSubActive = location.pathname === subItem.path

            return (
              <Link
                key={subItem.name}
                to={subItem.path}
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
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default NavItem
