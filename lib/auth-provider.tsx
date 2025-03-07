'use client'

import type React from 'react'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { resellers } from '@/app/api/database'
import Cookies from 'js-cookie'

// Convert resellers data to users format
const MOCK_USERS = [
  {
    id: 'ADMIN-001',
    username: 'admin',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin' as const,
    email: 'admin@example.com',
  },
  ...resellers.map((reseller) => ({
    id: reseller.id,
    username: reseller.name.toLowerCase().replace(/\s+/g, ''),
    password: 'password123',
    name: reseller.name,
    role: 'reseller' as const,
    email: reseller.email,
  })),
]

// Mock invites data
const MOCK_INVITES = [
  {
    id: 'inv1',
    email: 'pending@example.com',
    token: 'abc123',
    createdAt: '2023-05-01',
    status: 'pending' as const,
  },
]

interface User {
  id: string
  username: string
  name: string
  role: 'admin' | 'reseller'
  email: string
}

interface Invite {
  id: string
  email: string
  token: string
  createdAt: string
  status: 'pending' | 'accepted'
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
  canAccessResource: (resourceUserId: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Cookie name for storing auth data
const AUTH_COOKIE_NAME = 'auth_data'
// Cookie expiration in days
const COOKIE_EXPIRATION = 7

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [invites, setInvites] = useState<Invite[]>(MOCK_INVITES)
  const router = useRouter()
  const pathname = usePathname()

  // Load user from cookie on initial load
  useEffect(() => {
    const cookieData = Cookies.get(AUTH_COOKIE_NAME)
    if (cookieData) {
      try {
        const userData = JSON.parse(cookieData)
        setUser(userData)
      } catch (error) {
        console.error('Error parsing auth cookie:', error)
        Cookies.remove(AUTH_COOKIE_NAME)
      }
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    // Redirect logic
    if (!isLoading) {
      const isAuthPage = pathname === '/'
      const isProtectedRoute = pathname?.startsWith('/dashboard')
      const isAdminRoute = pathname?.startsWith('/dashboard/admin')

      if (user && isAuthPage) {
        router.push('/dashboard')
      } else if (!user && isProtectedRoute) {
        router.push('/')
      } else if (user && isAdminRoute && user.role !== 'admin') {
        // Redirect non-admin users trying to access admin routes
        router.push('/dashboard')
      }
    }
  }, [user, pathname, isLoading, router])

  const login = async (username: string, password: string) => {
    setIsLoading(true)

    try {
      // Find the user with matching credentials
      // Make username comparison case-insensitive by converting both to lowercase
      const foundUser = MOCK_USERS.find(
        (u) =>
          u.username.toLowerCase() === username.toLowerCase() &&
          u.password === password
      )

      if (!foundUser) {
        throw new Error('Invalid credentials')
      }

      // Remove password from user object
      const { password: _, ...userWithoutPassword } = foundUser

      // Set user state
      setUser(userWithoutPassword)

      // Store user in cookie
      Cookies.set(AUTH_COOKIE_NAME, JSON.stringify(userWithoutPassword), {
        expires: COOKIE_EXPIRATION,
        sameSite: 'strict',
      })

      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    // Remove auth cookie
    Cookies.remove(AUTH_COOKIE_NAME)
    router.push('/')
  }

  const inviteUser = async (email: string) => {
    setIsLoading(true)

    try {
      // Check if user already exists
      const existingUser = MOCK_USERS.find((u) => u.email === email)
      if (existingUser) {
        throw new Error('User with this email already exists')
      }

      // Check if invite already exists
      const existingInvite = invites.find((i) => i.email === email)
      if (existingInvite) {
        throw new Error('Invite for this email already sent')
      }

      // Create new invite
      const newInvite: Invite = {
        id: `inv${invites.length + 1}`,
        email,
        token: Math.random().toString(36).substring(2, 15),
        createdAt: new Date().toISOString(),
        status: 'pending',
      }

      setInvites((prev) => [...prev, newInvite])
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    } finally {
      setIsLoading(false)
    }
  }

  const getInvites = () => {
    return invites
  }

  const getUsers = () => {
    // Return users without passwords
    return MOCK_USERS.map(({ password, ...user }) => user)
  }

  // Function to check if the current user can access a resource
  const canAccessResource = (resourceUserId: string) => {
    if (!user) return false

    // Admin can access all resources
    if (user.role === 'admin') return true

    // Resellers can only access their own resources
    return user.id === resourceUserId
  }

  const isAdmin = user?.role === 'admin'

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
        canAccessResource,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
