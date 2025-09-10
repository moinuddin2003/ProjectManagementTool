"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, useNavigate } from "react-router-dom"
import DashboardLayout from "./components/layout/DashboardLayout/DashboardLayout"
import LoginPage from "./components/auth/LoginPage"
import RegisterPage from "./components/auth/RegisterPage"
import ProjectsView from "./components/projects/ProjectsView"
import { CreateProjectModal } from "./components/features/CreateProjectModal"
import { useAuth } from "./hooks/useAuth"
import { projectApi } from "./services/projectApi"
import { FolderOpen, CheckSquare, Users, MessageCircle, FileText } from "lucide-react"

function App() {
  const { isLoggedIn, loginForm, setLoginForm, registerForm, setRegisterForm, isLoading, handleLogin, handleRegister } =
    useAuth()

  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false)
  const [projects, setProjects] = useState([])
  const [projectsLoading, setProjectsLoading] = useState(false)
  const [projectsError, setProjectsError] = useState(null)

  const navItems = [
    {
      name: "Projects",
      icon: FolderOpen,
      path: "/projects",
    },
    { name: "Tasks", icon: CheckSquare, path: "/tasks" },
    { name: "AI Summaries", icon: FileText, path: "/ai-summaries" },
    { name: "Users", icon: Users, path: "/users" },
    { name: "Chat", icon: MessageCircle, path: "/chat" },
  ]

  useEffect(() => {
    if (isLoggedIn) {
      fetchProjects()
    }
  }, [isLoggedIn])

  const fetchProjects = async () => {
    setProjectsLoading(true)
    setProjectsError(null)
    try {
      const result = await projectApi.getProjects(15, 1)
      setProjects(result.projects)
    } catch (error) {
      console.error("Error fetching projects:", error)
      setProjectsError(error.message)
    } finally {
      setProjectsLoading(false)
    }
  }

  const handleCreateProject = () => {
    setShowCreateProjectModal(true)
  }

  const handleProjectCreated = async (newProject) => {
    // Add the new project to the beginning of the list
    setProjects((prevProjects) => [newProject, ...prevProjects])
    setShowCreateProjectModal(false)
  }

  // Projects List Route Component
  const ProjectsListRoute = () => {
    const navigate = useNavigate()

    const handleProjectClick = (project) => {
      navigate(`/projects/${project.id}`)
    }

    if (projectsLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600">Loading projects...</span>
          </div>
        </div>
      )
    }

    if (projectsError) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-red-800 font-medium mb-2">Error Loading Projects</h3>
          <p className="text-red-600 mb-4">{projectsError}</p>
          <button onClick={fetchProjects} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Try Again
          </button>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <ProjectsView projects={projects} onCreateProject={handleCreateProject} onProjectClick={handleProjectClick} />
      </div>
    )
  }

  const ProjectDetailRoute = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const project = projects.find((p) => p.id === Number.parseInt(id))

    if (!project) {
      return <Navigate to="/projects" replace />
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate("/projects")} className="text-blue-600 hover:text-blue-800">
            ← Back to Projects
          </button>
        </div>
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Project Details</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{project.name}</h3>
                <p className="text-gray-600">{project.description}</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Status</span>
                  <p className="text-sm text-gray-900 capitalize">{project.status}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Priority</span>
                  <p className="text-sm text-gray-900 capitalize">{project.priorityLevel}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Owner</span>
                  <p className="text-sm text-gray-900">{project.owner}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Health</span>
                  <p
                    className={`text-sm font-medium ${project.healthColor === "green" ? "text-green-600" : project.healthColor === "yellow" ? "text-yellow-600" : "text-red-600"}`}
                  >
                    {project.health}
                  </p>
                </div>
              </div>
              {project.startDate && project.endDate && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Timeline</span>
                  <p className="text-sm text-gray-900">
                    {project.startDate} - {project.endDate}
                  </p>
                </div>
              )}
              {project.members && project.members.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Members</span>
                  <div className="mt-2 space-y-1">
                    {project.members.map((member) => (
                      <div key={member.id} className="text-sm text-gray-900">
                        {member.name} ({member.role})
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
            path="/login"
            element={
              <LoginPage
                loginForm={loginForm}
                setLoginForm={setLoginForm}
                onLogin={handleLogin}
                isLoading={isLoading}
              />
            }
          />
          <Route
            path="/register"
            element={
              <RegisterPage
                registerForm={registerForm}
                setRegisterForm={setRegisterForm}
                onRegister={handleRegister}
                isLoading={isLoading}
              />
            }
          />
          {/* Redirect all other routes to login when not authenticated */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    )
  }

  return (
    <Router>
      <DashboardLayout showMobileMenu={showMobileMenu} setShowMobileMenu={setShowMobileMenu} navItems={navItems}>
        <Routes>
          <Route path="/login" element={<Navigate to="/projects" replace />} />
          <Route path="/register" element={<Navigate to="/projects" replace />} />

          {/* Projects Routes */}
          <Route path="/projects" element={<ProjectsListRoute />} />
          <Route path="/projects/:id" element={<ProjectDetailRoute />} />

          <Route path="/tasks" element={<GenericPageContent title="Tasks" />} />
          <Route path="/ai-summaries" element={<GenericPageContent title="AI Summaries" />} />
          <Route path="/users" element={<GenericPageContent title="Users" />} />
          <Route path="/chat" element={<GenericPageContent title="Chat" />} />
          <Route path="/" element={<Navigate to="/projects" replace />} />
          <Route path="*" element={<Navigate to="/projects" replace />} />
        </Routes>
      </DashboardLayout>

      <CreateProjectModal
        isOpen={showCreateProjectModal}
        onClose={() => setShowCreateProjectModal(false)}
        onProjectCreated={handleProjectCreated}
      />
    </Router>
  )
}

export default App
