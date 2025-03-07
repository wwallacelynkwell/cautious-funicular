'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth-provider'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/logo'
import {
  Bell,
  LogOut,
  User,
  Settings,
  HelpCircle,
  Menu,
  X,
  ChevronDown,
  Check,
} from 'lucide-react'
import { MobileNav } from '@/components/mobile-nav'
import { CommandMenu } from '@/components/command-menu'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Define notification type
interface Notification {
  id: number
  title: string
  description: string
  time: string
  read: boolean
  link: string
}

export function DashboardHeader() {
  const { user, logout, isAdmin } = useAuth()
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const router = useRouter()

  // Mock notifications with links to their sources
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: 'New order created',
      description: 'Order #ORD-005 has been created',
      time: '10 minutes ago',
      read: false,
      link: '/dashboard/orders?id=ORD-005',
    },
    {
      id: 2,
      title: 'License activated',
      description: 'License for customer John Doe has been activated',
      time: '2 hours ago',
      read: false,
      link: '/dashboard/customers/edit/CUST-001',
    },
    {
      id: 3,
      title: 'System update',
      description: 'The portal will undergo maintenance on Sunday',
      time: '1 day ago',
      read: true,
      link: '/dashboard/support',
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  // Handle marking a single notification as read
  const markAsRead = (id: number, event: React.MouseEvent) => {
    event.stopPropagation()
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  // Handle marking all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    )
  }

  // Handle notification click to navigate to source
  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    if (!notification.read) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
      )
    }

    // Close popover
    setNotificationsOpen(false)

    // Navigate to the source
    router.push(notification.link)
  }

  return (
    <header className='sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='flex h-16 items-center justify-between px-4 md:px-6'>
        <div className='flex items-center gap-2 md:gap-4'>
          <MobileNav />

          <Link
            href='/dashboard'
            className='flex items-center gap-2'
          >
            <Logo className='h-6 w-6' />
            <span className='font-bold text-sm md:text-base'>
              License Portal
            </span>
          </Link>
        </div>

        <div className='flex-1 mx-4 hidden md:block'>
          <CommandMenu />
        </div>

        <div className='flex items-center gap-2 md:gap-4'>
          <ThemeToggle />

          {/* Notifications */}
          <Popover
            open={notificationsOpen}
            onOpenChange={setNotificationsOpen}
          >
            <PopoverTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='relative'
              >
                <Bell className='h-5 w-5' />
                {unreadCount > 0 && (
                  <Badge className='absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground'>
                    {unreadCount}
                  </Badge>
                )}
                <span className='sr-only'>Notifications</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className='w-80 p-0'
              align='end'
            >
              <div className='p-4 border-b'>
                <div className='flex items-center justify-between'>
                  <h4 className='font-semibold'>Notifications</h4>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='h-auto p-0 text-muted-foreground text-xs'
                    onClick={markAllAsRead}
                    disabled={unreadCount === 0}
                  >
                    Mark all as read
                  </Button>
                </div>
              </div>
              <div className='max-h-80 overflow-y-auto'>
                {notifications.length > 0 ? (
                  <div className='divide-y'>
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 ${
                          notification.read ? '' : 'bg-muted/50'
                        } cursor-pointer hover:bg-muted/70 transition-colors`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className='flex items-start gap-3'>
                          <div
                            className={`mt-1 h-2 w-2 rounded-full ${
                              notification.read
                                ? 'bg-transparent'
                                : 'bg-primary'
                            }`}
                          />
                          <div className='space-y-1 flex-1'>
                            <p className='text-sm font-medium'>
                              {notification.title}
                            </p>
                            <p className='text-xs text-muted-foreground'>
                              {notification.description}
                            </p>
                            <p className='text-xs text-muted-foreground'>
                              {notification.time}
                            </p>
                          </div>
                          {!notification.read && (
                            <Button
                              variant='ghost'
                              size='icon'
                              className='h-6 w-6'
                              onClick={(e) => markAsRead(notification.id, e)}
                            >
                              <Check className='h-4 w-4' />
                              <span className='sr-only'>Mark as read</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='p-4 text-center text-muted-foreground'>
                    No notifications
                  </div>
                )}
              </div>
              <div className='p-4 border-t'>
                <Button
                  variant='outline'
                  size='sm'
                  className='w-full'
                  asChild
                >
                  <Link href='/dashboard/notifications'>
                    View all notifications
                  </Link>
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                className='relative h-8 flex items-center gap-2 rounded-full'
              >
                <Avatar className='h-8 w-8'>
                  <AvatarImage
                    src={user?.image || undefined}
                    alt={user?.name || ''}
                  />
                  <AvatarFallback>
                    {user?.name ? getInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className='hidden md:inline-flex text-sm font-medium'>
                  {user?.name}
                </span>
                <ChevronDown className='h-4 w-4 hidden md:inline-flex' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className='w-56'
              align='end'
              forceMount
            >
              <DropdownMenuLabel className='font-normal'>
                <div className='flex flex-col space-y-1'>
                  <p className='text-sm font-medium leading-none'>
                    {user?.name}
                  </p>
                  <p className='text-xs leading-none text-muted-foreground'>
                    {user?.email}
                  </p>
                  {isAdmin && (
                    <Badge
                      variant='outline'
                      className='mt-1 w-fit'
                    >
                      Admin
                    </Badge>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href='/dashboard/profile'
                  className='cursor-pointer'
                >
                  <User className='mr-2 h-4 w-4' />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              {isAdmin && (
                <DropdownMenuItem asChild>
                  <Link
                    href='/dashboard/admin/settings'
                    className='cursor-pointer'
                  >
                    <Settings className='mr-2 h-4 w-4' />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link
                  href='/dashboard/support'
                  className='cursor-pointer'
                >
                  <HelpCircle className='mr-2 h-4 w-4' />
                  <span>Help & Support</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
                className='cursor-pointer'
              >
                <LogOut className='mr-2 h-4 w-4' />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
