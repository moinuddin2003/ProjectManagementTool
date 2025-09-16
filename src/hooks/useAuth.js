import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  })

  // Register form state
  const [registerForm, setRegisterForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNo: "",
    designation: "",
  })

  // Check if user is already logged in on app start
  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (token) {
      setIsLoggedIn(true)
    }
  }, [])

  // Login function
  const handleLogin = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("https://pm.makeamoveltd.com/public/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const token = data.token || data.data?.token || data.access_token

        if (token) {
          localStorage.setItem("authToken", token)
          localStorage.setItem("user", JSON.stringify(data.user || data.data?.user))
          setIsLoggedIn(true)

          toast.success("Login successful!")

          // Reset form
          setLoginForm({ email: "", password: "" })
        } else {
          throw new Error("No token received from server")
        }
      } else {
        throw new Error(data.message || "Login failed")
      }
    } catch (error) {
      console.error("Login error:", error)
      toast.error(error.message || "Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Register function
  const handleRegister = async () => {
    setIsLoading(true)

    try {
      // Transform frontend form data to match your API structure
      const apiPayload = {
        name: `${registerForm.firstName} ${registerForm.lastName}`,
        email: registerForm.email,
        password: registerForm.password,
        password_confirmation: registerForm.confirmPassword,
        slack_id: "U12345", // You might want to make this dynamic or optional
        phone_no: registerForm.phoneNo || "+1234567890",
        designation: registerForm.designation || "Developer",
      }

      const response = await fetch("https://pm.makeamoveltd.com/public/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(apiPayload),
      })

      const data = await response.json()

      if (response.ok) {
        const token = data.token || data.data?.token || data.access_token

        if (token) {
          localStorage.setItem("authToken", token)
          localStorage.setItem("user", JSON.stringify(data.user || data.data?.user))
          setIsLoggedIn(true)

          toast.success("Registration successful!")

          // Reset form
          setRegisterForm({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            phoneNo: "",
            designation: "",
          })
        } else {
          throw new Error("No token received from server")
        }
      } else {
        throw new Error(data.message || "Registration failed")
      }
    } catch (error) {
      console.error("Registration error:", error)
      toast.error(error.message || "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
    setIsLoggedIn(false)
    setLoginForm({ email: "", password: "" })
    setRegisterForm({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNo: "",
      designation: "",
    })
 toast.info("You have been logged out.")
    setTimeout(() => {
    window.location.href = "/login"
  }, 300) // client-side navigation, toast stays visible
  }

  return {
    isLoggedIn,
    isLoading,
    loginForm,
    setLoginForm,
    registerForm,
    setRegisterForm,
    handleLogin,
    handleRegister,
    handleLogout,
  }
}
