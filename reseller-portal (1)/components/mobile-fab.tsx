"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Menu, X, Home, Package, ShoppingCart, Users } from "lucide-react"

const navItems = [
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

export function MobileFab() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="fixed bottom-4 right-4 z-40 lg:hidden">
      <Button size="icon" className="rounded-full shadow-lg h-12 w-12" onClick={() => setOpen(true)}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Open navigation menu</span>
      </Button>

      {/* Mobile menu overlay */}
      {open && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={() => setOpen(false)}>
          {/* Stop propagation to prevent closing when clicking the menu itself */}
          <div
            className="fixed inset-y-0 left-0 z-50 w-3/4 max-w-sm bg-background p-6 shadow-lg animate-in slide-in-from-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-semibold">Navigation</h2>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <nav className="grid gap-2">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
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
      )}
    </div>
  )
}

