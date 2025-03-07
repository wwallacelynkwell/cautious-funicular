'use client'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Download,
  FileText,
  Eye,
  ChevronLeft,
  ChevronRight,
  Search,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { useState } from 'react'
import { toast } from '@/components/ui/use-toast'
import { generateSalesReport } from '@/lib/pdf-generator'
import { getCustomerById, customers as allCustomers } from '@/app/api/database'

interface Order {
  id: string
  date: string
  customer: string
  type: string
  product: string
  status: string
  total: string
  totalValue: number
}

interface DatabaseOrder {
  id: string
  customerId: string
  status: 'pending' | 'processing' | 'success' | 'failed'
  amount: number
  date: string
  items?: string[]
  notes?: string
  visibleToRoles: string[]
}

interface ResellerDrawerProps {
  open: boolean
  onClose: () => void
  reseller: {
    id: string
    name: string
    orders: Order[]
    totalOrders: number
    totalValue: number
    completedOrders: number
    pendingOrders: number
  } | null
  onOrderClick: (order: any) => void
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']
const ITEMS_PER_PAGE = 10

export function ResellerDrawer({
  open,
  onClose,
  reseller,
  onOrderClick,
}: ResellerDrawerProps) {
  const [pdfGenerating, setPdfGenerating] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')

  if (!reseller) return null

  // Filter orders based on search query
  const filteredOrders = reseller.orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.type.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Calculate pagination
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE)
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const ordersByType = reseller.orders.reduce((acc, order) => {
    acc[order.type] = (acc[order.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const pieChartData = Object.entries(ordersByType).map(([name, value]) => ({
    name,
    value,
  }))

  const monthlyData = reseller.orders.reduce((acc, order) => {
    const month = new Date(order.date).toLocaleString('default', {
      month: 'short',
    })
    acc[month] = (acc[month] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const barChartData = Object.entries(monthlyData).map(([name, value]) => ({
    name,
    value,
  }))

  // Generate sales report for the reseller
  const handleGenerateReport = () => {
    setPdfGenerating(true)
    try {
      // Convert monthly data to the format expected by generateSalesReport
      const reportData = Object.entries(monthlyData).map(
        ([month, licenses]) => ({
          month,
          licenses,
          revenue: 0, // We're not including revenue in the reports
        })
      )

      generateSalesReport(
        reportData,
        `${reseller.name} License Report`,
        `License distribution summary for ${reseller.name}`,
        `${reseller.name.toLowerCase().replace(/\s+/g, '-')}-license-report`
      )

      toast({
        title: 'Report Generated',
        description: `License report for ${reseller.name} has been downloaded.`,
      })
    } catch (error) {
      console.error('Error generating license report:', error)

      toast({
        title: 'Report Generation Failed',
        description:
          'There was an error generating the report. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setPdfGenerating(false)
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={onClose}
    >
      <SheetContent
        side='right'
        className='w-full sm:w-[540px] sm:max-w-none'
      >
        <SheetHeader className='flex flex-row items-center justify-between'>
          <SheetTitle>{reseller.name}</SheetTitle>
          <Button
            variant='outline'
            size='sm'
            className='gap-2'
            onClick={handleGenerateReport}
            disabled={pdfGenerating}
          >
            {pdfGenerating ? (
              <>
                <div className='h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
                Generating...
              </>
            ) : (
              <>
                <FileText className='h-4 w-4' />
                Download Report
              </>
            )}
          </Button>
        </SheetHeader>
        <ScrollArea className='h-[calc(100vh-80px)] pr-4'>
          <div className='space-y-6 mt-6'>
            <div className='grid grid-cols-2 gap-4'>
              <Card>
                <CardContent className='p-4'>
                  <div className='text-sm font-medium text-muted-foreground'>
                    Total Orders
                  </div>
                  <div className='text-2xl font-bold'>
                    {reseller.totalOrders}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className='p-4'>
                  <div className='text-sm font-medium text-muted-foreground'>
                    Completed Orders
                  </div>
                  <div className='text-2xl font-bold'>
                    {reseller.completedOrders}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue='charts'>
              <TabsList className='grid w-full grid-cols-2'>
                <TabsTrigger value='charts'>Analytics</TabsTrigger>
                <TabsTrigger value='orders'>Orders</TabsTrigger>
              </TabsList>

              <TabsContent
                value='charts'
                className='space-y-6'
              >
                <Card>
                  <CardContent className='p-6'>
                    <h3 className='text-lg font-medium mb-4'>
                      Monthly Order Distribution
                    </h3>
                    <div className='h-[300px]'>
                      <ResponsiveContainer
                        width='100%'
                        height='100%'
                      >
                        <BarChart data={barChartData}>
                          <CartesianGrid strokeDasharray='3 3' />
                          <XAxis dataKey='name' />
                          <YAxis />
                          <Tooltip formatter={(value) => `${value} orders`} />
                          <Bar
                            dataKey='value'
                            fill='#8884d8'
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className='p-6'>
                    <h3 className='text-lg font-medium mb-4'>Orders by Type</h3>
                    <div className='h-[300px]'>
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
                            outerRadius={100}
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
                          <Tooltip formatter={(value) => `${value} orders`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value='orders'>
                <div className='mb-4'>
                  <div className='relative'>
                    <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                    <Input
                      placeholder='Search orders...'
                      className='pl-10'
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setCurrentPage(1) // Reset to first page on search
                      }}
                    />
                  </div>
                </div>

                <Card>
                  <ScrollArea className='h-[500px]'>
                    <div className='space-y-4 p-4'>
                      {paginatedOrders.length > 0 ? (
                        paginatedOrders.map((order) => (
                          <Card
                            key={order.id}
                            className='hover:bg-muted/50 transition-colors'
                          >
                            <CardContent className='p-4'>
                              <div className='flex justify-between items-start mb-2'>
                                <div>
                                  <h4 className='font-medium'>
                                    {order.customer}
                                  </h4>
                                  <p className='text-sm text-muted-foreground'>
                                    {order.date}
                                  </p>
                                </div>
                                <div className='text-right'>
                                  <div className='font-medium'>{order.id}</div>
                                  <span
                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                      order.status === 'Completed'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                    }`}
                                  >
                                    {order.status}
                                  </span>
                                </div>
                              </div>
                              <div className='text-sm'>
                                <p className='text-muted-foreground'>
                                  {order.type}
                                </p>
                                <p>{order.product}</p>
                              </div>
                              <div className='mt-3 flex justify-end'>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  className='gap-1'
                                  onClick={() => {
                                    // Find the customer ID by name
                                    const customer = allCustomers.find(
                                      (c) => c.name === order.customer
                                    )
                                    const customerId = customer?.id || ''

                                    // Convert the order to match the database structure
                                    const databaseOrder: DatabaseOrder = {
                                      id: order.id,
                                      customerId,
                                      status:
                                        order.status.toLowerCase() ===
                                        'completed'
                                          ? 'success'
                                          : 'pending',
                                      amount: order.totalValue,
                                      date: order.date,
                                      notes: `${order.type} - ${order.product}`,
                                      visibleToRoles: ['admin', 'reseller'],
                                    }
                                    onOrderClick(databaseOrder)
                                  }}
                                >
                                  <Eye className='h-4 w-4' />
                                  View Details
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <div className='text-center py-8 text-muted-foreground'>
                          No orders found. Try adjusting your search.
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </Card>

                {filteredOrders.length > ITEMS_PER_PAGE && (
                  <div className='flex items-center justify-between mt-4'>
                    <div className='text-sm text-muted-foreground'>
                      Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
                      {Math.min(
                        currentPage * ITEMS_PER_PAGE,
                        filteredOrders.length
                      )}{' '}
                      of {filteredOrders.length} orders
                    </div>
                    <div className='flex items-center gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className='h-4 w-4' />
                      </Button>
                      <span className='text-sm'>
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
