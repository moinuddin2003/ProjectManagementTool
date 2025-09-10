const BASE_URL = "https://pm.makeamoveltd.com/public/api"

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("authToken")
}

// Create headers with auth token
const createHeaders = () => {
  const token = getAuthToken()
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  }
}

// Create headers for file upload
const createFileHeaders = () => {
  const token = getAuthToken()
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  }
}

// Handle API response
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
  }
  return response.json()
}

// Transform API project data to frontend format
const transformProjectData = (apiProject) => {
  return {
    id: apiProject.id,
    name: apiProject.name,
    description: apiProject.description,
    projectType: apiProject.project_type,
    devInstruction: apiProject.dev_instruction,
    status: apiProject.status,
    priorityLevel: apiProject.priority_level,
    owner: apiProject.creator?.name || "Unknown",
    health: getHealthFromStatus(apiProject.status),
    healthColor: getHealthColorFromStatus(apiProject.status),
    startDate: formatDate(apiProject.timeline?.start),
    endDate: formatDate(apiProject.timeline?.end),
    creator: apiProject.creator,
    members: apiProject.members || [],
    tasks: apiProject.tasks || [],
    files: apiProject.files || [],
    createdAt: apiProject.created_at,
    updatedAt: apiProject.updated_at,
  }
}

// Transform frontend form data to API format
const transformFormDataToApi = (formData) => {
  return {
    name: formData.projectName,
    description: formData.description || "",
    project_type: formData.projectType,
    dev_instruction: formData.devInstruction || "",
    status: "open",
    priority_level: formData.priorityLevel || "medium",
    timeline_start: formData.startDate,
    timeline_end: formData.endDate,
    member_ids: formData.memberIds || [],
  }
}

// Helper functions
const getHealthFromStatus = (status) => {
  const statusMap = {
    open: "Good",
    in_progress: "Good",
    on_hold: "At Risk",
    completed: "Good",
    cancelled: "At Risk",
  }
  return statusMap[status] || "Good"
}

const getHealthColorFromStatus = (status) => {
  const colorMap = {
    open: "green",
    in_progress: "green",
    on_hold: "yellow",
    completed: "blue",
    cancelled: "red",
  }
  return colorMap[status] || "green"
}

const formatDate = (dateString) => {
  if (!dateString) return ""
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

// API Functions
export const projectApi = {
  // Get all projects with pagination
  async getProjects(perPage = 15, page = 1) {
    try {
      const response = await fetch(`${BASE_URL}/projects?per_page=${perPage}`, {
        method: "GET",
        headers: createHeaders(),
      })

      const result = await handleResponse(response)
      console.log(response, result)
      // Handle both single project and array responses
      if (result.data) {
        if (Array.isArray(result.data)) {
          return {
            projects: result.data.map(transformProjectData),
            pagination: result.meta || null,
          }
        } else {
          return {
            projects: [transformProjectData(result.data)],
            pagination: null,
          }
        }
      }

      return { projects: [], pagination: null }
    } catch (error) {
      console.error("Error fetching projects:", error)
      throw error
    }
  },

  // Get single project
  async getProject(projectId) {
    try {
      const response = await fetch(`${BASE_URL}/projects/${projectId}`, {
        method: "GET",
        headers: createHeaders(),
      })

      const result = await handleResponse(response)
      return transformProjectData(result.data)
    } catch (error) {
      console.error("Error fetching project:", error)
      throw error
    }
  },

  // Create new project
  async createProject(formData) {
    try {
      const apiData = transformFormDataToApi(formData)

      const response = await fetch(`${BASE_URL}/projects`, {
        method: "POST",
        headers: createHeaders(),
        body: JSON.stringify(apiData),
      })

      const result = await handleResponse(response)
      return transformProjectData(result.data)
    } catch (error) {
      console.error("Error creating project:", error)
      throw error
    }
  },

  // Update project
  async updateProject(projectId, updateData) {
    try {
      const response = await fetch(`${BASE_URL}/projects/${projectId}`, {
        method: "PUT",
        headers: createHeaders(),
        body: JSON.stringify(updateData),
      })

      const result = await handleResponse(response)
      return transformProjectData(result.data)
    } catch (error) {
      console.error("Error updating project:", error)
      throw error
    }
  },

  // Delete project
  async deleteProject(projectId) {
    try {
      const response = await fetch(`${BASE_URL}/projects/${projectId}`, {
        method: "DELETE",
        headers: createHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return true
    } catch (error) {
      console.error("Error deleting project:", error)
      throw error
    }
  },

  // Add member to project
  async addMember(projectId, userId, role = "member") {
    try {
      const response = await fetch(`${BASE_URL}/projects/${projectId}/members`, {
        method: "POST",
        headers: createHeaders(),
        body: JSON.stringify({
          user_id: userId,
          role: role,
        }),
      })

      const result = await handleResponse(response)
      return transformProjectData(result.data)
    } catch (error) {
      console.error("Error adding member:", error)
      throw error
    }
  },

  // Remove member from project
  async removeMember(projectId, userId) {
    try {
      const response = await fetch(`${BASE_URL}/projects/${projectId}/members`, {
        method: "DELETE",
        headers: createHeaders(),
        body: JSON.stringify({
          user_id: userId,
        }),
      })

      const result = await handleResponse(response)
      return transformProjectData(result.data)
    } catch (error) {
      console.error("Error removing member:", error)
      throw error
    }
  },
}

// Temporary mock users until user fetch API is implemented
export const mockUsers = [
  { id: 2, name: "Moin", email: "checking@gmail.com" },
  { id: 3, name: "Faheem Mailinator", email: "checking@mailinator.com" },
  { id: 4, name: "Nihil consequatur F Voluptate est volup", email: "kite@mailinator.com" },
]
