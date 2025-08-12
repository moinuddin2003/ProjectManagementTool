import { BarChart3 } from "lucide-react"

const Logo = () => {
  return (
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
        <BarChart3 className="w-6 h-6 text-white" />
      </div>
      <div className="hidden sm:block">
        <div className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          YOUR LOGO
        </div>
      </div>
    </div>
  )
}

export default Logo
