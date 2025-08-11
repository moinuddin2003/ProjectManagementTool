"use client"

import { useState } from "react"
import { Header } from "./components/layout/Header"
import { Sidebar } from "./components/layout/Sidebar"
import { Footer } from "./components/layout/Footer"
import { LoginForm } from "./components/features/LoginForm"
import { ProjectsTable } from "./components/features/ProjectsTable"
import { FeatureCard } from "./components/features/FeatureCard"
import { AIAssistantModal } from "./components/features/AIAssistantModal"
import { StatusUpdateModal } from "./components/features/StatusUpdateModal"
import { Button } from "./components/ui/Button"
import { useAuth } from "./hooks/useAuth"
import { mockProjects, mockFeatures } from "./data/mockData"
import { Bot } from "lucide-react"

function App() {
  const { isAuthenticated, login } = useAuth()
  const [activeMenuItem, setActiveMenuItem] = useState("projects")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedFeature, setSelectedFeature] = useState(null)
  const [showAIModal, setShowAIModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [comment, setComment] = useState("")

  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />
  }

  const renderContent = () => {
    switch (activeMenuItem) {
      case "projects":
        return (
          <div className="space-y-6">
            <ProjectsTable projects={mockProjects} />
          </div>
        )

      case "tasks":
        if (selectedFeature) {
          return (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <button onClick={() => setSelectedFeature(null)} className="text-blue-600 hover:text-blue-800">
                  ← Back to Dashboard Features
                </button>
              </div>

              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Dashboard features</h2>
                    <Button
                      onClick={() => setShowAIModal(true)}
                      className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600"
                    >
                      <Bot className="w-4 h-4" />
                      <span>Ask AI</span>
                    </Button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900">{selectedFeature.name}</h3>
                      <img
                        src={selectedFeature.assignee.avatar || "/placeholder.svg?height=32&width=32"}
                        alt={selectedFeature.assignee.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-sm text-gray-600">{selectedFeature.assignee.name}</span>
                    </div>
                    <Button onClick={() => setShowStatusModal(true)} className="bg-blue-500 hover:bg-blue-600">
                      + ADD SUBTASK
                    </Button>
                  </div>

                  <FeatureCard feature={selectedFeature} onClick={() => {}} variant="detailed" />

                  <div className="mt-6">
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add a comment"
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        }

        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Dashboard Features</h2>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockFeatures.map((feature) => (
                    <FeatureCard key={feature.id} feature={feature} onClick={setSelectedFeature} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {activeMenuItem.charAt(0).toUpperCase() + activeMenuItem.slice(1).replace("-", " ")}
            </h2>
            <p className="text-gray-600">This section is under development.</p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1">
        <Sidebar activeItem={activeMenuItem} onItemClick={setActiveMenuItem} isOpen={sidebarOpen} />

        <main className="flex-1 p-6">{renderContent()}</main>
      </div>

      <Footer />

      <AIAssistantModal isOpen={showAIModal} onClose={() => setShowAIModal(false)} taskName={selectedFeature?.name} />

      <StatusUpdateModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        taskName={selectedFeature?.name}
      />
    </div>
  )
}

export default App
