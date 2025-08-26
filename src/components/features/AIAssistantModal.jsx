"use client"

import { useState } from "react"

export const AIAssistantModal = ({ isOpen, onClose, taskName }) => {
  const [selectedOption, setSelectedOption] = useState("")

  if (!isOpen) return null

  // const options = ["Request for Status Update", "Clarify Requirements", "Write Status Summary", "Detect Risk", "Other"]

  const handleProceed = () => {
    if (selectedOption) {
      console.log("Selected option:", selectedOption)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
        <div className="flex justify-end p-4 pb-0">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 pb-6">
          <h2 className="text-xl font-medium text-gray-900 mb-4">Hello, I'm Ali! Your AI Assistant.</h2>

          <p className="text-gray-600 mb-6">What do you need help with today regarding task {taskName}?</p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <button
              onClick={() => setSelectedOption("Request for Status Update")}
              className={`col-span-1 px-4 py-3 text-sm font-medium rounded-full transition-colors ${
                selectedOption === "Request for Status Update"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Request for Status Update
            </button>
            <button
              onClick={() => setSelectedOption("Clarify Requirements")}
              className={`col-span-1 px-4 py-3 text-sm font-medium rounded-full transition-colors ${
                selectedOption === "Clarify Requirements"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Clarify Requirements
            </button>
            <button
              onClick={() => setSelectedOption("write status summary")}
              className={`px-4 py-3 text-sm font-medium rounded-full transition-colors ${
                selectedOption === "write status summary"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Write Status Summary
            </button>
            <button
              onClick={() => setSelectedOption("Detect Risk")}
              className={`px-4 py-3 text-sm font-medium rounded-full transition-colors ${
                selectedOption === "Detect Risk"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Detect Risk
            </button>
            <button
              onClick={() => setSelectedOption("Other")}
              className={`px-4 py-3 text-sm font-medium rounded-full transition-colors ${
                selectedOption === "Other" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Other
            </button>
          </div>

          <div className="flex justify-end space-x-4">
            <button onClick={onClose} className="px-6 py-2 text-sm font-medium text-blue-600 hover:text-blue-700">
              CANCEL
            </button>
            <button
              onClick={handleProceed}
              disabled={!selectedOption}
              className="px-6 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 disabled:text-gray-400"
            >
              PROCEED
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
