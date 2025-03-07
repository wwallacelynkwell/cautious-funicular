'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/auth-provider'
import { Breadcrumbs } from '@/components/orders/breadcrumbs'
import { ResellerCard } from '@/components/orders/reseller-card'
import { ResellerDrawer } from '@/components/orders/reseller-drawer'
import { OrderDetailsDialog } from '@/components/orders/order-details-dialog'
import { Search, Filter, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  orders as allOrders,
  customers as allCustomers,
  getOrdersWithCustomerDetails,
  getCustomerById,
  OrderStatus,
  Order,
  Customer,
} from '@/app/api/database'
import { Badge } from '@/components/ui/badge'

// Define sort and filter types
export type SortField = 'date' | 'amount' | 'customer'
export type SortOrder = 'asc' | 'desc'
export type FilterStatus = OrderStatus | 'all'

export default function OrdersPage() {
  const { user, getUsers, isAdmin } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedReseller, setSelectedReseller] = useState<any>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')

  if (!user) {
    return null
  }

  // Get orders visible to the current user
  const relevantOrders = allOrders.filter((order) => {
    if (isAdmin) {
      return true // Admin can see all orders
    }

    if (user.role === 'reseller') {
      // For resellers, check if the order's customer belongs to this reseller
      const customer = getCustomerById(order.customerId)
      return (
        order.visibleToRoles.includes(user.role) &&
        customer &&
        customer.resellerId === user.id
      )
    }

    // For other roles, just check visibleToRoles
    return order.visibleToRoles.includes(user.role)
  })

  // Filter orders based on search query and status
  const filteredOrders = relevantOrders.filter((order) => {
    const customer = getCustomerById(order.customerId)
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (customer?.name || '').toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      filterStatus === 'all' || order.status === filterStatus

    return matchesSearch && matchesStatus
  })

  // Sort orders based on selected field and order
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const customerA = getCustomerById(a.customerId)
    const customerB = getCustomerById(b.customerId)

    if (sortField === 'date') {
      return sortOrder === 'asc'
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime()
    }

    if (sortField === 'amount') {
      return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount
    }

    if (sortField === 'customer') {
      return sortOrder === 'asc'
        ? (customerA?.name || '').localeCompare(customerB?.name || '')
        : (customerB?.name || '').localeCompare(customerA?.name || '')
    }

    return 0
  })

  // Get resellers for admin view
  const resellers = isAdmin
    ? getUsers()
        .filter((user) => user.role === 'reseller')
        .map((reseller) => {
          // Get all customers for this reseller
          const resellerCustomers = allCustomers.filter(
            (customer) => customer.resellerId === reseller.id
          )

          // Get orders for these customers
          const resellerOrders = allOrders.filter((order) => {
            const customer = getCustomerById(order.customerId)
            return customer && customer.resellerId === reseller.id
          })

          const totalOrders = resellerOrders.length
          const totalValue = resellerOrders.reduce(
            (sum, order) => sum + order.amount,
            0
          )
          const completedOrders = resellerOrders.filter(
            (order) => order.status === 'success'
          ).length
          const pendingOrders = resellerOrders.filter(
            (order) => order.status === 'pending'
          ).length

          // Convert orders to the format expected by the ResellerDrawer
          const formattedOrders = resellerOrders.map((order) => {
            const customer = getCustomerById(order.customerId)
            return {
              id: order.id,
              date: order.date,
              customer: customer?.name || 'Unknown',
              type: order.items?.join(', ') || 'N/A',
              product: order.notes || 'N/A',
              status: order.status === 'success' ? 'Completed' : 'Pending',
              total: `$${order.amount.toFixed(2)}`,
              totalValue: order.amount,
            }
          })

          return {
            id: reseller.id,
            name: reseller.name,
            orders: formattedOrders,
            totalOrders,
            totalValue,
            completedOrders,
            pendingOrders,
          }
        })
    : []

  // Calculate statistics
  const totalOrdersCount = relevantOrders.length
  const totalOrdersValue = relevantOrders.reduce(
    (sum, order) => sum + order.amount,
    0
  )
  const totalCompletedOrders = relevantOrders.filter(
    (order) => order.status === 'success'
  ).length
  const totalPendingOrders = relevantOrders.filter(
    (order) => order.status === 'pending'
  ).length

  return (
    <div className='space-y-6'>
      <Breadcrumbs items={[{ title: 'Orders', href: '/dashboard/orders' }]} />

      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Orders Overview</h1>
        <p className='text-muted-foreground'>
          {isAdmin
            ? 'View and analyze orders by reseller'
            : 'Manage and track your orders'}
        </p>
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
        <Card>
          <CardContent className='p-6'>
            <div className='text-2xl font-bold'>{totalOrdersCount}</div>
            <p className='text-xs text-muted-foreground'>Total Orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-6'>
            <div className='text-2xl font-bold'>
              ${totalOrdersValue.toLocaleString()}
            </div>
            <p className='text-xs text-muted-foreground'>Total Value</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-6'>
            <div className='text-2xl font-bold'>{totalCompletedOrders}</div>
            <p className='text-xs text-muted-foreground'>Completed Orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-6'>
            <div className='text-2xl font-bold'>{totalPendingOrders}</div>
            <p className='text-xs text-muted-foreground'>Pending Orders</p>
          </CardContent>
        </Card>
      </div>

      {isAdmin ? (
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-xl font-semibold tracking-tight'>Resellers</h2>
          </div>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            {resellers.map((reseller) => (
              <ResellerCard
                key={reseller.id}
                reseller={reseller}
                onClick={() => setSelectedReseller(reseller)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className='space-y-4'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <h2 className='text-xl font-semibold tracking-tight'>
              Your Orders
            </h2>
            <div className='flex items-center gap-2'>
              <div className='relative w-full sm:w-64'>
                <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                  type='search'
                  placeholder='Search orders...'
                  className='pl-8'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='outline'
                    size='icon'
                  >
                    <Filter className='h-4 w-4' />
                    <span className='sr-only'>Filter</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align='end'
                  className='w-48'
                >
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className={filterStatus === 'all' ? 'bg-muted' : ''}
                    onClick={() => setFilterStatus('all')}
                  >
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={filterStatus === 'pending' ? 'bg-muted' : ''}
                    onClick={() => setFilterStatus('pending')}
                  >
                    Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={filterStatus === 'processing' ? 'bg-muted' : ''}
                    onClick={() => setFilterStatus('processing')}
                  >
                    Processing
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={filterStatus === 'success' ? 'bg-muted' : ''}
                    onClick={() => setFilterStatus('success')}
                  >
                    Success
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={filterStatus === 'failed' ? 'bg-muted' : ''}
                    onClick={() => setFilterStatus('failed')}
                  >
                    Failed
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <ScrollArea className='h-[calc(100vh-20rem)] rounded-md border'>
            <div className='p-4 space-y-4'>
              {sortedOrders.length > 0 ? (
                sortedOrders.map((order) => (
                  <Card
                    key={order.id}
                    className='cursor-pointer hover:bg-muted/50 transition-colors'
                    onClick={() => setSelectedOrder(order)}
                  >
                    <CardContent className='p-4'>
                      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                        <div>
                          <p className='text-sm font-medium'>{order.id}</p>
                          <p className='text-xs text-muted-foreground'>
                            {new Date(order.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className='text-sm font-medium'>
                            {getCustomerById(order.customerId)?.name}
                          </p>
                        </div>
                        <div>
                          <p className='text-sm font-medium'>{order.amount}</p>
                        </div>
                        <div className='text-right'>
                          <Badge
                            variant={
                              order.status === 'success'
                                ? 'success'
                                : order.status === 'pending'
                                ? 'outline'
                                : order.status === 'processing'
                                ? 'default'
                                : 'destructive'
                            }
                          >
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className='text-center py-8 text-muted-foreground'>
                  No orders found. Try adjusting your filters.
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      )}

      <ResellerDrawer
        open={!!selectedReseller}
        onClose={() => setSelectedReseller(null)}
        reseller={selectedReseller}
        onOrderClick={setSelectedOrder}
      />

      {selectedOrder && (
        <OrderDetailsDialog
          open={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          order={selectedOrder}
        />
      )}
    </div>
  )
}
