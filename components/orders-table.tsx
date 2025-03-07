'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { MoreHorizontal, Eye } from 'lucide-react'
import { useAuth } from '@/lib/auth-provider'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  orders as allOrders,
  customers as allCustomers,
  getCustomerById,
  UserRole,
} from '@/app/api/database'

export function OrdersTable() {
  const { user, isAdmin } = useAuth()
  const [selectedOrder, setSelectedOrder] = useState<
    (typeof allOrders)[0] | null
  >(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Filter orders based on user role
  const filteredOrders = allOrders.filter((order) => {
    if (isAdmin) {
      return true // Admin can see all orders
    }

    // For resellers, check if the order's customer belongs to them
    if (user?.role === 'reseller') {
      const customer = getCustomerById(order.customerId)
      return (
        order.visibleToRoles.includes(user.role) &&
        customer &&
        customer.resellerId === user.id
      )
    }

    // For other roles, just check visibleToRoles
    return order.visibleToRoles.includes((user?.role || 'guest') as UserRole)
  })

  const viewOrderDetails = (order: (typeof allOrders)[0]) => {
    setSelectedOrder(order)
    setIsDialogOpen(true)
  }

  return (
    <>
      <div className='rounded-md border overflow-x-auto'>
        <Table className='min-w-[800px]'>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Item Count</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className='w-[80px]'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className='text-center py-8 text-muted-foreground'
                >
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className='font-medium'>{order.id}</TableCell>
                  <TableCell>
                    {new Date(order.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {getCustomerById(order.customerId)?.name || 'Unknown'}
                  </TableCell>
                  <TableCell>{order.items?.join(', ') || 'N/A'}</TableCell>
                  <TableCell>{order.notes || 'N/A'}</TableCell>
                  <TableCell>{order.items?.length || 0}</TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>${order.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant='ghost'
                          size='icon'
                        >
                          <MoreHorizontal className='h-4 w-4' />
                          <span className='sr-only'>Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem
                          onClick={() => viewOrderDetails(order)}
                        >
                          <Eye className='mr-2 h-4 w-4' />
                          View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      >
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Complete information about this order
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Order ID
                  </p>
                  <p>{selectedOrder.id}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Date
                  </p>
                  <p>{new Date(selectedOrder.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Customer
                  </p>
                  <div className='flex flex-col space-y-1'>
                    <div className='flex items-center space-x-2'>
                      <span className='font-medium'>
                        {getCustomerById(selectedOrder.customerId)?.name}
                      </span>
                      <Badge variant='outline'>
                        {getCustomerById(selectedOrder.customerId)?.id}
                      </Badge>
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      {getCustomerById(selectedOrder.customerId)?.email}
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      {getCustomerById(selectedOrder.customerId)?.phone}
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      {getCustomerById(selectedOrder.customerId)?.address}
                    </div>
                  </div>
                </div>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Status
                  </p>
                  <Badge
                    variant={
                      selectedOrder.status === 'success'
                        ? 'success'
                        : selectedOrder.status === 'pending'
                        ? 'outline'
                        : selectedOrder.status === 'processing'
                        ? 'default'
                        : 'destructive'
                    }
                  >
                    {selectedOrder.status.charAt(0).toUpperCase() +
                      selectedOrder.status.slice(1)}
                  </Badge>
                </div>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Items
                  </p>
                  <p>{selectedOrder.items?.join(', ') || 'N/A'}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Notes
                  </p>
                  <p>{selectedOrder.notes || 'N/A'}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Item Count
                  </p>
                  <p>{selectedOrder.items?.length || 0}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Amount
                  </p>
                  <p>${selectedOrder.amount.toFixed(2)}</p>
                </div>
              </div>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Customer Information
                </p>
                {(() => {
                  const customer = getCustomerById(selectedOrder.customerId)
                  return customer ? (
                    <>
                      <p>Email: {customer.email}</p>
                      <p>
                        Created:{' '}
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </p>
                    </>
                  ) : (
                    <p>Customer information not available</p>
                  )
                })()}
              </div>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  License Keys
                </p>
                <p className='text-xs font-mono'>
                  SW-A1B2C3D4-12345 (Station 1)
                </p>
                <p className='text-xs font-mono'>
                  WR-E5F6G7H8-12345 (Station 1)
                </p>
                {selectedOrder.stations && selectedOrder.stations > 1 && (
                  <span className='ml-1 text-xs text-muted-foreground'>
                    + {selectedOrder.stations - 1} more stations
                  </span>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
