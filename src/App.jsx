import { useState, useEffect } from "react"
import { BrowserRouter as Router } from "react-router-dom"
import { useAuth } from "./hooks/useAuth"
import { projectApi } from "./services/projectApi"
import { FolderOpen, CheckSquare, Users, MessageCircle, FileText } from "lucide-react"
import MainRoutes from "./MainRoutes"

import { ProjectModal } from "./components/features/ProjectModal"
import MemberManagementModal from "./components/projects/MemberManagementModal"
import TaskManagement from "./components/tasks/TaskManagement"
import FileManagement from "./components/files/FileManagement"
import SlackIntegration from "./components/slack/SlackIntegration"

// ✅ React Toastify
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

function App() {
  const { isLoggedIn, loginForm, setLoginForm, registerForm, setRegisterForm, isLoading, handleLogin, handleRegister } =
    useAuth()

  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false)
  const [showMemberModal, setShowMemberModal] = useState(false)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showFileModal, setShowFileModal] = useState(false)
  const [showSlackModal, setShowSlackModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [projects, setProjects] = useState([])
  const [projectsLoading, setProjectsLoading] = useState(false)
  const [projectsError, setProjectsError] = useState(null)
  const [showEditProjectModal, setShowEditProjectModal] = useState(false)
  const [editingProject, setEditingProject] = useState(null)

  const navItems = [
    { name: "Projects", icon: FolderOpen, path: "/projects" },
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

      if (selectedProject) {
        const updatedSelectedProject = result.projects.find(p => p.id === selectedProject.id)
        if (updatedSelectedProject) {
          setSelectedProject(updatedSelectedProject)
        }
      }
    } catch (error) {
      console.error("App: Error fetching projects:", error)
      setProjectsError(error.message)
      toast.error("❌ Failed to load projects")
    } finally {
      setProjectsLoading(false)
    }
  }

  const handleCreateProject = () => {
    setShowCreateProjectModal(true)
  }

  const handleProjectCreated = async (newProject) => {
    setProjects(prevProjects => [newProject, ...prevProjects])
    setShowCreateProjectModal(false)
    toast.success("Project created successfully")
  }

  const handleEditProject = (project) => {
    setEditingProject(project)
    setShowEditProjectModal(true)
  }

  const handleProjectUpdated = async (updatedProject) => {
    setProjects(prevProjects => prevProjects.map(p => (p.id === updatedProject.id ? updatedProject : p)))
    setShowEditProjectModal(false)
    setEditingProject(null)
    toast.info("✏️ Project updated")
  }

  const handleUpdateProject = async (projectId, updateData) => {
    try {
      const updatedProject = await projectApi.updateProject(projectId, updateData)
      setProjects(prevProjects => prevProjects.map(p => (p.id === projectId ? updatedProject : p)))
      toast.success("🔄 Project saved")
      return updatedProject
    } catch (error) {
      console.error("Error updating project:", error)
      toast.error("❌ Failed to update project")
      throw error
    }
  }

  const handleDeleteProject = async (projectId) => {
    try {
      await projectApi.deleteProject(projectId)
      setProjects(prevProjects => prevProjects.filter(p => p.id !== projectId))
      toast.success("🗑️ Project deleted")
    } catch (error) {
      console.error("Error deleting project:", error)
      toast.error("❌ Failed to delete project")
    }
  }

  const handleManageMembers = (project) => {
    setSelectedProject(project)
    setShowMemberModal(true)
  }

  const handleManageTasks = (project) => {
    setSelectedProject(project)
    setShowTaskModal(true)
  }

  const handleManageFiles = (project) => {
    setSelectedProject(project)
    setShowFileModal(true)
  }

  const handleOpenSlack = () => {
    setShowSlackModal(true)
  }

  const handleMembersUpdated = (updatedProject) => {
    setProjects(prevProjects => prevProjects.map(p => (p.id === updatedProject.id ? updatedProject : p)))
    toast.info("👥 Members updated")
  }

  return (
    <Router>
      <MainRoutes
        isLoggedIn={isLoggedIn}
        loginForm={loginForm}
        setLoginForm={setLoginForm}
        registerForm={registerForm}
        setRegisterForm={setRegisterForm}
        isLoading={isLoading}
        handleLogin={handleLogin}
        handleRegister={handleRegister}
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
        showCreateProjectModal={showCreateProjectModal}
        setShowCreateProjectModal={setShowCreateProjectModal}
        showMemberModal={showMemberModal}
        setShowMemberModal={setShowMemberModal}
        showTaskModal={showTaskModal}
        setShowTaskModal={setShowTaskModal}
        showFileModal={showFileModal}
        setShowFileModal={setShowFileModal}
        showSlackModal={showSlackModal}
        setShowSlackModal={setShowSlackModal}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        projects={projects}
        setProjects={setProjects}
        projectsLoading={projectsLoading}
        setProjectsLoading={setProjectsLoading}
        projectsError={projectsError}
        setProjectsError={setProjectsError}
        showEditProjectModal={showEditProjectModal}
        setShowEditProjectModal={setShowEditProjectModal}
        editingProject={editingProject}
        setEditingProject={setEditingProject}
        navItems={navItems}
        fetchProjects={fetchProjects}
        handleCreateProject={handleCreateProject}
        handleProjectCreated={handleProjectCreated}
        handleEditProject={handleEditProject}
        handleProjectUpdated={handleProjectUpdated}
        handleUpdateProject={handleUpdateProject}
        handleDeleteProject={handleDeleteProject}
        handleManageMembers={handleManageMembers}
        handleManageTasks={handleManageTasks}
        handleManageFiles={handleManageFiles}
        handleOpenSlack={handleOpenSlack}
        handleMembersUpdated={handleMembersUpdated}
      />

      <ProjectModal
        isOpen={showEditProjectModal}
        onClose={() => setShowEditProjectModal(false)}
        project={editingProject}
        onProjectEdited={handleProjectUpdated}
      />

      <ProjectModal
        isOpen={showCreateProjectModal}
        onClose={() => setShowCreateProjectModal(false)}
        onProjectCreated={handleProjectCreated}
      />

      <MemberManagementModal
        isOpen={showMemberModal}
        onClose={() => setShowMemberModal(false)}
        project={selectedProject}
        onMembersUpdated={handleMembersUpdated}
      />

      {showTaskModal && selectedProject && (
        <TaskManagement
          key={selectedProject.id}
          project={selectedProject}
          onClose={() => setShowTaskModal(false)}
          onTasksUpdated={fetchProjects}
        />
      )}

      {showFileModal && selectedProject && (
        <FileManagement projectId={selectedProject.id} onClose={() => setShowFileModal(false)} />
      )}

      {showSlackModal && <SlackIntegration onClose={() => setShowSlackModal(false)} />}

      {/* ✅ Toastify container */}
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </Router>
  )
}

export default App
