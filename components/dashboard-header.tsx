"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth-provider"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { LogOut, User } from "lucide-react"
import { MobileNav } from "@/components/mobile-nav"

export function DashboardHeader() {
  const { user, logout } = useAuth()

  return (
    <header className="border-b">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2 md:gap-4">
          <MobileNav />

          <Link href="/dashboard" className="flex items-center gap-2">
            <Logo className="h-6 w-6" />
            <span className="font-bold text-sm md:text-base">License Portal</span>
          </Link>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">{user?.name}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={logout}>
            <LogOut className="h-4 w-4" />
            <span className="sr-only">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

