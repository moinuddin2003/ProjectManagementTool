// "use client"
// import { Bell, Menu } from "lucide-react"

// export const Header = ({ onMenuClick, userName = "Carter Kenter" }) => {
//   return (
//     <header className="bg-white border-b border-gray-200 px-4 py-3">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-4">
//           <button
//             onClick={onMenuClick}
//             className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
//           >
//             <Menu className="w-5 h-5" />
//           </button>
//           <div className="text-lg font-semibold text-gray-900">YOUR LOGO</div>
//         </div>

//         <div className="flex items-center space-x-4">
//           <button className="p-2 text-gray-600 hover:text-gray-900">
//             <Bell className="w-5 h-5" />
//           </button>
//           <div className="flex items-center space-x-2">
//             <span className="text-sm font-medium text-gray-900">{userName}</span>
//             <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
//               <span className="text-xs font-medium text-gray-600">
//                 {userName
//                   .split(" ")
//                   .map((n) => n[0])
//                   .join("")}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   )
// }


"use client"
import { Menu } from "lucide-react"
import Logo from "../../common/Logo"
import SearchBar from "./SearchBar"
import NotificationButton from "./NotificationButton"
import UserProfile from "./UserProfile"

const Header = ({ showMobileMenu, setShowMobileMenu }) => {
  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 lg:px-6 py-4">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <Logo />
          <SearchBar />
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          <NotificationButton />
          <UserProfile />
          <button
            className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
