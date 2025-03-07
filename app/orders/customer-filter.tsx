'use client'

import { useState, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Search, Filter, X, Calendar, AlertCircle } from 'lucide-react'
import { getCustomerOrders, config, getResellerById } from '@/app/api/database'

interface CustomerFilterProps {
  customers: string[]
}

export function CustomerFilter({ customers }: CustomerFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [selectedCustomer, setSelectedCustomer] = useState(
    searchParams.get('customer') || ''
  )

  // Get customer data with order counts, filtered by current user role
  const customerData = useMemo(() => {
    return getCustomerOrders(config.currentUserRole)
  }, [])

  // Create a map of customer names to order counts
  const customerOrderCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    customerData.forEach((customer) => {
      counts[customer.name] = customer.orders
    })
    return counts
  }, [customerData])

  // Get reseller info if applicable
  const resellerInfo = useMemo(() => {
    return config.currentUserRole === 'reseller'
      ? getResellerById(config.currentResellerId)
      : null
  }, [])

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams)
    if (searchTerm) {
      params.set('search', searchTerm)
    } else {
      params.delete('search')
    }
    router.push(`/orders?${params.toString()}`)
  }

  const handleCustomerChange = (value: string) => {
    setSelectedCustomer(value)
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set('customer', value)
    } else {
      params.delete('customer')
    }
    router.push(`/orders?${params.toString()}`)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCustomer('')
    router.push('/orders')
  }

  const hasFilters = searchTerm || selectedCustomer

  // Current date reference for display
  const formattedDate = config.currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Card>
      <CardContent className='p-4'>
        <div className='flex flex-col space-y-4'>
          {/* Date & Role Information */}
          <div className='flex items-center justify-between'>
            <div className='flex items-center text-sm font-medium'>
              <Calendar className='h-4 w-4 mr-1' />
              <span>
                Today: <span className='font-semibold'>{formattedDate}</span>
              </span>
            </div>
            <div className='flex items-center text-sm'>
              <AlertCircle className='h-4 w-4 mr-1 text-amber-500' />
              <span>
                Role:{' '}
                <span className='font-semibold uppercase'>
                  {config.currentUserRole}
                </span>
                {config.currentUserRole === 'reseller' && resellerInfo && (
                  <span className='ml-1 italic'>({resellerInfo.name})</span>
                )}
              </span>
            </div>
          </div>

          {/* Search & Filters */}
          <div className='flex flex-col gap-4 md:flex-row md:items-center'>
            <div className='flex flex-1 items-center space-x-2'>
              <Input
                placeholder='Search by order ID...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='h-9'
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button
                variant='outline'
                size='sm'
                onClick={handleSearch}
              >
                <Search className='h-4 w-4' />
              </Button>
            </div>

            <div className='flex items-center space-x-2'>
              <div className='flex items-center space-x-1'>
                <Filter className='h-4 w-4 text-muted-foreground' />
                <span className='text-sm text-muted-foreground'>
                  Filter by:
                </span>
              </div>
              <Select
                value={selectedCustomer}
                onValueChange={handleCustomerChange}
              >
                <SelectTrigger className='h-9 w-[220px]'>
                  <SelectValue placeholder='Customer' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=''>All Customers</SelectItem>
                  {customers.map((customer) => {
                    const orderCount = customerOrderCounts[customer] || 0
                    return (
                      <SelectItem
                        key={customer}
                        value={customer}
                      >
                        {customer} ({orderCount} orders)
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>

              {hasFilters && (
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={clearFilters}
                >
                  <X className='h-4 w-4 mr-1' />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
