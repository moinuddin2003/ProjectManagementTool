"use client"

import { useState } from "react"
import { Header } from "./components/layout/Header"
import { Sidebar } from "./components/layout/Sidebar"
import { Footer } from "./components/layout/Footer"
import LoginPage from "./components/auth/LoginPage"
import { ProjectsTable } from "./components/features/ProjectsTable"
import { FeatureCard } from "./components/features/FeatureCard"
import { AIAssistantModal } from "./components/features/AIAssistantModal"
import { StatusUpdateModal } from "./components/features/StatusUpdateModal"
import { CreateProjectModal } from "./components/features/CreateProjectModal"
import { Button } from "./components/ui/Button"
import { useAuth } from "./hooks/useAuth"
import { mockProjects, mockFeatures } from "./data/mockData"
import { Bot } from "lucide-react"

function App() {
  const { isLoggedIn, loginForm, setLoginForm, isLoading, handleLogin } = useAuth()

  const [activeMenuItem, setActiveMenuItem] = useState("projects")
  const [sidebarOpen, setSidebarOpen] = useState(false) // Default to false for mobile-first
  const [selectedFeature, setSelectedFeature] = useState(null)
  const [showAIModal, setShowAIModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false) // Added create project modal state
  const [comment, setComment] = useState("")

  if (!isLoggedIn) {
    return <LoginPage loginForm={loginForm} setLoginForm={setLoginForm} onLogin={handleLogin} isLoading={isLoading} />
  }

  const renderContent = () => {
    switch (activeMenuItem) {
      case "projects":
        return (
          <div className="space-y-4 sm:space-y-6">
            <ProjectsTable
              projects={mockProjects}
              onCreateProject={() => setShowCreateProjectModal(true)} // Pass create project handler
            />
          </div>
        )
      case "tasks":
        if (selectedFeature) {
          return (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSelectedFeature(null)}
                  className="text-blue-600 hover:text-blue-800 text-sm sm:text-base"
                >
                  ← Back to Dashboard Features
                </button>
              </div>
              <div className="bg-white rounded-lg shadow">
                <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Dashboard features</h2>
                    <Button
                      onClick={() => setShowAIModal(true)}
                      className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 w-full sm:w-auto"
                    >
                      <Bot className="w-4 h-4" />
                      <span>Ask AI</span>
                    </Button>
                  </div>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-base sm:text-lg font-medium text-gray-900">{selectedFeature.name}</h3>
                      <img
                        src={selectedFeature.assignee.avatar || "/placeholder.svg?height=32&width=32"}
                        alt={selectedFeature.assignee.name}
                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
                      />
                      <span className="text-xs sm:text-sm text-gray-600">{selectedFeature.assignee.name}</span>
                    </div>
                    <Button
                      onClick={() => setShowStatusModal(true)}
                      className="bg-blue-500 hover:bg-blue-600 w-full sm:w-auto"
                    >
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
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-lg shadow">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Dashboard Features</h2>
              </div>
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
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
      <div className="flex flex-1 relative">
        <Sidebar
          activeItem={activeMenuItem}
          onItemClick={setActiveMenuItem}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}
        <main className="flex-1 p-4 sm:p-6 lg:ml-0">{renderContent()}</main>
      </div>
      <Footer />

      <AIAssistantModal isOpen={showAIModal} onClose={() => setShowAIModal(false)} taskName={selectedFeature?.name} />
      <StatusUpdateModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        taskName={selectedFeature?.name}
      />
      <CreateProjectModal isOpen={showCreateProjectModal} onClose={() => setShowCreateProjectModal(false)} />
    </div>
  )
}

export default App
