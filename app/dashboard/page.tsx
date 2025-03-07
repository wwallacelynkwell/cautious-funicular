'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  Package,
  ShieldCheck,
  ShoppingCart,
  CreditCard,
  Zap,
  ArrowRight,
  ArrowUpRight,
  Clock,
  AlertCircle,
  BarChart3,
  Users,
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Overview } from '@/components/overview'
import { RecentSales } from '@/components/recent-sales'
import {
  getVisibleOrders,
  getVisibleCustomers,
  softwarePackages,
  bundles,
  warrantyPackages,
} from '@/app/api/database'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalStations: 0,
    totalLicenses: 0,
    softwareLicenses: {
      basic: 0,
      pro: 0,
      enterprise: 0,
    },
    warrantyLicenses: {
      basic: 0,
      extended: 0,
      premium: 0,
    },
  })

  useEffect(() => {
    // Calculate statistics from orders
    const orders = getVisibleOrders()
    const customers = getVisibleCustomers()

    let totalStations = 0
    let totalLicenses = 0
    const softwareLicenses = { basic: 0, pro: 0, enterprise: 0 }
    const warrantyLicenses = { basic: 0, extended: 0, premium: 0 }

    orders.forEach((order) => {
      if (order.items) {
        order.items.forEach((item) => {
          // Count stations (each item represents one station)
          totalStations++

          // Count software licenses
          if (item.startsWith('sw') || item.startsWith('b')) {
            totalLicenses++
            if (item === 'sw1' || item === 'b1') softwareLicenses.basic++
            else if (item === 'sw2' || item === 'b2') softwareLicenses.pro++
            else if (item === 'sw3' || item === 'b3')
              softwareLicenses.enterprise++
          }

          // Count warranty licenses
          if (item.startsWith('wr') || item.startsWith('b')) {
            totalLicenses++
            if (item === 'wr1' || item === 'b1') warrantyLicenses.basic++
            else if (item === 'wr2' || item === 'b2')
              warrantyLicenses.extended++
            else if (item === 'wr3' || item === 'b3') warrantyLicenses.premium++
          }
        })
      }
    })

    setStats({
      totalStations,
      totalLicenses,
      softwareLicenses,
      warrantyLicenses,
    })
  }, [])

  // Calculate percentages for license quotas
  const totalSoftware =
    stats.softwareLicenses.basic +
    stats.softwareLicenses.pro +
    stats.softwareLicenses.enterprise
  const proLicensePercentage = totalSoftware
    ? Math.round((stats.softwareLicenses.pro / totalSoftware) * 100)
    : 0
  const enterpriseLicensePercentage = totalSoftware
    ? Math.round((stats.softwareLicenses.enterprise / totalSoftware) * 100)
    : 0
  const basicLicensePercentage = totalSoftware
    ? Math.round((stats.softwareLicenses.basic / totalSoftware) * 100)
    : 0

  return (
    <div className='space-y-4 md:space-y-6'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>
          <p className='text-muted-foreground'>
            Welcome to your reseller portal dashboard
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            asChild
            variant='outline'
            size='sm'
          >
            <Link href='/dashboard/reports'>
              <BarChart3 className='mr-2 h-4 w-4' />
              View Reports
            </Link>
          </Button>
          <Button
            asChild
            size='sm'
          >
            <Link href='/dashboard/new-order'>
              <ShoppingCart className='mr-2 h-4 w-4' />
              New Order
            </Link>
          </Button>
        </div>
      </div>

      <Tabs
        defaultValue='overview'
        className='space-y-4'
      >
        <TabsList>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='analytics'>Analytics</TabsTrigger>
          <TabsTrigger value='reports'>Reports</TabsTrigger>
          <TabsTrigger value='notifications'>Notifications</TabsTrigger>
        </TabsList>

        <TabsContent
          value='overview'
          className='space-y-4'
        >
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Charging Stations
                </CardTitle>
                <Zap className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{stats.totalStations}</div>
                <div className='flex items-center pt-1'>
                  <span className='text-xs text-emerald-500 font-medium flex items-center'>
                    +8.1%
                    <ArrowUpRight className='h-3 w-3 ml-0.5' />
                  </span>
                  <span className='text-xs text-muted-foreground ml-1.5'>
                    from last month
                  </span>
                </div>
              </CardContent>
              <CardFooter className='p-2'>
                <Link
                  href='/dashboard/stations'
                  className='text-xs text-primary flex items-center w-full justify-end'
                >
                  View all stations
                  <ArrowRight className='h-3 w-3 ml-0.5' />
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Software Licenses
                </CardTitle>
                <Package className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{stats.totalLicenses}</div>
                <div className='flex items-center pt-1'>
                  <span className='text-xs text-emerald-500 font-medium flex items-center'>
                    +12.3%
                    <ArrowUpRight className='h-3 w-3 ml-0.5' />
                  </span>
                  <span className='text-xs text-muted-foreground ml-1.5'>
                    from last month
                  </span>
                </div>
              </CardContent>
              <CardFooter className='p-2'>
                <Link
                  href='/dashboard/licenses'
                  className='text-xs text-primary flex items-center w-full justify-end'
                >
                  View all licenses
                  <ArrowRight className='h-3 w-3 ml-0.5' />
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>License Quota</CardTitle>
              </CardHeader>
              <CardContent className='space-y-5'>
                <div className='space-y-2'>
                  <div className='flex items-center justify-between text-sm'>
                    <div>Pro Licenses</div>
                    <div className='font-medium'>{proLicensePercentage}%</div>
                  </div>
                  <Progress
                    value={proLicensePercentage}
                    className='h-2'
                  />
                </div>
                <div className='space-y-2'>
                  <div className='flex items-center justify-between text-sm'>
                    <div>Enterprise Licenses</div>
                    <div className='font-medium'>
                      {enterpriseLicensePercentage}%
                    </div>
                  </div>
                  <Progress
                    value={enterpriseLicensePercentage}
                    className='h-2'
                  />
                </div>
                <div className='space-y-2'>
                  <div className='flex items-center justify-between text-sm'>
                    <div>Basic Licenses</div>
                    <div className='font-medium'>{basicLicensePercentage}%</div>
                  </div>
                  <Progress
                    value={basicLicensePercentage}
                    className='h-2'
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant='outline'
                  size='sm'
                  className='w-full'
                  asChild
                >
                  <Link href='/dashboard/licenses/request'>
                    Request more licenses
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardContent className='pt-6'>
                <div className='flex items-start gap-4'>
                  <div className='rounded-full bg-amber-100 dark:bg-amber-900/50 p-2 mt-0.5'>
                    <ShieldCheck className='h-4 w-4 text-amber-600 dark:text-amber-400' />
                  </div>
                  <div>
                    <p className='text-sm font-medium text-amber-800 dark:text-amber-400'>
                      Portal Purpose
                    </p>
                    <p className='text-xs text-amber-700 dark:text-amber-500'>
                      This portal is for activating software and warranty
                      licenses and associating them with charging station serial
                      numbers. You are responsible for tracking your costs,
                      client invoicing, and payment processing separately.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className='grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7'>
            <Card className='col-span-4'>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className='pl-2'>
                <Overview />
              </CardContent>
            </Card>

            <Card className='col-span-3'>
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <RecentSales />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent
          value='analytics'
          className='space-y-4'
        >
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest actions and system events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-8'>
                {[
                  {
                    icon: ShoppingCart,
                    title: 'New order created',
                    description: '10 charging stations - Pro Software',
                    time: '2 hours ago',
                    badge: { text: 'Order', variant: 'default' },
                  },
                  {
                    icon: Package,
                    title: 'Software licenses generated',
                    description: '5 charging stations - Enterprise Software',
                    time: 'Yesterday',
                    badge: { text: 'License', variant: 'outline' },
                  },
                  {
                    icon: ShieldCheck,
                    title: 'Bundle package ordered',
                    description: '8 charging stations - Pro Bundle',
                    time: '3 days ago',
                    badge: { text: 'Bundle', variant: 'secondary' },
                  },
                  {
                    icon: Users,
                    title: 'New customer added',
                    description: 'Acme Corporation - contact: john@acme.com',
                    time: '4 days ago',
                    badge: { text: 'Customer', variant: 'outline' },
                  },
                  {
                    icon: CreditCard,
                    title: 'Payment processed',
                    description: 'Invoice #INV-2023-004 - $12,450',
                    time: '1 week ago',
                    badge: { text: 'Payment', variant: 'secondary' },
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className='flex items-start gap-4'
                  >
                    <div className='rounded-full bg-primary/10 p-2'>
                      <activity.icon className='h-4 w-4 text-primary' />
                    </div>
                    <div className='flex-1'>
                      <div className='flex items-center gap-2'>
                        <p className='text-sm font-medium'>{activity.title}</p>
                        <Badge variant={activity.badge.variant as any}>
                          {activity.badge.text}
                        </Badge>
                      </div>
                      <p className='text-xs text-muted-foreground'>
                        {activity.description}
                      </p>
                      <div className='flex items-center gap-1 mt-1'>
                        <Clock className='h-3 w-3 text-muted-foreground' />
                        <p className='text-xs text-muted-foreground'>
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant='outline'
                size='sm'
                className='w-full'
                asChild
              >
                <Link href='/dashboard/activity'>
                  View all activity
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent
          value='reports'
          className='space-y-4'
        >
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>
                Important notifications requiring your attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='p-4 border rounded-lg bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/50'>
                  <div className='flex items-start gap-4'>
                    <AlertCircle className='h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5' />
                    <div>
                      <p className='text-sm font-medium text-amber-800 dark:text-amber-400'>
                        License Quota Alert
                      </p>
                      <p className='text-xs text-amber-700 dark:text-amber-500'>
                        You have used 89% of your Basic Licenses. Consider
                        requesting additional licenses soon.
                      </p>
                      <Button
                        variant='outline'
                        size='sm'
                        className='mt-2 h-7 text-xs'
                        asChild
                      >
                        <Link href='/dashboard/licenses/request'>
                          Request More
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>

                <div className='p-4 border rounded-lg bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900/50'>
                  <div className='flex items-start gap-4'>
                    <AlertCircle className='h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5' />
                    <div>
                      <p className='text-sm font-medium text-blue-800 dark:text-blue-400'>
                        System Maintenance
                      </p>
                      <p className='text-xs text-blue-700 dark:text-blue-500'>
                        Scheduled maintenance will occur on Sunday, July 15th
                        from 2:00 AM to 4:00 AM UTC. The portal may be
                        unavailable during this time.
                      </p>
                    </div>
                  </div>
                </div>

                <div className='p-4 border rounded-lg'>
                  <div className='flex items-start gap-4'>
                    <AlertCircle className='h-5 w-5 text-muted-foreground mt-0.5' />
                    <div>
                      <p className='text-sm font-medium'>
                        New Feature Available
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        Bulk license activation is now available. You can now
                        activate multiple licenses at once.
                      </p>
                      <Button
                        variant='outline'
                        size='sm'
                        className='mt-2 h-7 text-xs'
                        asChild
                      >
                        <Link href='/dashboard/docs/bulk-activation'>
                          Learn More
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent
          value='notifications'
          className='space-y-4'
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks you can perform</CardDescription>
            </CardHeader>
            <CardContent className='grid gap-4'>
              <Button
                asChild
                className='w-full'
              >
                <Link href='/dashboard/new-order'>
                  <ShoppingCart className='mr-2 h-4 w-4' />
                  Create New Order
                </Link>
              </Button>
              <Button
                asChild
                variant='outline'
                className='w-full'
              >
                <Link href='/dashboard/orders'>
                  <Package className='mr-2 h-4 w-4' />
                  View Recent Orders
                </Link>
              </Button>
              <Button
                asChild
                variant='outline'
                className='w-full'
              >
                <Link href='/dashboard/customers/new'>
                  <Users className='mr-2 h-4 w-4' />
                  Add New Customer
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Renewals</CardTitle>
              <CardDescription>
                Licenses expiring in the next 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {[
                  {
                    customer: 'Acme Corp',
                    product: 'Pro Software',
                    count: 5,
                    days: 7,
                  },
                  {
                    customer: 'TechSolutions Inc',
                    product: 'Enterprise Software',
                    count: 2,
                    days: 14,
                  },
                  {
                    customer: 'Green Energy Ltd',
                    product: 'Basic Software',
                    count: 10,
                    days: 21,
                  },
                ].map((renewal, index) => (
                  <div
                    key={index}
                    className='flex items-start justify-between border-b pb-3 last:border-0 last:pb-0'
                  >
                    <div>
                      <p className='text-sm font-medium'>{renewal.customer}</p>
                      <p className='text-xs text-muted-foreground'>
                        {renewal.count} x {renewal.product}
                      </p>
                    </div>
                    <div className='text-right'>
                      <Badge
                        variant={renewal.days <= 7 ? 'destructive' : 'outline'}
                        className='mb-1'
                      >
                        {renewal.days} days
                      </Badge>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='h-7 text-xs px-2'
                      >
                        Renew
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant='outline'
                size='sm'
                className='w-full'
                asChild
              >
                <Link href='/dashboard/renewals'>
                  View all renewals
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
