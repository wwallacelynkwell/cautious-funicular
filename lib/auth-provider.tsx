"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

// Mock user data - in a real app, this would come from your backend
const MOCK_USERS = [
  { id: "1", username: "admin", password: "admin123", name: "Admin User", role: "admin", email: "admin@example.com" },
  {
    id: "2",
    username: "reseller1",
    password: "password1",
    name: "Reseller One",
    role: "reseller",
    email: "reseller1@example.com",
  },
  {
    id: "3",
    username: "reseller2",
    password: "password2",
    name: "Reseller Two",
    role: "reseller",
    email: "reseller2@example.com",
  },
]

// Mock invites data
const MOCK_INVITES = [
  { id: "inv1", email: "pending@example.com", token: "abc123", createdAt: "2023-05-01", status: "pending" },
]

interface User {
  id: string
  username: string
  name: string
  role: "admin" | "reseller"
  email: string
}

interface Invite {
  id: string
  email: string
  token: string
  createdAt: string
  status: "pending" | "accepted"
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
  isAdmin: boolean
  inviteUser: (email: string) => Promise<void>
  getInvites: () => Invite[]
  getUsers: () => User[]
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [invites, setInvites] = useState<Invite[]>(MOCK_INVITES)
  const [users, setUsers] = useState<User[]>(MOCK_USERS)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check for stored user on initial load
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    // Redirect logic
    if (!isLoading) {
      const isAuthPage = pathname === "/"
      const isProtectedRoute = pathname?.startsWith("/dashboard")
      const isAdminRoute = pathname?.startsWith("/dashboard/admin")

      if (user && isAuthPage) {
        router.push("/dashboard")
      } else if (!user && isProtectedRoute) {
        router.push("/")
      } else if (user && isAdminRoute && user.role !== "admin") {
        // Redirect non-admin users trying to access admin routes
        router.push("/dashboard")
      }
    }
  }, [user, pathname, isLoading, router])

  const login = async (username: string, password: string) => {
    // Simulate API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const foundUser = MOCK_USERS.find((u) => u.username === username && u.password === password)

        if (foundUser) {
          const { password, ...userWithoutPassword } = foundUser
          setUser(userWithoutPassword)
          localStorage.setItem("user", JSON.stringify(userWithoutPassword))
          resolve()
        } else {
          reject(new Error("Invalid credentials"))
        }
      }, 1000)
    })
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/")
  }

  const inviteUser = async (email: string) => {
    // Simulate API call to invite a user
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Check if user already exists
        const existingUser = MOCK_USERS.find((u) => u.email === email)
        if (existingUser) {
          reject(new Error("User with this email already exists"))
          return
        }

        // Check if invite already exists
        const existingInvite = invites.find((i) => i.email === email)
        if (existingInvite) {
          reject(new Error("Invite for this email already sent"))
          return
        }

        // Create new invite
        const newInvite: Invite = {
          id: `inv${invites.length + 1}`,
          email,
          token: Math.random().toString(36).substring(2, 15),
          createdAt: new Date().toISOString(),
          status: "pending",
        }

        setInvites((prev) => [...prev, newInvite])
        resolve()
      }, 1000)
    })
  }

  const getInvites = () => {
    return invites
  }

  const getUsers = () => {
    // Return users without passwords
    return users.map(({ password, ...user }: any) => user)
  }

  const isAdmin = user?.role === "admin"

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoading,
        isAdmin,
        inviteUser,
        getInvites,
        getUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

