"use client"

import { useState } from "react"
import { Modal } from "../ui/Modal"
import { Button } from "../ui/Button"

export const StatusUpdateModal = ({ isOpen, onClose, taskName = "Feature 1" }) => {
  const [message, setMessage] = useState(
    "Hi [Name], just checking in—any updates on task [Task Name]? Let us know if there are any blockers.",
  )

  const handleSend = () => {
    // Handle sending the status update
    console.log("Sending status update:", message)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request for Status Update" size="md">
      <div className="space-y-4">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your message..."
        />

        <div className="flex justify-end space-x-3">
          <Button variant="ghost" onClick={onClose}>
            EDIT
          </Button>
          <Button onClick={handleSend} className="bg-blue-500 hover:bg-blue-600">
            SEND
          </Button>
        </div>
      </div>
    </Modal>
  )
}
