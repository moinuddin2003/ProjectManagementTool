"use client"
import { useState, useEffect } from "react"

export const useAuth = () => {
  // Initialize state from localStorage if available
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isLoggedIn') === 'true'
    }
    return false
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  })

  // Update localStorage whenever login state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('isLoggedIn', isLoggedIn.toString())
    }
  }, [isLoggedIn])

  const handleLogin = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoggedIn(true)
      setIsLoading(false)
    }, 1500)
  }

  const logout = () => {
    setIsLoggedIn(false)
    setLoginForm({ email: "", password: "" })
    // Clear from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isLoggedIn')
    }
  }

  return {
    isLoggedIn,
    user: isLoggedIn ? { id: 1, name: "User" } : null,
    loading: isLoading,
    loginForm,
    setLoginForm,
    isLoading,
    handleLogin,
    logout,
  }
}