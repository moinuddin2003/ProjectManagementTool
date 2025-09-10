import { useState, useEffect } from "react"
import { X, Plus, Trash2, User } from "lucide-react"
import { projectApi, mockUsers } from "../../services/projectApi"

const MemberManagementModal = ({ isOpen, onClose, project, onMembersUpdated }) => {
  const [members, setMembers] = useState([])
  const [availableUsers, setAvailableUsers] = useState([])
  const [selectedUserId, setSelectedUserId] = useState("")
  const [selectedRole, setSelectedRole] = useState("member")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (isOpen && project) {
      setMembers(project.members || [])
      // Filter out users who are already members
      const memberIds = (project.members || []).map((m) => m.id)
      setAvailableUsers(mockUsers.filter((user) => !memberIds.includes(user.id)))
      setSelectedUserId("")
      setError("")
    }
  }, [isOpen, project])

  const handleAddMember = async () => {
    if (!selectedUserId) return

    setLoading(true)
    setError("")

    try {
      const updatedProject = await projectApi.addMember(project.id, Number.parseInt(selectedUserId), selectedRole)
      setMembers(updatedProject.members || [])

      // Update available users
      const memberIds = (updatedProject.members || []).map((m) => m.id)
      setAvailableUsers(mockUsers.filter((user) => !memberIds.includes(user.id)))

      setSelectedUserId("")
      setSelectedRole("member")
      onMembersUpdated(updatedProject)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveMember = async (userId) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return

    setLoading(true)
    setError("")

    try {
      const updatedProject = await projectApi.removeMember(project.id, userId)
      setMembers(updatedProject.members || [])

      // Update available users
      const memberIds = (updatedProject.members || []).map((m) => m.id)
      setAvailableUsers(mockUsers.filter((user) => !memberIds.includes(user.id)))

      onMembersUpdated(updatedProject)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Manage Members</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Add Member Section */}
          {availableUsers.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Add Member</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select User</label>
                  <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Choose a user...</option>
                    {availableUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="member">Member</option>
                    {/* <option value="admin">Admin</option> */}
                  </select>
                </div>
                <button
                  onClick={handleAddMember}
                  disabled={!selectedUserId || loading}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Member
                </button>
              </div>
            </div>
          )}

          {/* Current Members Section */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Current Members ({members.length})</h3>
            {members.length === 0 ? (
              <p className="text-gray-500 text-sm">No members assigned to this project.</p>
            ) : (
              <div className="space-y-2">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-500 capitalize">{member.role}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      disabled={loading}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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

export default MemberManagementModal
