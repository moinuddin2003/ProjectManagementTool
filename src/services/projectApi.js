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
      const response = await fetch(`${BASE_URL}/projects?per_page=${perPage}&page=${page}`, {
        method: "GET",
        headers: createHeaders(),
      })

      const result = await handleResponse(response)

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

// Task management APIs
export const taskApi = {
  // Get all tasks for a project
  async getProjectTasks(projectId) {
    try {
      const response = await fetch(`${BASE_URL}/projects/${projectId}/tasks`, {
        method: "GET",
        headers: createHeaders(),
      })

      const result = await handleResponse(response)
      return result.data || []
    } catch (error) {
      console.error("Error fetching project tasks:", error)
      throw error
    }
  },

  // Create new task
  async createTask(projectId, taskData) {
    try {
      const response = await fetch(`${BASE_URL}/projects/${projectId}/tasks`, {
        method: "POST",
        headers: createHeaders(),
        body: JSON.stringify(taskData),
      })

      const result = await handleResponse(response)
      return result.data
    } catch (error) {
      console.error("Error creating task:", error)
      throw error
    }
  },

  // Update task
  async updateTask(projectId, taskId, updateData) {
    try {
      const response = await fetch(`${BASE_URL}/projects/${projectId}/tasks/${taskId}`, {
        method: "PUT",
        headers: createHeaders(),
        body: JSON.stringify(updateData),
      })

      const result = await handleResponse(response)
      return result.data
    } catch (error) {
      console.error("Error updating task:", error)
      throw error
    }
  },

  // Delete task
  async deleteTask(projectId, taskId) {
    try {
      const response = await fetch(`${BASE_URL}/projects/${projectId}/tasks/${taskId}`, {
        method: "DELETE",
        headers: createHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return true
    } catch (error) {
      console.error("Error deleting task:", error)
      throw error
    }
  },
}

// File management APIs
export const fileApi = {
  // Get all files for a project
  // async getProjectFiles(projectId) {
  //   try {
  //     const response = await fetch(`${BASE_URL}/projects/${projectId}/files`, {
  //       method: "GET",
  //       headers: createHeaders(),
  //     })

  //     const result = await handleResponse(response)
  //     return result.data || []
  //   } catch (error) {
  //     console.error("Error fetching project files:", error)
  //     throw error
  //   }
  // },

  // Upload file to project
  async uploadFile(projectId, file) {
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(`${BASE_URL}/projects/${projectId}/files`, {
        method: "POST",
        headers: createFileHeaders(),
        body: formData,
      })

      const result = await handleResponse(response)
      return result.data
    } catch (error) {
      console.error("Error uploading file:", error)
      throw error
    }
  },

  // Delete file
  async deleteFile(projectId, fileId) {
    try {
      const response = await fetch(`${BASE_URL}/projects/${projectId}/files/${fileId}`, {
        method: "DELETE",
        headers: createHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return true
    } catch (error) {
      console.error("Error deleting file:", error)
      throw error
    }
  },
}

// Slack integration APIs
export const slackApi = {
  // Send message to Slack
  async sendMessage(channel, message) {
    try {
      // The backend expects { channel: <projectName>, message: <text> }
      const response = await fetch(`${BASE_URL}/slack/send`, {  
        method: "POST",
        headers: createHeaders(),
        body: JSON.stringify({
          channel: channel, // project name as channel
          message: message, // message text
        }),
      })

      const result = await handleResponse(response)
      // Response: { ok: true, channel_id, ts, message }
      return result
    } catch (error) {
      console.error("Error sending Slack message:", error)
      throw error
    }
  },

  // Get Slack history
  async getHistory(channelId, limit = 20) {
    try {
      const response = await fetch(`${BASE_URL}/slack/history?channel_id=${channelId}&limit=${limit}`, {
        method: "GET",
        headers: createHeaders(),
      })

      const result = await handleResponse(response)
      // Response: { ok: true, messages: [...] }
      return result.messages || []
    } catch (error) {
      console.error("Error fetching Slack history:", error)
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
