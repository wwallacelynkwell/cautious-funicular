'use client'

import Image from 'next/image'
import { z } from 'zod'

import { columns } from './columns'
import { DataTable } from './data-table'
import { UserNav } from './user-nav'
import {
  getCustomerOrders,
  config,
  getResellerById,
  formatRelativeDate,
} from '@/app/api/database'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar } from 'lucide-react'

// Define a schema for the customer data
const customerSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  image: z.string(),
  lastOrder: z.string(),
  orders: z.number(),
  totalSpent: z.number(),
  createdAt: z.date(),
  visibleToRoles: z.array(z.string()),
  resellerId: z.string().optional(),
})

// Define the Customer type from the schema
type Customer = z.infer<typeof customerSchema>

export function CustomersContent() {
  // Get customer data with order information, filtered by current user role
  const customerData = getCustomerOrders(config.currentUserRole)

  // Get reseller information if in reseller role
  const resellerInfo =
    config.currentUserRole === 'reseller'
      ? getResellerById(config.currentResellerId)
      : null

  // Calculate recent customers (last 7 days)
  const lastWeek = new Date(config.currentDate)
  lastWeek.setDate(lastWeek.getDate() - 7)

  // Validate and transform the data
  const validatedCustomers = customerData.map((customer) => ({
    ...customer,
    createdAt: new Date(customer.createdAt),
  }))

  // Count recent customers
  const recentCustomers = validatedCustomers.filter(
    (customer) => customer.createdAt > lastWeek
  )

  // Current date for display
  const formattedDate = config.currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <>
      <div className='md:hidden'>
        <Image
          src='/examples/customers-light.png'
          width={1280}
          height={998}
          alt='Customers'
          className='block dark:hidden'
        />
        <Image
          src='/examples/customers-dark.png'
          width={1280}
          height={998}
          alt='Customers'
          className='hidden dark:block'
        />
      </div>
      <div className='hidden h-full flex-1 flex-col space-y-8 p-8 md:flex'>
        <div className='flex items-center justify-between'>
          <div>
            <div className='flex items-center gap-2'>
              <h2 className='text-2xl font-bold tracking-tight'>Customers</h2>
              {config.currentUserRole === 'reseller' && resellerInfo && (
                <Badge
                  variant='outline'
                  className='h-6 px-2 font-normal'
                >
                  {resellerInfo.name}
                </Badge>
              )}
            </div>
            <div className='flex items-center gap-3 mt-1'>
              <p className='text-muted-foreground'>
                {config.currentUserRole === 'reseller'
                  ? 'Manage your assigned customers'
                  : "Here's a list of all customers!"}
              </p>

              {recentCustomers.length > 0 && (
                <Badge
                  variant='default'
                  className='bg-green-600'
                >
                  {recentCustomers.length} new{' '}
                  {recentCustomers.length === 1 ? 'customer' : 'customers'} this
                  week
                </Badge>
              )}
            </div>
          </div>
          <div className='flex items-center justify-between'>
            <div className='mr-4 bg-muted px-3 py-1 rounded-md text-sm uppercase'>
              {config.currentUserRole}
            </div>
            <UserNav />
          </div>
        </div>

        <Card className='mb-4'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center text-sm font-medium'>
                <Calendar className='h-4 w-4 mr-1' />
                <span>
                  Today: <span className='font-semibold'>{formattedDate}</span>
                </span>
              </div>
              <div className='text-sm text-muted-foreground'>
                <span className='font-medium'>{validatedCustomers.length}</span>{' '}
                customers visible to you
              </div>
            </div>
          </CardContent>
        </Card>

        <DataTable
          data={validatedCustomers}
          columns={columns}
        />
      </div>
    </>
  )
}
