"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-provider"
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
  Cell
} from "recharts"

// Mock orders data - this would come from your API in a real application
const orders = [
  {
    id: "ORD-001",
    date: "2023-05-15",
    customer: "John Doe",
    type: "Software",
    product: "Basic Software",
    stations: 3,
    status: "Completed",
    total: "$599.97",
    totalValue: 599.97,
    userId: "2", // Belongs to reseller1
    reseller: "Reseller One"
  },
  {
    id: "ORD-002",
    date: "2023-05-16",
    customer: "Jane Smith",
    type: "Bundle",
    product: "Pro Bundle",
    stations: 5,
    status: "Completed",
    total: "$2,149.95",
    totalValue: 2149.95,
    userId: "2", // Belongs to reseller1
    reseller: "Reseller One"
  },
  {
    id: "ORD-003",
    date: "2023-05-17",
    customer: "Robert Johnson",
    type: "Software + Warranty",
    product: "Pro Software + Extended Warranty",
    stations: 2,
    status: "Pending",
    total: "$899.98",
    totalValue: 899.98,
    userId: "3", // Belongs to reseller2
    reseller: "Reseller Two"
  },
  {
    id: "ORD-004",
    date: "2023-05-18",
    customer: "Emily Davis",
    type: "Software",
    product: "Enterprise Software",
    stations: 10,
    status: "Completed",
    total: "$4,999.90",
    totalValue: 4999.90,
    userId: "3", // Belongs to reseller2
    reseller: "Reseller Two"
  },
  {
    id: "ORD-005",
    date: "2023-05-19",
    customer: "Michael Wilson",
    type: "Bundle",
    product: "Enterprise Bundle",
    stations: 8,
    status: "Pending",
    total: "$5,039.92",
    totalValue: 5039.92,
    userId: "2", // Belongs to reseller1
    reseller: "Reseller One"
  },
]

// Colors for the charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function ResellerOrdersBreakdown() {
  const { getUsers } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  
  // Get all resellers
  const resellers = getUsers().filter(user => user.role === "reseller")
  
  // Group orders by reseller
  const ordersByReseller = resellers.map(reseller => {
    const resellerOrders = orders.filter(order => order.userId === reseller.id)
    const totalOrders = resellerOrders.length
    const totalValue = resellerOrders.reduce((sum, order) => sum + order.totalValue, 0)
    const completedOrders = resellerOrders.filter(order => order.status === "Completed").length
    const pendingOrders = resellerOrders.filter(order => order.status === "Pending").length
    
    return {
      id: reseller.id,
      name: reseller.name,
      orders: resellerOrders,
      totalOrders,
      totalValue,
      completedOrders,
      pendingOrders
    }
  })
  
  // Prepare data for the charts
  const barChartData = ordersByReseller.map(reseller => ({
    name: reseller.name,
    Orders: reseller.totalOrders,
    Value: Math.round(reseller.totalValue / 100) // Scaled down for better visualization
  }))
  
  const pieChartData = ordersByReseller.map(reseller => ({
    name: reseller.name,
    value: reseller.totalValue
  }))
  
  // Calculate overall statistics
  const totalOrdersCount = orders.length
  const totalOrdersValue = orders.reduce((sum, order) => sum + order.totalValue, 0)
  const totalCompletedOrders = orders.filter(order => order.status === "Completed").length
  const totalPendingOrders = orders.filter(order => order.status === "Pending").length

  return (
    <div className="space-y-6">
      {/* Overall Statistics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{totalOrdersCount}</div>
            <p className="text-xs text-muted-foreground">Total Orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">${totalOrdersValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total Value</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{totalCompletedOrders}</div>
            <p className="text-xs text-muted-foreground">Completed Orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{totalPendingOrders}</div>
            <p className="text-xs text-muted-foreground">Pending Orders</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs for different views */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="details">Detailed Breakdown</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reseller</TableHead>
                  <TableHead>Total Orders</TableHead>
                  <TableHead>Completed</TableHead>
                  <TableHead>Pending</TableHead>
                  <TableHead className="text-right">Total Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ordersByReseller.map(reseller => (
                  <TableRow key={reseller.id}>
                    <TableCell className="font-medium">{reseller.name}</TableCell>
                    <TableCell>{reseller.totalOrders}</TableCell>
                    <TableCell>{reseller.completedOrders}</TableCell>
                    <TableCell>{reseller.pendingOrders}</TableCell>
                    <TableCell className="text-right">${reseller.totalValue.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        {/* Charts Tab */}
        <TabsContent value="charts" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-medium">Orders by Reseller</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Orders" fill="#8884d8" />
                      <Bar dataKey="Value" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-medium">Revenue Distribution</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
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
          </div>
        </TabsContent>
        
        {/* Detailed Breakdown Tab */}
        <TabsContent value="details" className="space-y-6">
          {ordersByReseller.map(reseller => (
            <Card key={reseller.id} className="overflow-hidden">
              <CardHeader className="bg-muted">
                <CardTitle>{reseller.name}</CardTitle>
                <CardDescription>
                  {reseller.totalOrders} orders | ${reseller.totalValue.toLocaleString()} total value
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="rounded-md overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reseller.orders.map(order => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell>{order.customer}</TableCell>
                          <TableCell>{order.product}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                order.status === "Completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {order.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">{order.total}</TableCell>
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