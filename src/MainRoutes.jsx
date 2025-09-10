import { useState, useEffect } from "react"
import { Routes, Route, Navigate, useNavigate } from "react-router-dom"
import DashboardLayout from "./components/layout/DashboardLayout/DashboardLayout"
import LoginPage from "./components/auth/LoginPage"
import RegisterPage from "./components/auth/RegisterPage"
import ProjectsView from "./components/projects/ProjectsView"
import ProjectDetails from "./components/projects/ProjectDetails"
import TaskManagement from "./components/tasks/TaskManagement"
import FileManagement from "./components/files/FileManagement"
import SlackIntegration from "./components/slack/SlackIntegration"
import { ProjectModal } from "./components/features/ProjectModal"
import MemberManagementModal from "./components/projects/MemberManagementModal"

// New component for managing all application routes
const MainRoutes = ({
  isLoggedIn, loginForm, setLoginForm, registerForm, setRegisterForm, isLoading, handleLogin, handleRegister,
  showMobileMenu, setShowMobileMenu, showCreateProjectModal, setShowCreateProjectModal, showMemberModal, setShowMemberModal,
  showTaskModal, setShowTaskModal, showFileModal, setShowFileModal, showSlackModal, setShowSlackModal,
  selectedProject, setSelectedProject, projects, setProjects, projectsLoading, setProjectsLoading, projectsError, setProjectsError,
  showEditProjectModal, setShowEditProjectModal, editingProject, setEditingProject, navItems,
  fetchProjects, handleCreateProject, handleProjectCreated, handleEditProject, handleProjectUpdated, handleUpdateProject,
  handleDeleteProject, handleManageMembers, handleManageTasks, handleManageFiles, handleOpenSlack, handleMembersUpdated
}) => {

  const navigate = useNavigate()

  const handleCloseTaskManagementStandalone = () => {
    navigate('/projects')
  }

  const ProjectsListRoute = () => {
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
        <ProjectsView
          projects={projects}
          onCreateProject={handleCreateProject}
          onProjectClick={handleProjectClick}
          onUpdateProject={handleUpdateProject}
          onDeleteProject={handleDeleteProject}
          onManageMembers={handleManageMembers}
          onManageTasks={handleManageTasks}
          onManageFiles={handleManageFiles}
          onOpenSlack={handleOpenSlack}
          onEditProject={handleEditProject}
        />
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

  return (
    isLoggedIn ? (
      <DashboardLayout showMobileMenu={showMobileMenu} setShowMobileMenu={setShowMobileMenu} navItems={navItems}>
        <Routes>
          <Route path="/login" element={<Navigate to="/projects" replace />} />
          <Route path="/register" element={<Navigate to="/projects" replace />} />

          {/* Projects Routes */}
          <Route path="/projects" element={<ProjectsListRoute />} />
          <Route path="/projects/:id" element={<ProjectDetails projects={projects} />} />

          <Route
            path="/tasks"
            element={<TaskManagement project={null} onClose={handleCloseTaskManagementStandalone} onTasksUpdated={fetchProjects} />}
          />
          <Route path="/ai-summaries" element={<GenericPageContent title="AI Summaries" />} />
          <Route path="/users" element={<GenericPageContent title="Users" />} />
          <Route path="/chat" element={<GenericPageContent title="Chat" />} />
          <Route path="/" element={<Navigate to="/projects" replace />} />
          <Route path="*" element={<Navigate to="/projects" replace />} />
        </Routes>
      </DashboardLayout>
    ) : (
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
    )
  )
}

export default MainRoutes
