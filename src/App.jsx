import { useState } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, useNavigate } from "react-router-dom"
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
      path: "/projects"
    },
    { name: "Tasks", icon: CheckSquare, path: "/tasks" },
    { name: "AI Status Update", icon: AlertCircle, path: "/ai-status" },
    { name: "AI Summaries", icon: FileText, path: "/ai-summaries" },
    { name: "Users", icon: Users, path: "/users" },
    { name: "Chat", icon: MessageCircle, path: "/chat" },
  ]

  const handleCreateProject = () => {
    setShowCreateProjectModal(true)
  }

  const handleProjectCreated = (projectData) => {
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

    const updatedProjects = [newProject, ...projects]
    setProjects(updatedProjects)
    setShowCreateProjectModal(false)
  }

  // Projects List Route Component
  const ProjectsListRoute = () => {
    const navigate = useNavigate()
    
    const handleProjectClick = (project) => {
      navigate(`/projects/${project.id}`)
    }

    return (
      <div className="space-y-6">
        <ProjectsView 
          projects={projects} 
          onCreateProject={handleCreateProject}
          onProjectClick={handleProjectClick}
        />
      </div>
    )
  }

  // Individual Project Route Component
  const ProjectDetailRoute = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const project = projects.find(p => p.id === parseInt(id))

    if (!project) {
      return <Navigate to="/projects" replace />
    }

    // Convert project to feature-like structure for FeatureCard
    const projectAsFeature = {
      id: project.id,
      name: project.name,
      assignee: {
        name: project.owner,
        avatar: "https://xsgames.co/randomusers/assets/avatars/male/18.jpg"
      },
      progress: {
        dueDate: 75,
        status: project.health === "Good" ? 80 : project.health === "At Risk" ? 45 : 60,
        priority: 70,
        dependencies: 65,
      },
      lastActivity: "Last activity...",
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate("/projects")} 
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Projects
          </button>
        </div>
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Project Details</h2>
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
                <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                <img
                  src={projectAsFeature.assignee.avatar}
                  alt={project.owner}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm text-gray-600">{project.owner}</span>
              </div>
              <Button onClick={() => setShowStatusModal(true)} className="bg-blue-500 hover:bg-blue-600">
                + ADD SUBTASK
              </Button>
            </div>
            <FeatureCard feature={projectAsFeature} onClick={() => {}} variant="detailed" />
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

  // Tasks List Route Component
  const TasksListRoute = () => {
    const navigate = useNavigate()
    
    const handleFeatureClick = (feature) => {
      navigate(`/tasks/${feature.id}`)
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
                <FeatureCard key={feature.id} feature={feature} onClick={handleFeatureClick} />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Individual Task Route Component
  const TaskDetailRoute = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const selectedFeature = mockFeatures.find(f => f.id === parseInt(id))

    if (!selectedFeature) {
      return <Navigate to="/tasks" replace />
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate("/tasks")} 
            className="text-blue-600 hover:text-blue-800"
          >
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

  const GenericPageContent = ({ title }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        {title.charAt(0).toUpperCase() + title.slice(1).replace("-", " ")}
      </h2>
      <p className="text-gray-600">This section is under development.</p>
    </div>
  )

  if (!isLoggedIn) {
    return (
      <Router>
        <Routes>
          <Route
            path="*"
            element={
              <LoginPage
                loginForm={loginForm}
                setLoginForm={setLoginForm}
                onLogin={handleLogin}
                isLoading={isLoading}
              />
            }
          />
        </Routes>
      </Router>
    )
  }

  return (
    <Router>
      <DashboardLayout showMobileMenu={showMobileMenu} setShowMobileMenu={setShowMobileMenu} navItems={navItems}>
        <Routes>
          <Route path="/login" element={<Navigate to="/projects" replace />} />
          
          {/* Projects Routes */}
          <Route path="/projects" element={<ProjectsListRoute />} />
          <Route path="/projects/:id" element={<ProjectDetailRoute />} />
          
          {/* Tasks Routes */}
          <Route path="/tasks" element={<TasksListRoute />} />
          <Route path="/tasks/:id" element={<TaskDetailRoute />} />
          
          {/* Other Routes */}
          <Route path="/ai-status" element={<GenericPageContent title="AI Status Update" />} />
          <Route path="/ai-summaries" element={<GenericPageContent title="AI Summaries" />} />
          <Route path="/users" element={<GenericPageContent title="Users" />} />
          <Route path="/chat" element={<GenericPageContent title="Chat" />} />
          <Route path="/" element={<Navigate to="/projects" replace />} />
          <Route path="*" element={<Navigate to="/projects" replace />} />
        </Routes>
      </DashboardLayout>

      <AIAssistantModal 
        isOpen={showAIModal} 
        onClose={() => setShowAIModal(false)} 
        taskName={
          // Get current item name from URL
          window.location.pathname.includes('/tasks/') 
            ? mockFeatures.find(f => f.id === parseInt(window.location.pathname.split('/').pop()))?.name
            : projects.find(p => p.id === parseInt(window.location.pathname.split('/').pop()))?.name
        } 
      />
      <StatusUpdateModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        taskName={
          // Get current item name from URL
          window.location.pathname.includes('/tasks/') 
            ? mockFeatures.find(f => f.id === parseInt(window.location.pathname.split('/').pop()))?.name
            : projects.find(p => p.id === parseInt(window.location.pathname.split('/').pop()))?.name
        }
      />
      <CreateProjectModal
        isOpen={showCreateProjectModal}
        onClose={() => setShowCreateProjectModal(false)}
        onProjectCreated={handleProjectCreated}
      />
    </Router>
  )
}
  
export default App