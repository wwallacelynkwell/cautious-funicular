"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Home, Package, ShoppingCart, Users, Settings, UserPlus } from "lucide-react"
import { useAuth } from "@/lib/auth-provider"

export function DashboardSidebar() {
  const pathname = usePathname()
  const { isAdmin } = useAuth()

  // Common navigation items for all users
  const commonNavItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "New Order",
      href: "/dashboard/new-order",
      icon: ShoppingCart,
    },
    {
      title: "Orders",
      href: "/dashboard/orders",
      icon: Package,
    },
    {
      title: "Customers",
      href: "/dashboard/customers",
      icon: Users,
    },
  ]

  // Admin-only navigation items
  const adminNavItems = [
    {
      title: "User Management",
      href: "/dashboard/admin/users",
      icon: Users,
    },
    {
      title: "Invite Users",
      href: "/dashboard/admin/invite",
      icon: UserPlus,
    },
    {
      title: "Settings",
      href: "/dashboard/admin/settings",
      icon: Settings,
    },
  ]

  // Combine navigation items based on user role
  const navItems = isAdmin ? [...commonNavItems, ...adminNavItems] : commonNavItems

  return (
    <div className="hidden lg:block w-64 border-r bg-muted/40">
      <div className="flex h-full flex-col py-4">
        <div className="px-4 py-2">
          <h2 className="text-lg font-semibold tracking-tight">Navigation</h2>
        </div>
        <div className="flex-1">
          <nav className="grid gap-1 px-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn("flex w-full justify-start gap-2", pathname === item.href && "bg-muted font-medium")}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}

