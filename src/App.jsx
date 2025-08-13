"use client"
import { useState } from "react"
import DashboardLayout from "./components/layout/DashboardLayout/DashboardLayout"
import LoginPage from "./components/auth/LoginPage"
import ProjectsView from "./components/projects/ProjectsView"
import { FeatureCard } from "./components/features/FeatureCard"
import { AIAssistantModal } from "./components/features/AIAssistantModal"
import { StatusUpdateModal } from "./components/features/StatusUpdateModal"
import { CreateProjectModal } from "./components/features/CreateProjectModal"
import { Button } from "./components/ui/Button"
import { useAuth } from "./hooks/useAuth"
import { mockProjects, mockFeatures } from "./data/mockData"
import { Bot, FolderOpen, CheckSquare, Users, MessageCircle, AlertCircle, FileText } from "lucide-react"

function App() {
  const { isLoggedIn, loginForm, setLoginForm, isLoading, handleLogin } = useAuth()

  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [selectedNav, setSelectedNav] = useState("Projects")
  const [selectedFeature, setSelectedFeature] = useState(null)
  const [showAIModal, setShowAIModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false)
  const [projects, setProjects] = useState(mockProjects)
  const [comment, setComment] = useState("")
  // Navigation items structure
  const navItems = [
    {
      name: "Projects",
      icon: FolderOpen,
      subItems: [
        { name: "All Projects", icon: FolderOpen },
        { name: "Active Projects", icon: CheckSquare },
      ],
    },
    { name: "Tasks", icon: CheckSquare },
    { name: "AI Status Update", icon: AlertCircle },
    { name: "AI Summaries", icon: FileText },
    { name: "Users", icon: Users },
    { name: "Chat", icon: MessageCircle },
  ]

  const handleNavClick = (item) => {
    setSelectedNav(item.name)
    setShowMobileMenu(false) // Close mobile menu when item is clicked
  }

  const handleCreateProject = () => {
    // console.log("Opening create project modal") // Added debug log
    setShowCreateProjectModal(true)
  }

  const handleProjectCreated = (projectData) => {
    // console.log("Form data received:", projectData)

    const getHealthStatus = (projectType) => {
      const healthMap = {
        "Software Development": "Good",
        Marketing: "At Risk",
        Construction: "Good",
        Internal: "Good",
        Research: "At Risk",
      }
      return healthMap[projectType] || "Good"
    }

    const getHealthColor = (health) => {
      const colorMap = {
        Good: "green",
        "At Risk": "red",
        "On Hold": "yellow",
        Completed: "blue",
      }
      return colorMap[health] || "green"
    }

    const health = getHealthStatus(projectData.projectType)

    const newProject = {
      id: Date.now(),
      name: projectData.projectName,
      owner: projectData.client || "Carter Kenter",
      health: health,
      healthColor: getHealthColor(health),
      startDate: new Date(projectData.startDate).toLocaleDateString(),
      endDate: new Date(projectData.endDate).toLocaleDateString(),
      description: projectData.description,
      type: projectData.projectType,
      client: projectData.client,
      estimatedDuration: projectData.estimatedDuration,
    }

    // console.log("Creating new project:", newProject)
    // console.log("Current projects before update:", projects)

    const updatedProjects = [newProject, ...projects]
    // console.log("Updated projects array:", updatedProjects)
    // console.log("New projects count:", updatedProjects.length)

    setProjects(updatedProjects)
    setShowCreateProjectModal(false)

    // setTimeout(() => {
    //   console.log("Final projects state:", updatedProjects.length)
    //   setDummyState((prev) => !prev)
    // }, 100)
  }

  const renderContent = () => {
    switch (selectedNav) {
      case "Projects":
      case "All Projects":
      case "Active Projects":
        // console.log("Rendering projects view with", projects.length, "projects") // Added debug log
        return (
          <div className="space-y-6">
            <ProjectsView projects={projects} onCreateProject={handleCreateProject} />
          </div>
        )
      case "Tasks":
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
              {selectedNav.charAt(0).toUpperCase() + selectedNav.slice(1).replace("-", " ")}
            </h2>
            <p className="text-gray-600">This section is under development.</p>
          </div>
        )
    }
  }

  if (!isLoggedIn) {
    return <LoginPage loginForm={loginForm} setLoginForm={setLoginForm} onLogin={handleLogin} isLoading={isLoading} />
  }

  return (
    <DashboardLayout
      showMobileMenu={showMobileMenu}
      setShowMobileMenu={setShowMobileMenu}
      selectedNav={selectedNav}
      onNavClick={handleNavClick}
      navItems={navItems}
    >
      {renderContent()}
      <AIAssistantModal isOpen={showAIModal} onClose={() => setShowAIModal(false)} taskName={selectedFeature?.name} />
      <StatusUpdateModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        taskName={selectedFeature?.name}
      />
      <CreateProjectModal
        isOpen={showCreateProjectModal}
        onClose={() => setShowCreateProjectModal(false)}
        onProjectCreated={handleProjectCreated}
      />
    </DashboardLayout>
  )
}

export default App
