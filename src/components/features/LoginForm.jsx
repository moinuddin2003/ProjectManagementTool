"use client"

import { useState } from "react"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"

export const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      onLogin({ username, password })
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-4xl w-full mx-4 bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex">
          <div className="w-full md:w-1/2 p-8">
            <div className="mb-8">
              <div className="bg-gray-300 text-center py-3 rounded text-gray-600 font-medium">Header</div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  required
                />

                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="bg-blue-500 text-white hover:bg-blue-600"
                >
                  Register
                </Button>
                <button type="button" className="text-sm text-gray-600 hover:text-gray-900">
                  Forgot Password?
                </button>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 text-lg font-medium"
                disabled={isLoading}
              >
                {isLoading ? "SIGNING IN..." : "SIGN IN"}
              </Button>
            </form>
          </div>

          <div className="hidden md:block w-1/2 bg-gray-200 p-8">
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-700 mb-2">YOUR</div>
                <div className="text-2xl font-bold text-gray-700">LOGO</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
