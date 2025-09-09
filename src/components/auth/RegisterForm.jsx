import { useState } from "react"
import { UserPlus } from "lucide-react"
import { useNavigate } from "react-router-dom"


const RegisterForm = ({ registerForm, setRegisterForm, onRegister, isLoading }) => {
  const navigate = useNavigate()
  const [errors, setErrors] = useState({ 
    firstName: "", 
    lastName: "", 
    email: "", 
    password: "", 
    confirmPassword: "" 
  })

  const validateFirstName = (firstName) => {
    if (!firstName) {
      return "First name is required"
    }
    if (firstName.length < 2) {
      return "First name must be at least 2 characters"
    }
    if (!/^[a-zA-Z\s]+$/.test(firstName)) {
      return "First name can only contain letters"
    }
    return ""
  }

  const validateLastName = (lastName) => {
    if (!lastName) {
      return "Last name is required"
    }
    if (lastName.length < 2) {
      return "Last name must be at least 2 characters"
    }
    if (!/^[a-zA-Z\s]+$/.test(lastName)) {
      return "Last name can only contain letters"
    }
    return ""
  }

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

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) {
      return "Please confirm your password"
    }
    if (confirmPassword !== password) {
      return "Passwords do not match"
    }
    return ""
  }

  const handleFirstNameChange = (e) => {
    const firstName = e.target.value
    setRegisterForm({ ...registerForm, firstName })
    setErrors({ ...errors, firstName: validateFirstName(firstName) })
  }

  const handleLastNameChange = (e) => {
    const lastName = e.target.value
    setRegisterForm({ ...registerForm, lastName })
    setErrors({ ...errors, lastName: validateLastName(lastName) })
  }

  const handleEmailChange = (e) => {
    const email = e.target.value
    setRegisterForm({ ...registerForm, email })
    setErrors({ ...errors, email: validateEmail(email) })
  }

  const handlePasswordChange = (e) => {
    const password = e.target.value
    setRegisterForm({ ...registerForm, password })
    setErrors({ 
      ...errors, 
      password: validatePassword(password),
      confirmPassword: registerForm.confirmPassword ? validateConfirmPassword(registerForm.confirmPassword, password) : ""
    })
  }

  const handleConfirmPasswordChange = (e) => {
    const confirmPassword = e.target.value
    setRegisterForm({ ...registerForm, confirmPassword })
    setErrors({ ...errors, confirmPassword: validateConfirmPassword(confirmPassword, registerForm.password) })
  }

  const handleRegister = () => {
    const firstNameError = validateFirstName(registerForm.firstName)
    const lastNameError = validateLastName(registerForm.lastName)
    const emailError = validateEmail(registerForm.email)
    const passwordError = validatePassword(registerForm.password)
    const confirmPasswordError = validateConfirmPassword(registerForm.confirmPassword, registerForm.password)
    
    setErrors({ 
      firstName: firstNameError, 
      lastName: lastNameError, 
      email: emailError, 
      password: passwordError, 
      confirmPassword: confirmPasswordError 
    })
    
    if (!firstNameError && !lastNameError && !emailError && !passwordError && !confirmPasswordError) {
      onRegister()
    }
  }

  return (
    <div className="flex-1 p-8 lg:p-12 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
            Create Account
          </h1>
          <p className="text-gray-600">Join us and start managing your projects</p>
        </div>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="block text-sm font-medium text-gray-700 mb-2">First Name</div>
                <input
                  type="text"
                  value={registerForm.firstName}
                  onChange={handleFirstNameChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                    errors.firstName ? "border-red-300" : "border-gray-200"
                  }`}
                  placeholder="John"
                />
                {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
              </div>
              <div>
                <div className="block text-sm font-medium text-gray-700 mb-2">Last Name</div>
                <input
                  type="text"
                  value={registerForm.lastName}
                  onChange={handleLastNameChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                    errors.lastName ? "border-red-300" : "border-gray-200"
                  }`}
                  placeholder="Doe"
                />
                {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
              </div>
            </div>
            <div>
              <div className="block text-sm font-medium text-gray-700 mb-2">Email Address</div>
              <input
                type="email"
                value={registerForm.email}
                onChange={handleEmailChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                  errors.email ? "border-red-300" : "border-gray-200"
                }`}
                placeholder="john@example.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
            <div>
              <div className="block text-sm font-medium text-gray-700 mb-2">Password</div>
              <input
                type="password"
                value={registerForm.password}
                onChange={handlePasswordChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                  errors.password ? "border-red-300" : "border-gray-200"
                }`}
                placeholder="Password123 (needs: A-Z, a-z, 0-9)"
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>
            <div>
              <div className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</div>
              <input
                type="password"
                value={registerForm.confirmPassword}
                onChange={handleConfirmPasswordChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                  errors.confirmPassword ? "border-red-300" : "border-gray-200"
                }`}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>
            <div>
              <div className="block text-sm font-medium text-gray-700 mb-2">Phone Number</div>
              <input
                type="tel"
                value={registerForm.phoneNo || ""}
                onChange={(e) => setRegisterForm({ ...registerForm, phoneNo: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                placeholder="+1234567890"
              />
            </div>
            <div>
              <div className="block text-sm font-medium text-gray-700 mb-2">Designation</div>
              <select
                value={registerForm.designation || ""}
                onChange={(e) => setRegisterForm({ ...registerForm, designation: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
              >
                <option value="">Select your role</option>
                <option value="Engineer">Engineer</option>
                <option value="Developer">Developer</option>
                <option value="Designer">Designer</option>
                <option value="Manager">Manager</option>
                <option value="Analyst">Analyst</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <button 
              type="button" 
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Already have an account? Sign In
            </button>
          </div>
          <button
            onClick={handleRegister}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                Creating Account...
              </div>
            ) : (
              "CREATE ACCOUNT"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default RegisterForm