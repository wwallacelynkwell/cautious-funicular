'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  BarChart3,
  Download,
  FileText,
  Filter,
  PieChart,
  TrendingUp,
} from 'lucide-react'
import {
  generateSalesReport,
  generateProductReport,
  generateCustomerReport,
} from '@/lib/pdf-generator'
import { toast } from '@/components/ui/use-toast'
import {
  getVisibleOrders,
  getCustomerOrders,
  getOrdersWithCustomerDetails,
  softwarePackages,
  bundles,
  warrantyPackages,
  Order,
} from '@/app/api/database'
import { Chart } from '@/components/ui/chart'

// Define types for our data
interface SalesDataItem {
  month: string
  licenses: number
  revenue: number
}

interface ProductDataItem {
  product: string
  licenses: number
  percentage: number
}

interface CustomerDataItem {
  customer: string
  licenses: number
  revenue: number
}

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState('30days')
  const [salesData, setSalesData] = useState<SalesDataItem[]>([])
  const [productData, setProductData] = useState<ProductDataItem[]>([])
  const [customerData, setCustomerData] = useState<CustomerDataItem[]>([])
  const [totalLicenses, setTotalLicenses] = useState(0)
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [averageOrderValue, setAverageOrderValue] = useState(0)

  useEffect(() => {
    // Get all orders
    const orders = getVisibleOrders()

    // Calculate total licenses, revenue, and average order value
    const totalItems = orders.reduce(
      (sum, order) => sum + order.items.length,
      0
    )
    const totalRev = orders.reduce((sum, order) => sum + order.amount, 0)
    const avgOrderValue = orders.length > 0 ? totalRev / orders.length : 0

    setTotalLicenses(totalItems)
    setTotalRevenue(totalRev)
    setAverageOrderValue(avgOrderValue)

    // Process orders for sales data (by month)
    const monthlyData = processMonthlyData(orders)
    setSalesData(monthlyData)

    // Process product data
    const productStats = processProductData(orders)
    setProductData(productStats)

    // Process customer data
    const customerStats = processCustomerData()
    setCustomerData(customerStats)
  }, [timeRange])

  // Process orders by month
  const processMonthlyData = (orders: Order[]): SalesDataItem[] => {
    // Define all months
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]

    // Get the current date from the database config
    const currentDate = new Date('2025-03-06T12:00:00.000Z') // Hardcoded to match database config
    const currentMonth = currentDate.getMonth()

    // Determine the date range and number of months to display based on the selected time range
    let startDate = new Date(currentDate)
    let monthsToShow = 6 // Default

    if (timeRange === '7days') {
      startDate.setDate(currentDate.getDate() - 7)
      monthsToShow = 3 // Show 3 months for 7 days view
    } else if (timeRange === '30days') {
      startDate.setDate(currentDate.getDate() - 30)
      monthsToShow = 6 // Show 6 months for 30 days view
    } else if (timeRange === '90days') {
      startDate.setDate(currentDate.getDate() - 90)
      monthsToShow = 6 // Show 6 months for 90 days view
    } else if (timeRange === 'year') {
      startDate.setFullYear(currentDate.getFullYear() - 1)
      monthsToShow = 12 // Show all 12 months for year view
    }

    // Calculate the start month index
    const startMonthIndex = (currentMonth - monthsToShow + 1 + 12) % 12

    // Filter orders within the selected date range
    const filteredOrders = orders.filter((order) => {
      const orderDate = new Date(order.date)
      return orderDate >= startDate && orderDate <= currentDate
    })

    // Create a map to store data for each month in the selected range
    const monthlyData: Record<string, SalesDataItem> = {}

    // Initialize only the months we want to display with zeros
    for (let i = 0; i < monthsToShow; i++) {
      const monthIndex = (startMonthIndex + i) % 12
      monthlyData[months[monthIndex]] = {
        month: months[monthIndex],
        licenses: 0,
        revenue: 0,
      }
    }

    // Process the filtered orders
    filteredOrders.forEach((order) => {
      const orderDate = new Date(order.date)
      const monthName = months[orderDate.getMonth()]

      // Only add data if this month is in our display range
      if (monthlyData[monthName]) {
        // Count each item in the order as a license
        const licenseCount = order.items ? order.items.length : 1

        monthlyData[monthName].licenses += licenseCount
        monthlyData[monthName].revenue += order.amount
      }
    })

    // Convert to array and sort chronologically
    const result = []
    for (let i = 0; i < monthsToShow; i++) {
      const monthIndex = (startMonthIndex + i) % 12
      result.push(monthlyData[months[monthIndex]])
    }

    return result
  }

  // Process product data
  const processProductData = (orders: Order[]): ProductDataItem[] => {
    // Count items by type
    const itemCounts: Record<string, number> = {}
    let totalItems = 0

    orders.forEach((order) => {
      order.items.forEach((itemId: string) => {
        if (!itemCounts[itemId]) {
          itemCounts[itemId] = 0
        }
        itemCounts[itemId]++
        totalItems++
      })
    })

    // Group by product type
    const productGroups = {
      'Basic Software': { licenses: 0, percentage: 0 },
      'Pro Software': { licenses: 0, percentage: 0 },
      'Enterprise Software': { licenses: 0, percentage: 0 },
    } as Record<string, { licenses: number; percentage: number }>

    // Map item IDs to product types
    Object.keys(itemCounts).forEach((itemId) => {
      if (itemId === 'sw1') {
        productGroups['Basic Software'].licenses += itemCounts[itemId]
      } else if (itemId === 'sw2') {
        productGroups['Pro Software'].licenses += itemCounts[itemId]
      } else if (itemId === 'sw3') {
        productGroups['Enterprise Software'].licenses += itemCounts[itemId]
      }
    })

    // Calculate percentages
    Object.keys(productGroups).forEach((product) => {
      productGroups[product].percentage =
        Math.round((productGroups[product].licenses / totalItems) * 100) || 0
    })

    // Convert to array format
    return Object.keys(productGroups).map((product) => ({
      product,
      licenses: productGroups[product].licenses,
      percentage: productGroups[product].percentage,
    }))
  }

  // Process customer data
  const processCustomerData = (): CustomerDataItem[] => {
    const customerOrders = getCustomerOrders()

    // Sort by total spent and take top 5
    return customerOrders
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5)
      .map((customer) => ({
        customer: customer.name,
        licenses: customer.orders,
        revenue: customer.totalSpent,
      }))
  }

  // Handle downloading reports
  const handleDownloadSalesReport = () => {
    try {
      generateSalesReport(
        salesData,
        'Monthly Sales Report',
        `Sales performance for the last ${
          timeRange === '30days'
            ? '30 days'
            : timeRange === '90days'
            ? '90 days'
            : timeRange === 'year'
            ? '12 months'
            : '7 days'
        }`,
        `sales-report-${timeRange}`
      )

      toast({
        title: 'Report Downloaded',
        description: 'Your sales report has been downloaded successfully.',
      })
    } catch (error) {
      console.error('Error generating sales report:', error)
      toast({
        title: 'Download Failed',
        description:
          'There was an error generating your report. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleDownloadProductReport = () => {
    try {
      generateProductReport(
        productData,
        'Product Distribution Report',
        'License distribution by product type',
        'product-report'
      )

      toast({
        title: 'Report Downloaded',
        description: 'Your product report has been downloaded successfully.',
      })
    } catch (error) {
      console.error('Error generating product report:', error)
      toast({
        title: 'Download Failed',
        description:
          'There was an error generating your report. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleDownloadCustomerReport = () => {
    try {
      generateCustomerReport(
        customerData,
        'Customer Performance Report',
        'Top customers by revenue and license volume',
        'customer-report'
      )

      toast({
        title: 'Report Downloaded',
        description: 'Your customer report has been downloaded successfully.',
      })
    } catch (error) {
      console.error('Error generating customer report:', error)
      toast({
        title: 'Download Failed',
        description:
          'There was an error generating your report. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Reports</h1>
          <p className='text-muted-foreground'>
            Analyze your sales and license data
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Select
            value={timeRange}
            onValueChange={setTimeRange}
          >
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Select time range' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='7days'>Last 7 days</SelectItem>
              <SelectItem value='30days'>Last 30 days</SelectItem>
              <SelectItem value='90days'>Last 90 days</SelectItem>
              <SelectItem value='year'>Last 12 months</SelectItem>
              <SelectItem value='custom'>Custom range</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant='outline'
            size='icon'
          >
            <Filter className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            onClick={handleDownloadSalesReport}
          >
            <Download className='mr-2 h-4 w-4' />
            Export
          </Button>
        </div>
      </div>

      <Tabs
        defaultValue='overview'
        className='space-y-6'
      >
        <TabsList>
          <TabsTrigger value='overview'>
            <BarChart3 className='h-4 w-4 mr-2' />
            Overview
          </TabsTrigger>
          <TabsTrigger value='sales'>
            <TrendingUp className='h-4 w-4 mr-2' />
            Sales
          </TabsTrigger>
          <TabsTrigger value='products'>
            <PieChart className='h-4 w-4 mr-2' />
            Products
          </TabsTrigger>
          <TabsTrigger value='customers'>
            <FileText className='h-4 w-4 mr-2' />
            Customers
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value='overview'
          className='space-y-6'
        >
          <div className='grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4'>
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Total Licenses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{totalLicenses}</div>
                <p className='text-xs text-muted-foreground'>
                  +15% from previous period
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  ${totalRevenue.toFixed(2)}
                </div>
                <p className='text-xs text-muted-foreground'>
                  +12% from previous period
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Average Order Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  ${averageOrderValue.toFixed(2)}
                </div>
                <p className='text-xs text-muted-foreground'>
                  +5% from previous period
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Active Customers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{customerData.length}</div>
                <p className='text-xs text-muted-foreground'>
                  +8% from previous period
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Performance</CardTitle>
              <CardDescription>
                License sales and revenue over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='h-[300px]'>
                <Chart
                  data={salesData.map((item) => ({
                    name: item.month,
                    licenses: item.licenses,
                  }))}
                  categories={['licenses']}
                  colors={['hsl(var(--primary))']}
                  valueFormatter={(value) =>
                    Number.isInteger(value)
                      ? value.toString()
                      : value.toFixed(0)
                  }
                  showLegend={true}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant='outline'
                size='sm'
                onClick={handleDownloadSalesReport}
              >
                <Download className='mr-2 h-4 w-4' />
                Download Report
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent
          value='sales'
          className='space-y-6'
        >
          <Card>
            <CardHeader>
              <CardTitle>Sales Performance</CardTitle>
              <CardDescription>
                Detailed sales metrics over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-8'>
                <div className='grid gap-4 grid-cols-1 md:grid-cols-3'>
                  <div className='space-y-2'>
                    <h3 className='text-sm font-medium'>Total Orders</h3>
                    <div className='text-2xl font-bold'>127</div>
                    <p className='text-xs text-muted-foreground'>
                      +15% from previous period
                    </p>
                  </div>
                  <div className='space-y-2'>
                    <h3 className='text-sm font-medium'>Revenue</h3>
                    <div className='text-2xl font-bold'>$120,000</div>
                    <p className='text-xs text-muted-foreground'>
                      +12% from previous period
                    </p>
                  </div>
                  <div className='space-y-2'>
                    <h3 className='text-sm font-medium'>Average Order Value</h3>
                    <div className='text-2xl font-bold'>$3,500</div>
                    <p className='text-xs text-muted-foreground'>
                      +5% from previous period
                    </p>
                  </div>
                </div>

                <div className='border-t pt-6'>
                  <h3 className='text-sm font-medium mb-4'>
                    Monthly Sales Breakdown
                  </h3>
                  <div className='space-y-4'>
                    {salesData.map((month, i) => (
                      <div
                        key={i}
                        className='flex items-center justify-between'
                      >
                        <div className='w-24'>{month.month}</div>
                        <div className='flex-1 mx-4'>
                          <div className='h-2 bg-muted rounded-full overflow-hidden'>
                            <div
                              className='h-full bg-primary'
                              style={{
                                width: `${
                                  (month.revenue / totalRevenue) * 100
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className='text-right'>
                          <div className='font-medium'>${month.revenue}</div>
                          <div className='text-xs text-muted-foreground'>
                            {month.licenses} licenses
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant='outline'
                size='sm'
                onClick={handleDownloadSalesReport}
              >
                <Download className='mr-2 h-4 w-4' />
                Download Sales Report
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent
          value='products'
          className='space-y-6'
        >
          <Card>
            <CardHeader>
              <CardTitle>Product Performance</CardTitle>
              <CardDescription>
                License distribution by product type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid gap-6 grid-cols-1 md:grid-cols-2'>
                <div>
                  <div className='aspect-square flex items-center justify-center'>
                    <div className='relative w-40 h-40 rounded-full overflow-hidden'>
                      {productData.map((product, i) => {
                        const rotation =
                          i === 0
                            ? 0
                            : productData
                                .slice(0, i)
                                .reduce((acc, curr) => acc + curr.percentage, 0)
                        return (
                          <div
                            key={i}
                            className='absolute inset-0'
                            style={{
                              clipPath: `conic-gradient(from 0deg, transparent ${rotation}%, transparent ${rotation}%, currentColor ${
                                rotation + product.percentage
                              }%, transparent ${
                                rotation + product.percentage
                              }%)`,
                              color:
                                i === 0
                                  ? 'hsl(217, 91%, 60%)'
                                  : i === 1
                                  ? 'hsl(262, 83%, 58%)'
                                  : 'hsl(48, 96%, 53%)',
                            }}
                          ></div>
                        )
                      })}
                      <div className='absolute inset-4 bg-background rounded-full flex items-center justify-center'>
                        <div className='text-center'>
                          <div className='text-sm font-medium'>Total</div>
                          <div className='text-xl font-bold'>
                            {totalLicenses}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='space-y-4'>
                  {productData.map((product, i) => (
                    <div
                      key={i}
                      className='space-y-2'
                    >
                      <div className='flex items-center gap-2'>
                        <div
                          className='w-3 h-3 rounded-full'
                          style={{
                            backgroundColor:
                              i === 0
                                ? 'hsl(217, 91%, 60%)'
                                : i === 1
                                ? 'hsl(262, 83%, 58%)'
                                : 'hsl(48, 96%, 53%)',
                          }}
                        ></div>
                        <div className='text-sm font-medium'>
                          {product.product}
                        </div>
                      </div>
                      <div className='flex items-center justify-between'>
                        <div className='flex-1 mr-4'>
                          <div className='h-2 bg-muted rounded-full overflow-hidden'>
                            <div
                              className='h-full'
                              style={{
                                width: `${product.percentage}%`,
                                backgroundColor:
                                  i === 0
                                    ? 'hsl(217, 91%, 60%)'
                                    : i === 1
                                    ? 'hsl(262, 83%, 58%)'
                                    : 'hsl(48, 96%, 53%)',
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className='text-right'>
                          <div className='font-medium'>{product.licenses}</div>
                          <div className='text-xs text-muted-foreground'>
                            {product.percentage}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant='outline'
                size='sm'
                onClick={handleDownloadProductReport}
              >
                <Download className='mr-2 h-4 w-4' />
                Download Product Report
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent
          value='customers'
          className='space-y-6'
        >
          <Card>
            <CardHeader>
              <CardTitle>Customer Performance</CardTitle>
              <CardDescription>
                Top customers by license volume and revenue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-6'>
                <div className='border-b pb-4'>
                  <h3 className='text-sm font-medium mb-4'>
                    Top Customers by Revenue
                  </h3>
                  <div className='space-y-4'>
                    {customerData.map((customer, i) => (
                      <div
                        key={i}
                        className='flex items-center justify-between'
                      >
                        <div className='flex items-center gap-2'>
                          <div className='w-6 text-muted-foreground'>
                            {i + 1}.
                          </div>
                          <div>{customer.customer}</div>
                        </div>
                        <div className='flex-1 mx-4'>
                          <div className='h-2 bg-muted rounded-full overflow-hidden'>
                            <div
                              className='h-full bg-primary'
                              style={{
                                width: `${
                                  (customer.revenue / totalRevenue) * 100
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className='text-right'>
                          <div className='font-medium'>${customer.revenue}</div>
                          <div className='text-xs text-muted-foreground'>
                            {customer.licenses} licenses
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className='text-sm font-medium mb-4'>Customer Growth</h3>
                  <div className='grid gap-4 grid-cols-1 md:grid-cols-3'>
                    <div className='space-y-2'>
                      <h4 className='text-xs text-muted-foreground'>
                        Total Customers
                      </h4>
                      <div className='text-2xl font-bold'>42</div>
                      <p className='text-xs text-muted-foreground'>
                        +5 from previous period
                      </p>
                    </div>
                    <div className='space-y-2'>
                      <h4 className='text-xs text-muted-foreground'>
                        New Customers
                      </h4>
                      <div className='text-2xl font-bold'>8</div>
                      <p className='text-xs text-muted-foreground'>
                        +2 from previous period
                      </p>
                    </div>
                    <div className='space-y-2'>
                      <h4 className='text-xs text-muted-foreground'>
                        Customer Retention
                      </h4>
                      <div className='text-2xl font-bold'>95%</div>
                      <p className='text-xs text-muted-foreground'>
                        +2% from previous period
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant='outline'
                size='sm'
                onClick={handleDownloadCustomerReport}
              >
                <Download className='mr-2 h-4 w-4' />
                Download Customer Report
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
