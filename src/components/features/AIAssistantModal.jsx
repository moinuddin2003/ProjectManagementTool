"use client"

import { useState } from "react"
import { X, Bot } from "lucide-react"

export const AIAssistantModal = ({ isOpen, onClose, taskName }) => {
  const [selectedOption, setSelectedOption] = useState("")

  if (!isOpen) return null

  const options = ["Request for Status Update", "Clarify Requirements", "write status summary", "Detect Risk", "Other"]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-blue-600" />
            <span className="font-medium">AI Assistant</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <p className="text-sm text-gray-700 mb-4">
            Hello, I'm Ali! Your AI Assistant. What do you need help with today regarding task {taskName}?
          </p>

          <div className="space-y-2 mb-4">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => setSelectedOption(option)}
                className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                  selectedOption === option ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="flex justify-end space-x-2">
            <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
              CANCEL
            </button>
            <button onClick={onClose} className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
              PROCEED
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
