"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { authService } from "@/services/auth.service"
import { User } from "@/types/auth"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  setAuthData: (user: User, accessToken?: string, refreshToken?: string) => void
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null)
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const router = useRouter()

  const fetchCurrentUser = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await authService.getMe()
      if (response.success && response.data) {
        setUser(response.data)
      } else {
        setUser(null)
      }
    } catch (_err) {
      // If getMe fails, attempt refresh token call
      try {
        const refreshRes = await authService.refreshToken()
        if (refreshRes.success && refreshRes.data?.accessToken) {
          if (typeof window !== "undefined") {
            localStorage.setItem("accessToken", refreshRes.data.accessToken)
            if (refreshRes.data.refreshToken) {
              localStorage.setItem("refreshToken", refreshRes.data.refreshToken)
            }
          }
          const meRes = await authService.getMe()
          if (meRes.success && meRes.data) {
            setUser(meRes.data)
          } else {
            setUser(null)
          }
        } else {
          setUser(null)
        }
      } catch (_refreshErr) {
        setUser(null)
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken")
          localStorage.removeItem("refreshToken")
        }
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchCurrentUser()
  }, [fetchCurrentUser])

  const setAuthData = React.useCallback(
    (userData: User, accessToken?: string, refreshToken?: string) => {
      setUser(userData)
      if (typeof window !== "undefined") {
        if (accessToken) localStorage.setItem("accessToken", accessToken)
        if (refreshToken) localStorage.setItem("refreshToken", refreshToken)
      }
    },
    []
  )

  const logout = React.useCallback(() => {
    setUser(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
    }
    toast.success("Logged out successfully")
    router.push("/login")
  }, [router])

  const value = React.useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      setAuthData,
      logout,
      refreshUser: fetchCurrentUser,
    }),
    [user, isLoading, setAuthData, logout, fetchCurrentUser]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
