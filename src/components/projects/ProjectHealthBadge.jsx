"use client"

import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { AlertTriangle, CheckCircle2, ChevronDown } from "lucide-react"

const ProjectHealthBadge = ({ health, healthColor, onHealthChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, position: "bottom" })
  const buttonRef = useRef(null)

  const healthOptions = [
    {
      value: "Good",
      color: "bg-gradient-to-r from-green-500 to-emerald-600",
      icon: CheckCircle2,
    },
    {
      value: "At Risk",
      color: "bg-gradient-to-r from-red-500 to-rose-600",
      icon: AlertTriangle,
    },
  ]

  // Get consistent color for health status
  const getHealthColor = (healthValue) => {
    const option = healthOptions.find((opt) => opt.value === healthValue)
    return option ? option.color : "bg-gradient-to-r from-gray-500 to-gray-600"
  }

  const currentOption = healthOptions.find((option) => option.value === health)
  const CurrentIcon = currentOption?.icon

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const spaceBelow = viewportHeight - buttonRect.bottom
      const spaceAbove = buttonRect.top

      let top, position
      if (spaceBelow < 120 && spaceAbove > 120) {
        // Show above
        top = buttonRect.top - 80
        position = "top"
      } else {
        // Show below
        top = buttonRect.bottom + 5
        position = "bottom"
      }

      setDropdownPosition({
        top,
        left: buttonRect.left,
        position,
      })
    }
  }, [isOpen])

  const handleSelect = (selectedHealth) => {
    onHealthChange(selectedHealth.value)
    setIsOpen(false)
  }

  const dropdownContent = isOpen && (
    <>
      <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      <div
        className="fixed bg-white rounded-lg shadow-2xl border border-gray-200 z-50 min-w-[120px]"
        style={{
          top: `${dropdownPosition.top}px`,
          left: `${dropdownPosition.left}px`,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        }}
      >
        {healthOptions.map((option) => {
          const OptionIcon = option.icon
          return (
            <button
              key={option.value}
              onClick={() => handleSelect(option)}
              className="w-full px-3 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors duration-150 flex items-center"
            >
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${option.color}`}
              >
                <OptionIcon className="w-3 h-3 mr-1" />
                {option.value}
              </span>
            </button>
          )
        })}
      </div>
    </>
  )

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white shadow-lg hover:shadow-xl transition-all duration-200 ${getHealthColor(health)}`}
      >
        {CurrentIcon && <CurrentIcon className="w-3 h-3 mr-1" />}
        {health}
        <ChevronDown className={`w-3 h-3 ml-1 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {typeof document !== "undefined" && createPortal(dropdownContent, document.body)}
    </div>
  )
}

export default ProjectHealthBadge
