'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  Settings,
  UserPlus,
  BarChart3,
  FileText,
  HelpCircle,
} from 'lucide-react'
import { useAuth } from '@/lib/auth-provider'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { useState } from 'react'

export function DashboardSidebar() {
  const pathname = usePathname()
  const { isAdmin } = useAuth()
  const [openSection, setOpenSection] = useState<string | null>('main')

  // Common navigation items for all users
  const commonNavItems = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      section: 'main',
    },
    {
      title: 'Orders',
      section: 'orders',
      items: [
        {
          title: 'New Order',
          href: '/dashboard/new-order',
          icon: ShoppingCart,
        },
        {
          title: 'View Orders',
          href: '/dashboard/orders',
          icon: Package,
        },
      ],
    },
    {
      title: 'Customers',
      href: '/dashboard/customers',
      icon: Users,
      section: 'main',
    },
    {
      title: 'Reports',
      href: '/dashboard/reports',
      icon: BarChart3,
      section: 'main',
    },
    {
      title: 'Documentation',
      href: '/dashboard/docs',
      icon: FileText,
      section: 'main',
    },
    {
      title: 'Help & Support',
      href: '/dashboard/support',
      icon: HelpCircle,
      section: 'main',
    },
  ]

  // Admin-only navigation items
  const adminNavItems = [
    {
      title: 'Admin',
      section: 'admin',
      items: [
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
      ],
    },
  ]

  // Combine navigation items based on user role
  const navItems = isAdmin
    ? [...commonNavItems, ...adminNavItems]
    : commonNavItems

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section)
  }

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <div className='lg:block w-full lg:w-64 border-r bg-sidebar-background text-sidebar-foreground'>
      <div className='flex h-full flex-col py-4'>
        <div className='px-4 py-2'>
          <h2 className='text-lg font-semibold tracking-tight'>Navigation</h2>
        </div>
        <div className='flex-1 overflow-auto'>
          <nav className='grid gap-1 px-2'>
            {navItems.map((item) =>
              item.items ? (
                <Collapsible
                  key={item.section}
                  open={openSection === item.section}
                  onOpenChange={() => toggleSection(item.section)}
                  className='w-full'
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant='ghost'
                      className={cn(
                        'flex w-full justify-between items-center gap-2 mb-1',
                        item.items.some((subItem) => isActive(subItem.href)) &&
                          'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                      )}
                    >
                      <span className='flex items-center gap-2'>
                        {item.section === 'orders' && (
                          <ShoppingCart className='h-4 w-4' />
                        )}
                        {item.section === 'admin' && (
                          <Settings className='h-4 w-4' />
                        )}
                        {item.title}
                      </span>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className={cn(
                          'h-4 w-4 transition-transform',
                          openSection === item.section
                            ? 'transform rotate-180'
                            : ''
                        )}
                      >
                        <polyline points='6 9 12 15 18 9'></polyline>
                      </svg>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className='pl-4 space-y-1'>
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                      >
                        <Button
                          variant='ghost'
                          className={cn(
                            'flex w-full justify-start gap-2 py-1.5',
                            isActive(subItem.href) &&
                              'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                          )}
                        >
                          <subItem.icon className='h-4 w-4' />
                          {subItem.title}
                        </Button>
                      </Link>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                >
                  <Button
                    variant='ghost'
                    className={cn(
                      'flex w-full justify-start gap-2',
                      isActive(item.href) &&
                        'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                    )}
                  >
                    <item.icon className='h-4 w-4' />
                    {item.title}
                  </Button>
                </Link>
              )
            )}
          </nav>
        </div>
      </div>
    </div>
  )
}
