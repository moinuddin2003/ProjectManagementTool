"use client"
import { useState } from "react"
import { BarChart3 } from "lucide-react"

const LoginForm = ({ loginForm, setLoginForm, onLogin, isLoading }) => {
  const [errors, setErrors] = useState({ email: "", password: "" })

  const validateEmail = (email) => {
    if (!email) {
      return "Email is required"
    }
    if (!email.includes("@")) {
      return "Email must contain @"
    }
    if (!email.includes(".com")) {
      return "Email must contain .com"
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return "Please enter a valid email format"
    }
    return ""
  }

  const validatePassword = (password) => {
    if (!password) {
      return "Password is required"
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters"
    }
    if (!/[A-Z]/.test(password)) {
      return "Capital letter needed"
    }
    if (!/[a-z]/.test(password)) {
      return "Small letter needed"
    }
    if (!/[0-9]/.test(password)) {
      return "Number needed"
    }
    return ""
  }

  const handleEmailChange = (e) => {
    const email = e.target.value
    setLoginForm({ ...loginForm, email })
    setErrors({ ...errors, email: validateEmail(email) })
  }

  const handlePasswordChange = (e) => {
    const password = e.target.value
    setLoginForm({ ...loginForm, password })
    setErrors({ ...errors, password: validatePassword(password) })
  }

  const handleLogin = () => {
    const emailError = validateEmail(loginForm.email)
    const passwordError = validatePassword(loginForm.password)
    setErrors({ email: emailError, password: passwordError })
    if (!emailError && !passwordError) {
      onLogin()
    }
  }

  return (
    <div className="flex-1 p-8 lg:p-12 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">Sign in to your account to continue</p>
        </div>
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <div className="block text-sm font-medium text-gray-700 mb-2">Email Address</div>
              <input
                type="email"
                value={loginForm.email}
                onChange={handleEmailChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                  errors.email ? "border-red-300" : "border-gray-200"
                }`}
                placeholder="example@gmail.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
            <div>
              <div className="block text-sm font-medium text-gray-700 mb-2">Password</div>
              <input
                type="password"
                value={loginForm.password}
                onChange={handlePasswordChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                  errors.password ? "border-red-300" : "border-gray-200"
                }`}
                placeholder="Password123 (needs: A-Z, a-z, 0-9)"
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <button type="button" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
              Register
            </button>
            <button type="button" className="text-gray-600 hover:text-gray-700 transition-colors">
              Forgot Password?
            </button>
          </div>
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                Signing In...
              </div>
            ) : (
              "SIGN IN"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
