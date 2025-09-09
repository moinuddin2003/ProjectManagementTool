import { useState, useEffect, useRef } from "react"
import { ChevronDown, Settings, Lock, LogOut } from "lucide-react"
import { useAuth } from "../../../hooks/useAuth"
import ProfileModal from "../../profile/ProfileModal"
import ChangePasswordModal from "../../profile/ChangePasswordModal"


const UserProfile = () => {
  const { handleLogout } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [user, setUser] = useState(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const getUserInitials = (name) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleLogoutClick = () => {
    setIsDropdownOpen(false)
    handleLogout()
  }

  const handleProfileClick = () => {
    setIsDropdownOpen(false)
    setIsProfileModalOpen(true)
  }

  const handlePasswordClick = () => {
    setIsDropdownOpen(false)
    setIsPasswordModalOpen(true)
  }

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center space-x-3 hover:bg-gray-50 rounded-xl p-2 transition-colors"
        >
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold text-gray-900">{user?.name || "User"}</div>
            <div className="text-xs text-gray-600">{user?.designation || "Team Member"}</div>
          </div>
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
            {user?.avatar ? (
              <img
                src={user.avatar || "/placeholder.svg"}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <span className="text-white font-medium text-sm">{getUserInitials(user?.name)}</span>
            )}
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
            <button
              onClick={handleProfileClick}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
            >
              <Settings className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
            <button
              onClick={handlePasswordClick}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
            >
              <Lock className="w-4 h-4" />
              <span>Change Password</span>
            </button>
            <hr className="my-2 border-gray-200" />
            <button
              onClick={handleLogoutClick}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>

      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
      <ChangePasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />
    </>
  )
}

export default UserProfile
