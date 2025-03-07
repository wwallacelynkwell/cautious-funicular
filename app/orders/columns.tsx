'use client'

import { ColumnDef } from '@tanstack/react-table'
import {
  ArrowUpDown,
  MoreHorizontal,
  ExternalLink,
  FileText,
  Clock,
} from 'lucide-react'
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
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { formatRelativeDate, config } from '@/app/api/database'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Order = {
  id: string
  customerId: string
  customer: string
  status: 'pending' | 'processing' | 'success' | 'failed'
  email: string
  amount: number
  date: Date
  customerImage?: string
  notes?: string
  visibleToRoles: string[]
}

// Helper function to determine if an order is from today
const isToday = (date: Date) => {
  const today = config.currentDate
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

export const columns: ColumnDef<Order>[] = [
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
    accessorKey: 'id',
    header: 'Order ID',
    cell: ({ row }) => {
      const orderDate = row.original.date
      const isNewOrder = isToday(orderDate)

      return (
        <div className='flex items-center'>
          <div className='font-medium'>{row.getValue('id')}</div>
          {isNewOrder && (
            <Badge
              variant='outline'
              className='ml-2 bg-blue-50 text-blue-600 border-blue-200'
            >
              <Clock className='h-3 w-3 mr-1' />
              New
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'customer',
    header: 'Customer',
    cell: ({ row }) => {
      const customerName = row.getValue('customer') as string
      const customerEmail = row.getValue('email') as string
      const customerImage =
        row.original.customerImage ||
        `https://avatar.vercel.sh/${customerName}.png`

      return (
        <div className='flex items-center'>
          <Avatar className='h-9 w-9 mr-2'>
            <AvatarImage
              src={customerImage}
              alt={customerName}
            />
            <AvatarFallback>
              {customerName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className='ml-2'>
            <div className='font-medium'>{customerName}</div>
            <div className='text-sm text-muted-foreground'>{customerEmail}</div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string

      return (
        <div className='flex w-[100px] items-center'>
          <Badge
            variant={
              status === 'success'
                ? 'success'
                : status === 'pending'
                ? 'outline'
                : status === 'processing'
                ? 'secondary'
                : 'destructive'
            }
          >
            {status}
          </Badge>
        </div>
      )
    },
  },
  {
    accessorKey: 'amount',
    header: () => <div className='text-right'>Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'))
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount)

      return <div className='text-right font-medium'>{formatted}</div>
    },
  },
  {
    accessorKey: 'date',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = row.getValue('date') as Date
      const formattedDate = formatRelativeDate(date)
      const fullDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })

      // Determine if this is a very recent order (today)
      const isRecentOrder = isToday(date)

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={`flex w-[130px] items-center cursor-help ${
                  isRecentOrder ? 'text-blue-600 font-medium' : ''
                }`}
              >
                {isRecentOrder && <Clock className='h-3 w-3 mr-1' />}
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
    accessorKey: 'notes',
    header: 'Notes',
    cell: ({ row }) => {
      const notes = row.original.notes

      if (!notes) return null

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className='flex items-center cursor-help'>
                <FileText className='h-4 w-4 text-muted-foreground' />
                <span className='ml-1 text-sm text-muted-foreground'>Note</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{notes}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => <div>{row.getValue('email')}</div>,
    enableHiding: true,
    enableSorting: true,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const order = row.original

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
              onClick={() => navigator.clipboard.writeText(order.id)}
            >
              Copy order ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/orders/${order.id}`}>
                <div className='flex items-center'>
                  View order details
                  <ExternalLink className='ml-2 h-4 w-4' />
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/customers/${order.customerId}`}>
                <div className='flex items-center'>
                  View customer profile
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
