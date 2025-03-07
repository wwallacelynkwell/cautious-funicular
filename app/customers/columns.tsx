'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal, ExternalLink, Clock } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { formatRelativeDate, config } from '@/app/api/database'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Customer = {
  id: string
  name: string
  email: string
  image: string
  lastOrder: string
  orders: number
  totalSpent: number
  createdAt: Date
  visibleToRoles: string[]
  resellerId?: string
}

// Helper function to determine if a customer is recently added
const isRecentCustomer = (date: Date) => {
  const now = config.currentDate
  const diffInDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  )
  return diffInDays <= 7 // Within the last week
}

// Helper function to determine if an order is from today
const isTodayOrder = (orderId: string) => {
  // Check if order is from today (these are the known today's order IDs)
  return (
    orderId.includes('5808') ||
    orderId.includes('5809') ||
    orderId.includes('5810') ||
    orderId.includes('5811') ||
    orderId.includes('5812') ||
    orderId.includes('5813') ||
    orderId.includes('5814') ||
    orderId.includes('5815') ||
    orderId.includes('5800')
  )
}

export const columns: ColumnDef<Customer>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const isRecent = isRecentCustomer(row.original.createdAt)

      return (
        <div className='flex items-center'>
          <Avatar className='h-9 w-9 mr-2'>
            <AvatarImage
              src={row.original.image}
              alt={row.original.name}
            />
            <AvatarFallback>
              {row.original.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className='ml-2'>
            <div className='flex items-center'>
              <span className='font-medium'>{row.original.name}</span>
              {isRecent && (
                <Badge
                  variant='outline'
                  className='ml-2 text-xs bg-green-50 text-green-600 border-green-200'
                >
                  New
                </Badge>
              )}
            </div>
            <div className='text-sm text-muted-foreground'>
              {row.original.email}
            </div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'orders',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Orders
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      const orderCount = row.original.orders

      return (
        <div className='flex items-center justify-center'>
          <Link
            href={`/orders?customer=${encodeURIComponent(row.original.name)}`}
          >
            <Badge
              variant='secondary'
              className='cursor-pointer hover:bg-secondary/80'
            >
              {orderCount} {orderCount === 1 ? 'order' : 'orders'}
            </Badge>
          </Link>
        </div>
      )
    },
  },
  {
    accessorKey: 'totalSpent',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Total Spent
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('totalSpent'))
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount)

      return <div className='text-right font-medium'>{formatted}</div>
    },
  },
  {
    accessorKey: 'lastOrder',
    header: 'Last Order',
    cell: ({ row }) => {
      const orderId = row.original.lastOrder

      if (!orderId) {
        return <div className='text-muted-foreground'>No orders yet</div>
      }

      // Check if order is from today
      const isToday = isTodayOrder(orderId)

      return (
        <Link
          href={`/orders?search=${orderId}`}
          className='flex w-[120px] items-center text-blue-600 hover:underline'
        >
          {isToday && <Clock className='h-3 w-3 mr-1' />}
          {orderId}
        </Link>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => {
      const date = row.original.createdAt
      const formattedDate = formatRelativeDate(date)
      const fullDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })

      const isRecent = isRecentCustomer(date)

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={`flex w-[120px] items-center cursor-help ${
                  isRecent ? 'text-green-600 font-medium' : ''
                }`}
              >
                {formattedDate}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{fullDate}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const customer = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              className='h-8 w-8 p-0'
            >
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(customer.id)}
            >
              Copy customer ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/customers/${customer.id}`}>
                <div className='flex items-center'>
                  View customer details
                  <ExternalLink className='ml-2 h-4 w-4' />
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`/orders?customer=${encodeURIComponent(customer.name)}`}
              >
                <div className='flex items-center'>
                  View all orders
                  <ExternalLink className='ml-2 h-4 w-4' />
                </div>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
