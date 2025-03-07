import { Metadata } from 'next'
import Image from 'next/image'
import { z } from 'zod'

import { columns } from './columns'
import { DataTable } from './data-table'
import { UserNav } from './user-nav'
import {
  getOrdersWithCustomerDetails,
  getVisibleCustomers,
  config,
  getResellerById,
  getTodayOrders,
} from '@/app/api/database'
import { CustomerFilter } from './customer-filter'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'Orders',
  description: 'Example orders page.',
}

// Define a schema for the order data
const orderSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  customer: z.string(),
  status: z.enum(['pending', 'processing', 'success', 'failed']),
  email: z.string(),
  amount: z.number(),
  date: z.date(),
  customerImage: z.string().optional(),
  notes: z.string().optional(),
  visibleToRoles: z.array(z.string()),
})

// Define the Order type from the schema
type Order = z.infer<typeof orderSchema>

export default function OrdersPage() {
  // Get orders with customer details, filtered by current user role
  const orderData = getOrdersWithCustomerDetails(config.currentUserRole)

  // Validate and transform the data
  const validatedOrders = orderData.map((order) => ({
    ...order,
    date: new Date(order.date),
  }))

  // Get unique customer names for the filter, filtered by current user role
  const visibleCustomers = getVisibleCustomers(config.currentUserRole)
  const uniqueCustomers = [
    ...new Set(visibleCustomers.map((customer) => customer.name)),
  ]

  // Get reseller information if in reseller role
  const resellerInfo =
    config.currentUserRole === 'reseller'
      ? getResellerById(config.currentResellerId)
      : null

  // Count today's orders
  const todayOrders = getTodayOrders(config.currentUserRole)

  return (
    <>
      <div className='md:hidden'>
        <Image
          src='/examples/orders-light.png'
          width={1280}
          height={998}
          alt='Orders'
          className='block dark:hidden'
        />
        <Image
          src='/examples/orders-dark.png'
          width={1280}
          height={998}
          alt='Orders'
          className='hidden dark:block'
        />
      </div>
      <div className='hidden h-full flex-1 flex-col space-y-8 p-8 md:flex'>
        <div className='flex items-center justify-between'>
          <div>
            <div className='flex items-center gap-2'>
              <h2 className='text-2xl font-bold tracking-tight'>Orders</h2>
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
                  ? 'Manage and view your customer orders'
                  : 'Manage and view all customer orders'}
              </p>

              {todayOrders.length > 0 && (
                <Badge
                  variant='default'
                  className='bg-blue-600'
                >
                  {todayOrders.length} new{' '}
                  {todayOrders.length === 1 ? 'order' : 'orders'} today
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

        <div className='space-y-4'>
          <CustomerFilter customers={uniqueCustomers} />
          <DataTable
            data={validatedOrders}
            columns={columns}
          />
        </div>
      </div>
    </>
  )
}
