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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/lib/auth-provider'
import {
  orders,
  customers as allCustomers,
  getCustomerById,
} from '@/app/api/database'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

// Colors for the charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

export function ResellerOrdersBreakdown() {
  const { getUsers } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')

  // Get all resellers
  const resellers = getUsers().filter((user) => user.role === 'reseller')

  // Group orders by reseller
  const ordersByReseller = resellers.map((reseller) => {
    // Get all customers for this reseller
    const resellerCustomers = allCustomers.filter(
      (customer) => customer.resellerId === reseller.id
    )

    // Get orders for these customers
    const resellerOrders = orders.filter((order) => {
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

    return {
      id: reseller.id,
      name: reseller.name,
      orders: resellerOrders,
      totalOrders,
      totalValue,
      completedOrders,
      pendingOrders,
    }
  })

  // Prepare data for the charts
  const barChartData = ordersByReseller.map((reseller) => ({
    name: reseller.name,
    Orders: reseller.totalOrders,
    Value: Math.round(reseller.totalValue / 100), // Scaled down for better visualization
  }))

  const pieChartData = ordersByReseller.map((reseller) => ({
    name: reseller.name,
    value: reseller.totalValue,
  }))

  // Calculate overall statistics
  const totalOrdersCount = orders.length
  const totalOrdersValue = orders.reduce(
    (sum, order) => sum + (order.totalValue || order.amount),
    0
  )
  const totalCompletedOrders = orders.filter(
    (order) => order.status === 'success'
  ).length
  const totalPendingOrders = orders.filter(
    (order) => order.status === 'pending'
  ).length

  return (
    <div className='space-y-6'>
      {/* Overall Statistics */}
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

      {/* Tabs for different views */}
      <Tabs
        defaultValue='overview'
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='charts'>Charts</TabsTrigger>
          <TabsTrigger value='details'>Detailed Breakdown</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent
          value='overview'
          className='space-y-4'
        >
          <div className='rounded-md border overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reseller</TableHead>
                  <TableHead>Total Orders</TableHead>
                  <TableHead>Completed</TableHead>
                  <TableHead>Pending</TableHead>
                  <TableHead className='text-right'>Total Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ordersByReseller.map((reseller) => (
                  <TableRow key={reseller.id}>
                    <TableCell className='font-medium'>
                      {reseller.name}
                    </TableCell>
                    <TableCell>{reseller.totalOrders}</TableCell>
                    <TableCell>{reseller.completedOrders}</TableCell>
                    <TableCell>{reseller.pendingOrders}</TableCell>
                    <TableCell className='text-right'>
                      ${reseller.totalValue.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Charts Tab */}
        <TabsContent
          value='charts'
          className='space-y-6'
        >
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <Card>
              <CardContent className='p-6'>
                <h3 className='mb-4 text-lg font-medium'>Orders by Reseller</h3>
                <div className='h-80'>
                  <ResponsiveContainer
                    width='100%'
                    height='100%'
                  >
                    <BarChart data={barChartData}>
                      <CartesianGrid strokeDasharray='3 3' />
                      <XAxis dataKey='name' />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey='Orders'
                        fill='#8884d8'
                      />
                      <Bar
                        dataKey='Value'
                        fill='#82ca9d'
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-6'>
                <h3 className='mb-4 text-lg font-medium'>
                  Revenue Distribution
                </h3>
                <div className='h-80'>
                  <ResponsiveContainer
                    width='100%'
                    height='100%'
                  >
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx='50%'
                        cy='50%'
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill='#8884d8'
                        dataKey='value'
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => `$${value.toLocaleString()}`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Detailed Breakdown Tab */}
        <TabsContent
          value='details'
          className='space-y-6'
        >
          {ordersByReseller.map((reseller) => (
            <Card
              key={reseller.id}
              className='overflow-hidden'
            >
              <CardHeader className='bg-muted'>
                <CardTitle>{reseller.name}</CardTitle>
                <CardDescription>
                  {reseller.totalOrders} orders | $
                  {reseller.totalValue.toLocaleString()} total value
                </CardDescription>
              </CardHeader>
              <CardContent className='p-0'>
                <div className='rounded-md overflow-x-auto'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className='text-right'>Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reseller.orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className='font-medium'>
                            {order.id}
                          </TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell>
                            {getCustomerById(order.customerId)?.name ||
                              'Unknown'}
                          </TableCell>
                          <TableCell>{order.items.join(', ')}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                order.status === 'success'
                                  ? 'bg-green-100 text-green-800'
                                  : order.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : order.status === 'processing'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {order.status}
                            </span>
                          </TableCell>
                          <TableCell className='text-right'>
                            ${(order.totalValue || order.amount).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
