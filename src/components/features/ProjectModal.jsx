import { useState, useEffect, useRef } from "react"
import { X, Calendar, Users } from "lucide-react"
import { projectApi, fileApi, mockUsers } from "../../services/projectApi"

export const ProjectModal = ({ isOpen, onClose, project, onProjectCreated, onProjectEdited }) => {
  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    projectType: "",
    priorityLevel: "Medium",
    devInstruction: "",
    client: "",
    startDate: "",
    endDate: "",
    estimatedDuration: "",
    memberIds: [],
  })

  const [attachments, setAttachments] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedMembers, setSelectedMembers] = useState([])
  const [uploadingFiles, setUploadingFiles] = useState(false)
  const [fileUploadError, setFileUploadError] = useState("")

  const projectTypes = ["epic", "bug", "task", "story"]

  const priorityLevels = ["low", "medium", "high"]

  const fileInputRef = useRef(null)

  useEffect(() => {
    if (isOpen && project) {
      // Populate form data if in edit mode
      setFormData({
        projectName: project.name || "",
        description: project.description || "",
        projectType: project.projectType || "",
        priorityLevel: project.priorityLevel || "medium",
        devInstruction: project.devInstruction || "",
        client: project.client || "",
        startDate: project.startDate || "",
        endDate: project.endDate || "",
        estimatedDuration: project.estimatedDuration || calculateDuration(project.startDate, project.endDate),
        memberIds: project.members?.map((m) => m.id) || [],
      })
      setSelectedMembers(project.members?.map((m) => m.id) || [])
    } else if (isOpen && !project) {
      // Reset form if in create mode
      setFormData({
        projectName: "",
        description: "",
        projectType: "",
        priorityLevel: "medium",
        devInstruction: "",
        client: "",
        startDate: "",
        endDate: "",
        estimatedDuration: "",
        memberIds: [],
      })
      setAttachments([])
      setSelectedMembers([])
    }
    setErrors({})
  }, [isOpen, project])

  const calculateDuration = (start, end) => {
    if (!start || !end) return ""
    const startDate = new Date(start)
    const endDate = new Date(end)
    const diffTime = Math.abs(endDate - startDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 7) return `${diffDays} days`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks`
    return `${Math.ceil(diffDays / 30)} months`
  }

  const handleInputChange = (field, value) => {
    const newFormData = { ...formData, [field]: value }

    // Auto-calculate duration when dates change
    if (field === "startDate" || field === "endDate") {
      newFormData.estimatedDuration = calculateDuration(
        field === "startDate" ? value : formData.startDate,
        field === "endDate" ? value : formData.endDate,
      )
    }

    setFormData(newFormData)

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" })
    }
  }

  const handleFiles = (files) => {
    const validFiles = Array.from(files).filter((file) => {
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/png",
        "image/gif",
        "text/plain",
      ]
      const maxSize = 10 * 1024 * 1024 // 10MB

      if (!validTypes.includes(file.type)) {
        alert(`${file.name} is not a supported file type`)
        return false
      }

      if (file.size > maxSize) {
        alert(`${file.name} is too large. Maximum size is 10MB`)
        return false
      }

      return true
    })

    const newAttachments = validFiles.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
    }))

    setAttachments((prev) => [...prev, ...newAttachments])
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const removeAttachment = (id) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id))
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleMemberToggle = (userId) => {
    const isSelected = selectedMembers.includes(userId)
    let newSelectedMembers

    if (isSelected) {
      newSelectedMembers = selectedMembers.filter((id) => id !== userId)
    } else {
      newSelectedMembers = [...selectedMembers, userId]
    }

    setSelectedMembers(newSelectedMembers)
    setFormData({ ...formData, memberIds: newSelectedMembers })
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.projectName.trim()) {
      newErrors.projectName = "Project name is required"
    }

    if (!formData.projectType) {
      newErrors.projectType = "Project type is required"
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required"
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required"
    }

    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = "End date must be after start date"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsSubmitting(true)
    try {
      let projId = project ? project.id : null
      let resultProject = null
      if (project) {
        resultProject = await projectApi.updateProject(project.id, {
          name: formData.projectName,
          description: formData.description,
          project_type: formData.projectType,
          priority_level: formData.priorityLevel,
          dev_instruction: formData.devInstruction,
          timeline_start: formData.startDate,
          timeline_end: formData.endDate,
          member_ids: formData.memberIds,
        })
        projId = resultProject.id
        if (onProjectEdited) {
          onProjectEdited(resultProject)
        }
      } else {
        resultProject = await projectApi.createProject(formData)
        projId = resultProject.id
        if (onProjectCreated) {
          onProjectCreated(resultProject)
        }
      }
      // Debug: log attachments before upload
      console.log('Attachments to upload:', attachments)
      if (attachments.length > 0) {
        setUploadingFiles(true)
        await Promise.all(attachments.map(a => {
          console.log('Uploading file:', a.file, 'to project:', projId)
          return fileApi.uploadFile(projId, a.file)
        }))
        setUploadingFiles(false)
      }
      onClose()
    } catch (error) {
      console.error(project ? "Error updating project:" : "Error creating project:", error)
      setErrors({ submit: error.message || `Failed to ${project ? "update" : "create"} project. Please try again.` })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    onClose()
    setErrors({})
    setAttachments([])
    setSelectedMembers([])
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl my-8 mx-auto">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{project ? "Edit Project" : "Create New Project"}</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
          {/* Error Message */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          {/* Basic Project Details */}
          <div className="space-y-4">
            <h3 className="text-base font-medium text-gray-900">Basic Project Details</h3>

            {/* Project Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.projectName}
                onChange={(e) => handleInputChange("projectName", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.projectName ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Short, descriptive name"
              />
              {errors.projectName && <p className="mt-1 text-sm text-red-600">{errors.projectName}</p>}
            </div>

            {/* Project Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Description <span className="text-gray-400">(optional)</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Brief summary of project goals or scope"
              />
            </div>

            {/* Project Type and Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.projectType}
                  onChange={(e) => handleInputChange("projectType", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.projectType ? "border-red-300" : "border-gray-300"
                  }`}
                >
                  <option value="">Select project type</option>
                  {projectTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
                {errors.projectType && <p className="mt-1 text-sm text-red-600">{errors.projectType}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority Level</label>
                <select
                  value={formData.priorityLevel}
                  onChange={(e) => handleInputChange("priorityLevel", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {priorityLevels.map((level) => (
                    <option key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dev Instructions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Development Instructions <span className="text-gray-400">(optional)</span>
              </label>
              <textarea
                value={formData.devInstruction}
                onChange={(e) => handleInputChange("devInstruction", e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Special instructions for development team"
              />
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <h3 className="text-base font-medium text-gray-900">Timeline</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange("startDate", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.startDate ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                  <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date / Deadline <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange("endDate", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.endDate ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                  <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
              </div>
            </div>

            {/* Estimated Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Duration</label>
              <input
                type="text"
                value={formData.estimatedDuration}
                onChange={(e) => handleInputChange("estimatedDuration", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Auto-calculated from dates or enter manually"
              />
              <p className="mt-1 text-xs text-gray-500">
                Duration is automatically calculated when you select start and end dates
              </p>
            </div>
          </div>

          {/* Team Members */}
          <div className="space-y-4">
            <h3 className="text-base font-medium text-gray-900 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Team Members <span className="text-gray-400">(optional)</span>
            </h3>

            <div className="space-y-2">
              {mockUsers.map((user) => (
                <label
                  key={user.id}
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(user.id)}
                    onChange={() => handleMemberToggle(user.id)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </label>
              ))}
            </div>

            {selectedMembers.length > 0 && (
              <p className="text-sm text-gray-600">
                {selectedMembers.length} member{selectedMembers.length > 1 ? "s" : ""} selected
              </p>
            )}
          </div>

          {/* File Upload Area (always visible) */}
          <div className="w-full mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Files (optional)</label>
            <div
              className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors mb-2 ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}`}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{ cursor: "pointer" }}
            >
              <p className="text-gray-700">Drop files here or click to select</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileInput}
                className="hidden"
              />
              {uploadingFiles && <p className="text-blue-600 mt-2">Uploading...</p>}
              {fileUploadError && <p className="text-red-600 mt-2">{fileUploadError}</p>}
            </div>
            {/* Show selected attachments */}
            {attachments.length > 0 && (
              <div className="mt-2 space-y-2">
                {attachments.map((att) => (
                  <div key={att.id} className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
                    <span className="text-sm text-gray-800">{att.name} ({formatFileSize(att.size)})</span>
                    <button type="button" onClick={() => removeAttachment(att.id)} className="text-red-500 text-xs">Remove</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center justify-center"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  {project ? "Updating..." : "Creating..."}
                </span>
              ) : (
                project ? "Update Project" : "Create Project"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
