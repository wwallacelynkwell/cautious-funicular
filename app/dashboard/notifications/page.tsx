'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Bell,
  Check,
  CheckCheck,
  Clock,
  Filter,
  Search,
  Trash2,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Define notification type
interface Notification {
  id: number
  title: string
  description: string
  time: string
  read: boolean
  link: string
  category: string
}

export default function NotificationsPage() {
  // Mock notifications with links to their sources
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: 'New order created',
      description: 'Order #ORD-005 has been created',
      time: '10 minutes ago',
      read: false,
      link: '/dashboard/orders?id=ORD-005',
      category: 'order',
    },
    {
      id: 2,
      title: 'License activated',
      description: 'License for customer John Doe has been activated',
      time: '2 hours ago',
      read: false,
      link: '/dashboard/customers/edit/CUST-001',
      category: 'license',
    },
    {
      id: 3,
      title: 'System update',
      description: 'The portal will undergo maintenance on Sunday',
      time: '1 day ago',
      read: true,
      link: '/dashboard/support',
      category: 'system',
    },
    {
      id: 4,
      title: 'Payment processed',
      description: 'Payment for invoice #INV-2023-004 has been processed',
      time: '2 days ago',
      read: true,
      link: '/dashboard/finances',
      category: 'billing',
    },
    {
      id: 5,
      title: 'New customer added',
      description: "Customer 'Acme Corporation' has been added to your account",
      time: '3 days ago',
      read: true,
      link: '/dashboard/customers',
      category: 'customer',
    },
    {
      id: 6,
      title: 'License expiring soon',
      description: '5 licenses for TechSolutions Inc will expire in 7 days',
      time: '4 days ago',
      read: false,
      link: '/dashboard/renewals',
      category: 'license',
    },
    {
      id: 7,
      title: 'Feature update available',
      description: 'Bulk license activation is now available',
      time: '1 week ago',
      read: true,
      link: '/dashboard/docs/bulk-activation',
      category: 'system',
    },
  ])

  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [activeTab, setActiveTab] = useState('all')

  // Filter notifications based on search query, category filter, and active tab
  const filteredNotifications = notifications.filter((notification) => {
    // Filter by search query
    const matchesSearch =
      searchQuery === '' ||
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.description.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by category
    const matchesCategory =
      filterCategory === 'all' || notification.category === filterCategory

    // Filter by tab (read status)
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'unread' && !notification.read) ||
      (activeTab === 'read' && notification.read)

    return matchesSearch && matchesCategory && matchesTab
  })

  // Handle marking a single notification as read
  const markAsRead = (id: number) => {
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

  // Handle deleting a notification
  const deleteNotification = (id: number) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    )
  }

  // Handle clearing all read notifications
  const clearReadNotifications = () => {
    setNotifications((prev) =>
      prev.filter((notification) => !notification.read)
    )
  }

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length

  // Get category badge
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'order':
        return (
          <Badge
            variant='outline'
            className='bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400'
          >
            Order
          </Badge>
        )
      case 'license':
        return (
          <Badge
            variant='outline'
            className='bg-purple-100 text-purple-800 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400'
          >
            License
          </Badge>
        )
      case 'system':
        return (
          <Badge
            variant='outline'
            className='bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400'
          >
            System
          </Badge>
        )
      case 'billing':
        return (
          <Badge
            variant='outline'
            className='bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400'
          >
            Billing
          </Badge>
        )
      case 'customer':
        return (
          <Badge
            variant='outline'
            className='bg-indigo-100 text-indigo-800 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400'
          >
            Customer
          </Badge>
        )
      default:
        return <Badge variant='outline'>{category}</Badge>
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Notifications</h1>
          <p className='text-muted-foreground'>
            Manage your notifications and alerts
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <CheckCheck className='mr-2 h-4 w-4' />
            Mark all as read
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={clearReadNotifications}
          >
            <Trash2 className='mr-2 h-4 w-4' />
            Clear read
          </Button>
        </div>
      </div>

      <div className='flex flex-col md:flex-row gap-4'>
        <div className='w-full md:w-64 space-y-4'>
          <Card>
            <CardHeader className='pb-3'>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <label
                  htmlFor='category'
                  className='text-sm font-medium'
                >
                  Category
                </label>
                <Select
                  value={filterCategory}
                  onValueChange={setFilterCategory}
                >
                  <SelectTrigger id='category'>
                    <SelectValue placeholder='All categories' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All categories</SelectItem>
                    <SelectItem value='order'>Orders</SelectItem>
                    <SelectItem value='license'>Licenses</SelectItem>
                    <SelectItem value='system'>System</SelectItem>
                    <SelectItem value='billing'>Billing</SelectItem>
                    <SelectItem value='customer'>Customers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <label
                  htmlFor='search'
                  className='text-sm font-medium'
                >
                  Search
                </label>
                <div className='relative'>
                  <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                  <Input
                    id='search'
                    placeholder='Search notifications...'
                    className='pl-10'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-3'>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className='space-y-2'>
              <div className='flex justify-between items-center'>
                <span className='text-sm'>Total</span>
                <Badge variant='secondary'>{notifications.length}</Badge>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm'>Unread</span>
                <Badge variant='secondary'>{unreadCount}</Badge>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm'>Read</span>
                <Badge variant='secondary'>
                  {notifications.length - unreadCount}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='flex-1'>
          <Card>
            <CardHeader className='pb-3'>
              <Tabs
                defaultValue='all'
                className='w-full'
                onValueChange={setActiveTab}
              >
                <TabsList className='w-full'>
                  <TabsTrigger
                    value='all'
                    className='flex-1'
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value='unread'
                    className='flex-1'
                  >
                    Unread
                  </TabsTrigger>
                  <TabsTrigger
                    value='read'
                    className='flex-1'
                  >
                    Read
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border ${
                        notification.read ? '' : 'bg-muted/50'
                      }`}
                    >
                      <div className='flex items-start gap-3'>
                        <div className='rounded-full bg-primary/10 p-2'>
                          <Bell className='h-4 w-4 text-primary' />
                        </div>
                        <div className='flex-1'>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-2'>
                              <h3 className='text-sm font-medium'>
                                {notification.title}
                              </h3>
                              {getCategoryBadge(notification.category)}
                            </div>
                            <div className='flex items-center gap-2'>
                              {!notification.read && (
                                <Button
                                  variant='ghost'
                                  size='icon'
                                  className='h-6 w-6'
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  <Check className='h-4 w-4' />
                                  <span className='sr-only'>Mark as read</span>
                                </Button>
                              )}
                              <Button
                                variant='ghost'
                                size='icon'
                                className='h-6 w-6 text-destructive'
                                onClick={() =>
                                  deleteNotification(notification.id)
                                }
                              >
                                <Trash2 className='h-4 w-4' />
                                <span className='sr-only'>Delete</span>
                              </Button>
                            </div>
                          </div>
                          <p className='text-sm text-muted-foreground mt-1'>
                            {notification.description}
                          </p>
                          <div className='flex items-center justify-between mt-2'>
                            <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                              <Clock className='h-3 w-3' />
                              <span>{notification.time}</span>
                            </div>
                            <Button
                              variant='link'
                              size='sm'
                              className='h-auto p-0'
                              asChild
                            >
                              <Link href={notification.link}>View details</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='text-center py-8 text-muted-foreground'>
                    <Bell className='h-12 w-12 mx-auto mb-4 opacity-20' />
                    <h3 className='text-lg font-medium mb-1'>
                      No notifications found
                    </h3>
                    <p className='text-sm'>
                      {searchQuery || filterCategory !== 'all'
                        ? 'Try changing your search or filter criteria'
                        : "You're all caught up!"}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
            {filteredNotifications.length > 0 && (
              <CardFooter className='flex justify-between'>
                <div className='text-sm text-muted-foreground'>
                  Showing {filteredNotifications.length} of{' '}
                  {notifications.length} notifications
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                >
                  <CheckCheck className='mr-2 h-4 w-4' />
                  Mark all as read
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
