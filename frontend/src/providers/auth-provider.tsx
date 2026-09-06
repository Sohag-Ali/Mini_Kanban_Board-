"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { toast } from "sonner"

import { authService } from "@/services/auth.service"
import { User } from "@/types/auth"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  isLoggingOut: boolean
  setAuthData: (user: User, accessToken?: string, refreshToken?: string) => void
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null)
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)
  const authRequestId = React.useRef(0)
  const isLoggingOutRef = React.useRef(false)
  const pathname = usePathname()
  const router = useRouter()

  React.useEffect(() => {
    if (pathname === "/" && isLoggingOutRef.current) {
      isLoggingOutRef.current = false
      setIsLoggingOut(false)
    }
  }, [pathname])

  const fetchCurrentUser = React.useCallback(async () => {
    isLoggingOutRef.current = false
    const requestId = ++authRequestId.current
    setIsLoading(true)
    try {
      const response = await authService.getMe()
      if (requestId !== authRequestId.current || isLoggingOutRef.current) {
        return
      }
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
          if (requestId !== authRequestId.current || isLoggingOutRef.current) {
            return
          }
          if (meRes.success && meRes.data) {
            setUser(meRes.data)
          } else {
            setUser(null)
          }
        } else {
          setUser(null)
        }
      } catch (_refreshErr) {
        if (requestId !== authRequestId.current || isLoggingOutRef.current) {
          return
        }
        setUser(null)
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken")
          localStorage.removeItem("refreshToken")
        }
      }
    } finally {
      if (requestId === authRequestId.current && !isLoggingOutRef.current) {
        setIsLoading(false)
      }
    }
  }, [])

  React.useEffect(() => {
    fetchCurrentUser()
  }, [fetchCurrentUser])

  const setAuthData = React.useCallback(
    (userData: User, accessToken?: string, refreshToken?: string) => {
      isLoggingOutRef.current = false
      setIsLoggingOut(false)
      authRequestId.current += 1
      setUser(userData)
      if (typeof window !== "undefined") {
        if (accessToken) localStorage.setItem("accessToken", accessToken)
        if (refreshToken) localStorage.setItem("refreshToken", refreshToken)
      }
    },
    []
  )

  const logout = React.useCallback(() => {
    isLoggingOutRef.current = true
    setIsLoggingOut(true)
    authRequestId.current += 1
    setUser(null)
    setIsLoading(false)
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
    }
    toast.success("Logged out successfully")
    router.replace("/")
  }, [router])

  const value = React.useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      isLoggingOut,
      setAuthData,
      logout,
      refreshUser: fetchCurrentUser,
    }),
    [user, isLoading, isLoggingOut, setAuthData, logout, fetchCurrentUser]
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
