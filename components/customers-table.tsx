'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { MoreHorizontal, Eye, PenLine, Plus } from 'lucide-react'
import { useAuth } from '@/lib/auth-provider'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  customers as allCustomers,
  orders as allOrders,
  Customer,
  Order,
  UserRole,
} from '@/app/api/database'

// Define an extended customer type with the additional properties we need
interface ExtendedCustomer extends Omit<Customer, 'phone' | 'address'> {
  phone: string
  address: string
  totalOrders: number
  totalSpent: number
  lastOrderDate: string
}

export function CustomersTable() {
  const { user, isAdmin } = useAuth()
  const router = useRouter()
  const [selectedCustomer, setSelectedCustomer] =
    useState<ExtendedCustomer | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Prepare customers with additional data
  const customersWithData: ExtendedCustomer[] = allCustomers.map((customer) => {
    // Get customer orders
    const customerOrders = allOrders.filter(
      (order) => order.customerId === customer.id
    )

    // Calculate total spent
    const totalSpent = customerOrders.reduce(
      (sum, order) => sum + order.amount,
      0
    )

    // Get the date of the last order
    const lastOrderDate =
      customerOrders.length > 0
        ? new Date(
            Math.max(...customerOrders.map((o) => new Date(o.date).getTime()))
          )
        : null

    // Return customer with additional properties
    return {
      ...customer,
      totalOrders: customerOrders.length,
      totalSpent: totalSpent,
      lastOrderDate: lastOrderDate
        ? lastOrderDate.toLocaleDateString()
        : 'No orders',
      phone: customer.phone || 'N/A',
      address: customer.address || 'N/A',
    }
  })

  // Filter customers based on user role and search query
  const filteredCustomers = customersWithData
    .filter((customer) => {
      if (isAdmin) {
        return true // Admin can see all customers
      }

      if (user?.role === 'reseller') {
        // For resellers, check if the customer belongs to this reseller
        return (
          customer.visibleToRoles.includes(user.role) &&
          customer.resellerId === user.id
        )
      }

      // For other roles, just check visibleToRoles
      return customer.visibleToRoles.includes(
        (user?.role || 'guest') as UserRole
      )
    })
    .filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (customer.phone && customer.phone.includes(searchQuery))
    )

  const viewCustomerDetails = (customer: ExtendedCustomer) => {
    setSelectedCustomer(customer)
    setIsDialogOpen(true)
  }

  const handleAddCustomer = () => {
    router.push('/dashboard/customers/new')
  }

  const handleEditCustomer = (customerId: string) => {
    router.push(`/dashboard/customers/edit/${customerId}`)
  }

  return (
    <>
      <div className='flex justify-between items-center mb-4'>
        <div className='relative w-full max-w-sm'>
          <Input
            placeholder='Search customers...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-9'
          />
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
            />
          </svg>
        </div>
        <Button onClick={handleAddCustomer}>
          <Plus className='mr-2 h-4 w-4' /> Add Customer
        </Button>
      </div>

      <div className='rounded-md border overflow-x-auto'>
        <Table className='min-w-[800px]'>
          <TableHeader>
            <TableRow>
              <TableHead>Customer ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Last Order</TableHead>
              <TableHead className='w-[80px]'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className='text-center py-8 text-muted-foreground'
                >
                  No customers found
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className='font-medium'>{customer.id}</TableCell>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone || 'N/A'}</TableCell>
                  <TableCell>{customer.totalOrders}</TableCell>
                  <TableCell>{customer.lastOrderDate}</TableCell>
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
                          onClick={() => viewCustomerDetails(customer)}
                        >
                          <Eye className='mr-2 h-4 w-4' />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleEditCustomer(customer.id)}
                        >
                          <PenLine className='mr-2 h-4 w-4' />
                          Edit Customer
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
        <DialogContent className='sm:max-w-lg'>
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>
              Complete information about this customer
            </DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className='space-y-6'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Customer ID
                  </p>
                  <p>{selectedCustomer.id}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Name
                  </p>
                  <p>{selectedCustomer.name}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Email
                  </p>
                  <p>{selectedCustomer.email}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Phone
                  </p>
                  <p>{selectedCustomer.phone}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Address
                  </p>
                  <p>{selectedCustomer.address}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Total Spent
                  </p>
                  <p>${selectedCustomer.totalSpent.toFixed(2)}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Total Orders
                  </p>
                  <p>{selectedCustomer.totalOrders}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Last Order
                  </p>
                  <p>{selectedCustomer.lastOrderDate}</p>
                </div>
              </div>
              <div>
                <p className='text-sm font-medium text-muted-foreground mb-2'>
                  Order History
                </p>
                {selectedCustomer.totalOrders > 0 ? (
                  <div className='rounded-md border overflow-hidden'>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Product</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allOrders
                          .filter((o) => o.customerId === selectedCustomer.id)
                          .map((order: any) => (
                            <TableRow key={order.id}>
                              <TableCell className='font-medium'>
                                {order.id}
                              </TableCell>
                              <TableCell>{order.date}</TableCell>
                              <TableCell>{order.product}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    order.status === 'Completed'
                                      ? 'success'
                                      : 'outline'
                                  }
                                >
                                  {order.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{order.amount}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className='text-sm text-muted-foreground'>
                    No orders found for this customer
                  </p>
                )}
              </div>
              <div className='flex justify-end space-x-2'>
                <Button
                  variant='outline'
                  onClick={() => setIsDialogOpen(false)}
                >
                  Close
                </Button>
                <Button onClick={() => handleEditCustomer(selectedCustomer.id)}>
                  Edit Customer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
