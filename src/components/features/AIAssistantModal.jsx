"use client"

import { useState } from "react"
import { Modal } from "../ui/Modal"
import { Button } from "../ui/Button"
import { Bot } from "lucide-react"

export const AIAssistantModal = ({ isOpen, onClose, taskName = "X" }) => {
  const [selectedOption, setSelectedOption] = useState("")

  const options = ["Request for Status Update", "Clarify Requirements", "write status summary", "Detect Risk", "Other"]

  const handleProceed = () => {
    if (selectedOption) {
      // Handle the selected option
      console.log("Selected option:", selectedOption)
      onClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-gray-600" />
          </div>
        </div>

        <h3 className="text-lg font-medium text-gray-900 mb-2">Hello, I'm Ali! Your AI Assistant.</h3>

        <p className="text-gray-600 mb-6">What do you need help with today regarding task {taskName}?</p>

        <div className="space-y-2 mb-6">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => setSelectedOption(option)}
              className={`w-full p-3 text-left rounded-lg border transition-colors ${
                selectedOption === option
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:border-gray-300 text-gray-700"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="flex space-x-3 justify-center">
          <Button variant="ghost" onClick={onClose}>
            CANCEL
          </Button>
          <Button onClick={handleProceed} disabled={!selectedOption} className="bg-blue-500 hover:bg-blue-600">
            PROCEED
          </Button>
        </div>
      </div>
    </Modal>
  )
}
