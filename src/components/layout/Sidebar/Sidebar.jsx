"use client"
import { useState } from "react"
import NavItem from "./NavItem"

const Sidebar = ({ showMobileMenu, navItems }) => {
  const [expandedItems, setExpandedItems] = useState(["Projects"]) // Projects expanded by default

  const toggleExpanded = (itemName) => {
    setExpandedItems((prev) =>
      prev.includes(itemName) ? prev.filter((name) => name !== itemName) : [...prev, itemName],
    )
  }

  return (
    <aside
      className={`${showMobileMenu ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:relative z-40 w-64 h-screen bg-white/80 backdrop-blur-xl border-r border-gray-200/50 transition-transform duration-300`}
    >
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <NavItem
            key={item.name}
            item={item}
            isExpanded={expandedItems.includes(item.name)}
            onToggleExpanded={toggleExpanded}
          />
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
