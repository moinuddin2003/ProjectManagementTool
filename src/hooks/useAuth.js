"use client"

import { useState, useCallback } from "react"

export const useAuth = () => {
  const [authState, setAuthState] = useState({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  })

  const login = useCallback(async (credentials) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }))

    // Simulate API call
    setTimeout(() => {
      setAuthState({
        user: {
          username: credentials.username,
          name: "Carter Kenter",
        },
        isAuthenticated: true,
        isLoading: false,
      })
    }, 1000)
  }, [])

  const logout = useCallback(() => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    })
  }, [])

  return {
    ...authState,
    login,
    logout,
  }
}
