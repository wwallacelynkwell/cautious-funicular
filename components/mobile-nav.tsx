'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Menu,
  Home,
  Package,
  ShoppingCart,
  Users,
  Settings,
  UserPlus,
} from 'lucide-react'
import { useAuth } from '@/lib/auth-provider'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'
import { useState } from 'react'

export function MobileNav() {
  const pathname = usePathname()
  const { isAdmin } = useAuth()
  const [open, setOpen] = useState(false)

  // Common navigation items for all users
  const commonNavItems = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: Home,
    },
    {
      title: 'New Order',
      href: '/dashboard/new-order',
      icon: ShoppingCart,
    },
    {
      title: 'Orders',
      href: '/dashboard/orders',
      icon: Package,
    },
    {
      title: 'Customers',
      href: '/dashboard/customers',
      icon: Users,
    },
  ]

  // Admin-only navigation items
  const adminNavItems = [
    {
      title: 'User Management',
      href: '/dashboard/admin/users',
      icon: Users,
    },
    {
      title: 'Invite Users',
      href: '/dashboard/admin/invite',
      icon: UserPlus,
    },
    {
      title: 'Settings',
      href: '/dashboard/admin/settings',
      icon: Settings,
    },
  ]

  // Combine navigation items based on user role
  const navItems = isAdmin
    ? [...commonNavItems, ...adminNavItems]
    : commonNavItems

  return (
    <div className='lg:hidden'>
      <Sheet
        open={open}
        onOpenChange={setOpen}
      >
        <SheetTrigger asChild>
          <Button
            variant='ghost'
            size='icon'
            aria-label='Open menu'
          >
            <Menu className='h-5 w-5' />
          </Button>
        </SheetTrigger>
        <SheetContent
          side='left'
          className='w-[80%] max-w-sm p-0'
        >
          <SheetHeader className='p-4 border-b'>
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <div className='py-4'>
            <nav className='px-2 space-y-1'>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                >
                  <Button
                    variant='ghost'
                    className={cn(
                      'w-full justify-start gap-2 font-normal',
                      pathname === item.href && 'bg-accent font-medium'
                    )}
                  >
                    <item.icon className='h-4 w-4' />
                    {item.title}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
