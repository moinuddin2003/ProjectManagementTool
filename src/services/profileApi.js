// const BASE_URL = "https://pm.makeamoveltd.com/public/api"

// // Helper function to get auth headers
// const getAuthHeaders = () => {
//   const token = localStorage.getItem("authToken")
//   return {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//     Authorization: token ? `Bearer ${token}` : "",
//   }
// }

// // Helper function to handle API responses
// const handleResponse = async (response) => {
//   if (!response.ok) {
//     const errorData = await response.json().catch(() => ({}))
//     throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
//   }
//   return response.json()
// }

// // Projects API
// export const projectsAPI = {
//   // Get all projects with pagination
//   getProjects: async (perPage = 15, page = 1) => {
//     const response = await fetch(`${BASE_URL}/projects?per_page=${perPage}&page=${page}`, {
//       method: "GET",
//       headers: getAuthHeaders(),
//     })
//     return handleResponse(response)
//   },

//   // Get single project by ID
//   getProject: async (projectId) => {
//     const response = await fetch(`${BASE_URL}/projects/${projectId}`, {
//       method: "GET",
//       headers: getAuthHeaders(),
//     })
//     return handleResponse(response)
//   },

//   // Create new project
//   createProject: async (projectData) => {
//     const response = await fetch(`${BASE_URL}/projects`, {
//       method: "POST",
//       headers: getAuthHeaders(),
//       body: JSON.stringify(projectData),
//     })
//     return handleResponse(response)
//   },

//   // Update project
//   updateProject: async (projectId, projectData) => {
//     const response = await fetch(`${BASE_URL}/projects/${projectId}`, {
//       method: "PUT",
//       headers: getAuthHeaders(),
//       body: JSON.stringify(projectData),
//     })
//     return handleResponse(response)
//   },

//   // Delete project
//   deleteProject: async (projectId) => {
//     const response = await fetch(`${BASE_URL}/projects/${projectId}`, {
//       method: "DELETE",
//       headers: getAuthHeaders(),
//     })
//     return handleResponse(response)
//   },

//   // Add member to project
//   addMember: async (projectId, memberData) => {
//     const response = await fetch(`${BASE_URL}/projects/${projectId}/members`, {
//       method: "POST",
//       headers: getAuthHeaders(),
//       body: JSON.stringify(memberData),
//     })
//     return handleResponse(response)
//   },

//   // Remove member from project
//   removeMember: async (projectId, memberId) => {
//     const response = await fetch(`${BASE_URL}/projects/${projectId}/members/${memberId}`, {
//       method: "DELETE",
//       headers: getAuthHeaders(),
//     })
//     return handleResponse(response)
//   },
// }

// // Tasks API
// export const tasksAPI = {
//   // Get tasks for a project
//   getProjectTasks: async (projectId) => {
//     const response = await fetch(`${BASE_URL}/projects/${projectId}/tasks`, {
//       method: "GET",
//       headers: getAuthHeaders(),
//     })
//     return handleResponse(response)
//   },

//   // Create task
//   createTask: async (projectId, taskData) => {
//     const response = await fetch(`${BASE_URL}/projects/${projectId}/tasks`, {
//       method: "POST",
//       headers: getAuthHeaders(),
//       body: JSON.stringify(taskData),
//     })
//     return handleResponse(response)
//   },

//   // Update task
//   updateTask: async (projectId, taskId, taskData) => {
//     const response = await fetch(`${BASE_URL}/projects/${projectId}/tasks/${taskId}`, {
//       method: "PUT",
//       headers: getAuthHeaders(),
//       body: JSON.stringify(taskData),
//     })
//     return handleResponse(response)
//   },

//   // Delete task
//   deleteTask: async (projectId, taskId) => {
//     const response = await fetch(`${BASE_URL}/projects/${projectId}/tasks/${taskId}`, {
//       method: "DELETE",
//       headers: getAuthHeaders(),
//     })
//     return handleResponse(response)
//   },
// }

// // Files API
// export const filesAPI = {
//   // Upload file to project
//   uploadFile: async (projectId, file) => {
//     const formData = new FormData()
//     formData.append("file", file)

//     const token = localStorage.getItem("authToken")
//     const response = await fetch(`${BASE_URL}/projects/${projectId}/files`, {
//       method: "POST",
//       headers: {
//         Authorization: token ? `Bearer ${token}` : "",
//         // Don't set Content-Type for FormData, let browser set it
//       },
//       body: formData,
//     })
//     return handleResponse(response)
//   },

//   // Delete file
//   deleteFile: async (projectId, fileId) => {
//     const response = await fetch(`${BASE_URL}/projects/${projectId}/files/${fileId}`, {
//       method: "DELETE",
//       headers: getAuthHeaders(),
//     })
//     return handleResponse(response)
//   },
// }

// // Data transformation helpers
// export const transformers = {
//   // Transform API project data to match frontend structure
//   transformProject: (apiProject) => {
//     const getHealthFromStatus = (status) => {
//       switch (status?.toLowerCase()) {
//         case "open":
//         case "in_progress":
//           return "Good"
//         case "on_hold":
//           return "On Hold"
//         case "completed":
//           return "Completed"
//         default:
//           return "At Risk"
//       }
//     }

//     const getHealthColor = (health) => {
//       switch (health) {
//         case "Good":
//           return "green"
//         case "At Risk":
//           return "red"
//         case "On Hold":
//           return "yellow"
//         case "Completed":
//           return "blue"
//         default:
//           return "green"
//       }
//     }

//     const health = getHealthFromStatus(apiProject.status)

//     return {
//       id: apiProject.id,
//       name: apiProject.name,
//       owner: apiProject.creator?.name || "Unknown",
//       health: health,
//       healthColor: getHealthColor(health),
//       startDate: apiProject.timeline?.start ? new Date(apiProject.timeline.start).toLocaleDateString() : "N/A",
//       endDate: apiProject.timeline?.end ? new Date(apiProject.timeline.end).toLocaleDateString() : "N/A",
//       description: apiProject.description || "",
//       type: apiProject.project_type || "Unknown",
//       status: apiProject.status,
//       priority_level: apiProject.priority_level,
//       dev_instruction: apiProject.dev_instruction,
//       members: apiProject.members || [],
//       tasks: apiProject.tasks || [],
//       files: apiProject.files || [],
//       created_at: apiProject.created_at,
//       updated_at: apiProject.updated_at,
//     }
//   },

//   // Transform API task data to match frontend feature structure
//   transformTask: (apiTask, projectMembers = []) => {
//     // Find assignee from project members
//     const assignee = projectMembers.find((member) => member.id === apiTask.assignee_id) || {
//       name: "Unassigned",
//       avatar: "/placeholder.svg?height=32&width=32",
//     }

//     // Calculate progress percentages (mock values for now, can be enhanced)
//     const progress = {
//       dueDate: apiTask.due_date ? Math.floor(Math.random() * 100) : 0,
//       status: apiTask.status === "completed" ? 100 : apiTask.status === "in_progress" ? 60 : 20,
//       priority: apiTask.priority_level === "high" ? 90 : apiTask.priority_level === "medium" ? 60 : 30,
//       dependencies: Math.floor(Math.random() * 100),
//     }

//     return {
//       id: apiTask.id,
//       name: apiTask.title,
//       assignee: {
//         name: assignee.name,
//         avatar: assignee.avatar || "/placeholder.svg?height=32&width=32",
//       },
//       progress: progress,
//       lastActivity: `Updated ${new Date(apiTask.updated_at).toLocaleDateString()}`,
//       highlighted: apiTask.priority_level === "high",
//       description: apiTask.description,
//       status: apiTask.status,
//       priority_level: apiTask.priority_level,
//       due_date: apiTask.due_date,
//       parent_id: apiTask.parent_id,
//       sort_order: apiTask.sort_order,
//     }
//   },

//   // Transform frontend project data to API format
//   transformProjectForAPI: (frontendProject) => {
//     return {
//       name: frontendProject.projectName || frontendProject.name,
//       description: frontendProject.description,
//       project_type: frontendProject.projectType || frontendProject.type || "epic",
//       dev_instruction: frontendProject.dev_instruction || "Follow project guidelines",
//       status: "open",
//       priority_level: frontendProject.priority_level || "medium",
//       timeline_start: frontendProject.startDate,
//       timeline_end: frontendProject.endDate,
//       member_ids: frontendProject.member_ids || [],
//     }
//   },

//   // Transform frontend task data to API format
//   transformTaskForAPI: (frontendTask) => {
//     return {
//       title: frontendTask.title || frontendTask.name,
//       description: frontendTask.description || "",
//       priority_level: frontendTask.priority_level || "medium",
//       due_date: frontendTask.due_date,
//       assignee_id: frontendTask.assignee_id,
//       parent_id: frontendTask.parent_id,
//       status: frontendTask.status || "open",
//       sort_order: frontendTask.sort_order || 1,
//     }
//   },
// }
// Profile API service functions
const BASE_URL = "https://pm.makeamoveltd.com/public/api"

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken")
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  }
}

// Get user profile
export const getUserProfile = async () => {
  try {
    const response = await fetch(`${BASE_URL}/me`, {
      method: "GET",
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to fetch profile")
    }

    const data = await response.json()
    return data.data || data
  } catch (error) {
    console.error("Get profile error:", error)
    throw error
  }
}

// Update user profile
export const updateUserProfile = async (profileData) => {
  try {
    const apiData = {
      name: profileData.name,
      slack_id: profileData.slack_id,
      phone_no: profileData.phone_no,
      designation: profileData.designation,
    }

    const response = await fetch(`${BASE_URL}/me`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(apiData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to update profile")
    }

    const data = await response.json()
    return data.data || data
  } catch (error) {
    console.error("Update profile error:", error)
    throw error
  }
}

// Change password
export const changePassword = async (passwordData) => {
    console.log("changePassword called with:", passwordData);

  try {
    const response = await fetch(`${BASE_URL}/me/password`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(passwordData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to change password")
    }

    const data = await response.json()
    return data.data || data
  } catch (error) {
    console.error("Change password error:", error)
    throw error
  }
}
