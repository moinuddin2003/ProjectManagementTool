"use client"
import { useState } from "react"

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  })

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
  }

  return {
    isLoggedIn,
    loginForm,
    setLoginForm,
    isLoading,
    handleLogin,
    logout,
  }
}
