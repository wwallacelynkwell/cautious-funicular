"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
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
} from "recharts"

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
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

export function ResellerDrawer({ open, onClose, reseller }: ResellerDrawerProps) {
  if (!reseller) return null

  const ordersByType = reseller.orders.reduce((acc, order) => {
    acc[order.type] = (acc[order.type] || 0) + order.totalValue
    return acc
  }, {} as Record<string, number>)

  const pieChartData = Object.entries(ordersByType).map(([name, value]) => ({
    name,
    value,
  }))

  const monthlyData = reseller.orders.reduce((acc, order) => {
    const month = new Date(order.date).toLocaleString("default", { month: "short" })
    acc[month] = (acc[month] || 0) + order.totalValue
    return acc
  }, {} as Record<string, number>)

  const barChartData = Object.entries(monthlyData).map(([name, value]) => ({
    name,
    value,
  }))

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-[540px] sm:max-w-none">
        <SheetHeader>
          <SheetTitle>{reseller.name}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-80px)] pr-4">
          <div className="space-y-6 mt-6">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-muted-foreground">Total Orders</div>
                  <div className="text-2xl font-bold">{reseller.totalOrders}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-muted-foreground">Total Value</div>
                  <div className="text-2xl font-bold">${reseller.totalValue.toLocaleString()}</div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="charts">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="charts">Analytics</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
              </TabsList>

              <TabsContent value="charts" className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Monthly Revenue</h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                          <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Orders by Type</h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {pieChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="orders">
                <Card>
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-4 p-4">
                      {reseller.orders.map((order) => (
                        <Card key={order.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-medium">{order.customer}</h4>
                                <p className="text-sm text-muted-foreground">{order.date}</p>
                              </div>
                              <div className="text-right">
                                <div className="font-medium">{order.total}</div>
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    order.status === "Completed"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {order.status}
                                </span>
                              </div>
                            </div>
                            <div className="text-sm">
                              <p className="text-muted-foreground">{order.type}</p>
                              <p>{order.product}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
} 