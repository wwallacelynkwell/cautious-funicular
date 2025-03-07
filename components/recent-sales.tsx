'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getVisibleOrders, getCustomerById } from '@/app/api/database'
import { useEffect, useState } from 'react'

interface RecentSale {
  id: string
  amount: number
  date: string
  customer: {
    name: string
    email: string
    image: string
  }
}

export function RecentSales() {
  const [recentSales, setRecentSales] = useState<RecentSale[]>([])

  useEffect(() => {
    // Get orders and sort by date
    const orders = getVisibleOrders()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5) // Get only the 5 most recent orders

    // Get customer details for each order
    const salesWithCustomers = orders.map((order) => {
      const customer = getCustomerById(order.customerId)
      return {
        id: order.id,
        amount: order.amount,
        date: order.date,
        customer: {
          name: customer?.name || 'Unknown Customer',
          email: customer?.email || '',
          image: customer?.image || '',
        },
      }
    })

    setRecentSales(salesWithCustomers)
  }, [])

  return (
    <div className='space-y-8'>
      {recentSales.map((sale) => (
        <div
          key={sale.id}
          className='flex items-center'
        >
          <Avatar className='h-9 w-9'>
            <AvatarImage
              src={sale.customer.image}
              alt={sale.customer.name}
            />
            <AvatarFallback>
              {sale.customer.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div className='ml-4 space-y-1'>
            <p className='text-sm font-medium leading-none'>
              {sale.customer.name}
            </p>
            <p className='text-sm text-muted-foreground'>
              {sale.customer.email}
            </p>
          </div>
          <div className='ml-auto font-medium'>+${sale.amount.toFixed(2)}</div>
        </div>
      ))}
    </div>
  )
}
