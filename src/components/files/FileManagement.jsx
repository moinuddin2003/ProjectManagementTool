"use client"

import { useState, useEffect, useRef } from "react"
import { Upload, Download, Trash2, File, ImageIcon, FileText } from "lucide-react"
import { projectApi } from "../../services/projectApi"

const FileManagement = ({ projectId, onClose }) => {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    fetchFiles()
  }, [projectId])

  const fetchFiles = async () => {
    try {
      setLoading(true)
      const response = await projectApi.getProjectFiles(projectId)
      setFiles(response.data || [])
    } catch (err) {
      setError("Failed to load files")
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (selectedFiles) => {
    if (!selectedFiles || selectedFiles.length === 0) return

    setUploading(true)
    setError("")

    try {
      for (const file of selectedFiles) {
        await projectApi.uploadFile(projectId, file)
      }
      await fetchFiles()
    } catch (err) {
      setError("Failed to upload files")
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteFile = async (fileId) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      try {
        await projectApi.deleteFile(projectId, fileId)
        await fetchFiles()
      } catch (err) {
        setError("Failed to delete file")
      }
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFileUpload(droppedFiles)
  }

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase()

    if (["jpg", "jpeg", "png", "gif", "svg"].includes(extension)) {
      return <ImageIcon className="w-8 h-8 text-blue-500" />
    } else if (["pdf", "doc", "docx", "txt"].includes(extension)) {
      return <FileText className="w-8 h-8 text-red-500" />
    } else {
      return <File className="w-8 h-8 text-gray-500" />
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading files...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">File Management</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        {error && <div className="mx-6 mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

        <div className="p-6">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 transition-colors ${
              dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">Drop files here or click to upload</p>
            <p className="text-gray-500 mb-4">Support for all file types up to 10MB</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Choose Files"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={(e) => handleFileUpload(Array.from(e.target.files))}
              className="hidden"
            />
          </div>

          {/* Files List */}
          <div className="overflow-y-auto max-h-96">
            {files.length === 0 ? (
              <div className="text-center py-12">
                <File className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <div className="text-gray-400 text-lg mb-2">No files uploaded</div>
                <p className="text-gray-500">Upload your first file to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      {getFileIcon(file.name)}
                      <div>
                        <h3 className="font-medium text-gray-900">{file.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{formatFileSize(file.size)}</span>
                          <span>Uploaded {new Date(file.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => window.open(file.url, "_blank")}
                        className="p-2 text-gray-400 hover:text-blue-600"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteFile(file.id)}
                        className="p-2 text-gray-400 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FileManagement
