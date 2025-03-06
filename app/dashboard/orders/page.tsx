"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-provider"
import { Breadcrumbs } from "@/components/orders/breadcrumbs"
import { ResellerCard } from "@/components/orders/reseller-card"
import { ResellerDrawer } from "@/components/orders/reseller-drawer"
import { OrderDetailsDialog } from "@/components/orders/order-details-dialog"
import { Search, Filter, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"

// Mock orders data with extended information
const orders = [
  {
    id: "ORD-001",
    date: "2023-05-15",
    customer: "John Doe",
    type: "Software",
    product: "Basic Software",
    status: "Completed",
    total: "$599.97",
    totalValue: 599.97,
    userId: "2",
    reseller: "Reseller One",
    customerDetails: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "(555) 123-4567",
      address: "123 Main St, Anytown, USA 12345",
      company: "Doe Enterprises"
    },
    stations: [
      {
        id: "STN-001",
        serialNumber: "CS2023051501",
        model: "Basic-CS-100",
        licenses: [
          {
            id: "LIC-001",
            type: "Basic Software License",
            key: "BSL-2023-XXXX-YYYY",
            startDate: "2023-05-15",
            endDate: "2024-05-14",
            stationId: "STN-001"
          }
        ]
      },
      {
        id: "STN-002",
        serialNumber: "CS2023051502",
        model: "Basic-CS-100",
        licenses: [
          {
            id: "LIC-002",
            type: "Basic Software License",
            key: "BSL-2023-XXXX-ZZZZ",
            startDate: "2023-05-15",
            endDate: "2024-05-14",
            stationId: "STN-002"
          }
        ]
      }
    ]
  },
  {
    id: "ORD-002",
    date: "2023-05-16",
    customer: "Jane Smith",
    type: "Bundle",
    product: "Pro Bundle",
    status: "Completed",
    total: "$2,149.95",
    totalValue: 2149.95,
    userId: "2",
    reseller: "Reseller One",
    customerDetails: {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "(555) 234-5678",
      address: "456 Oak Ave, Somewhere, USA 12346",
      company: "Smith Solutions"
    },
    stations: [
      {
        id: "STN-003",
        serialNumber: "CS2023051601",
        model: "Pro-CS-200",
        licenses: [
          {
            id: "LIC-003",
            type: "Pro Software License",
            key: "PSL-2023-AAAA-BBBB",
            startDate: "2023-05-16",
            endDate: "2024-05-15",
            stationId: "STN-003"
          },
          {
            id: "LIC-004",
            type: "Extended Warranty",
            key: "EW-2023-CCCC-DDDD",
            startDate: "2023-05-16",
            endDate: "2026-05-15",
            stationId: "STN-003"
          }
        ]
      }
    ]
  },
  {
    id: "ORD-003",
    date: "2023-05-17",
    customer: "Robert Johnson",
    type: "Software + Warranty",
    product: "Pro Software + Extended Warranty",
    status: "Pending",
    total: "$899.98",
    totalValue: 899.98,
    userId: "3",
    reseller: "Reseller Two",
    customerDetails: {
      name: "Robert Johnson",
      email: "robert.j@example.com",
      phone: "(555) 345-6789",
      address: "789 Pine St, Elsewhere, USA 12347",
      company: "Johnson Industries"
    },
    stations: [
      {
        id: "STN-004",
        serialNumber: "CS2023051701",
        model: "Pro-CS-200",
        licenses: [
          {
            id: "LIC-005",
            type: "Pro Software License",
            key: "PSL-2023-EEEE-FFFF",
            startDate: "2023-05-17",
            endDate: "2024-05-16",
            stationId: "STN-004"
          },
          {
            id: "LIC-006",
            type: "Extended Warranty",
            key: "EW-2023-GGGG-HHHH",
            startDate: "2023-05-17",
            endDate: "2026-05-16",
            stationId: "STN-004"
          }
        ]
      }
    ]
  },
  {
    id: "ORD-004",
    date: "2023-05-18",
    customer: "Emily Davis",
    type: "Software",
    product: "Enterprise Software",
    status: "Completed",
    total: "$4,999.90",
    totalValue: 4999.90,
    userId: "3",
    reseller: "Reseller Two",
    customerDetails: {
      name: "Emily Davis",
      email: "emily.d@example.com",
      phone: "(555) 456-7890",
      address: "321 Maple Dr, Anywhere, USA 12348",
      company: "Davis Corp"
    },
    stations: [
      {
        id: "STN-005",
        serialNumber: "CS2023051801",
        model: "Enterprise-CS-300",
        licenses: [
          {
            id: "LIC-007",
            type: "Enterprise Software License",
            key: "ESL-2023-IIII-JJJJ",
            startDate: "2023-05-18",
            endDate: "2024-05-17",
            stationId: "STN-005"
          }
        ]
      }
    ]
  },
  {
    id: "ORD-005",
    date: "2023-05-19",
    customer: "Michael Wilson",
    type: "Bundle",
    product: "Enterprise Bundle",
    status: "Pending",
    total: "$5,039.92",
    totalValue: 5039.92,
    userId: "2",
    reseller: "Reseller One",
    customerDetails: {
      name: "Michael Wilson",
      email: "michael.w@example.com",
      phone: "(555) 567-8901",
      address: "654 Birch Ln, Nowhere, USA 12349",
      company: "Wilson Technologies"
    },
    stations: [
      {
        id: "STN-006",
        serialNumber: "CS2023051901",
        model: "Enterprise-CS-300",
        licenses: [
          {
            id: "LIC-008",
            type: "Enterprise Software License",
            key: "ESL-2023-KKKK-LLLL",
            startDate: "2023-05-19",
            endDate: "2024-05-18",
            stationId: "STN-006"
          },
          {
            id: "LIC-009",
            type: "Premium Support",
            key: "PS-2023-MMMM-NNNN",
            startDate: "2023-05-19",
            endDate: "2024-05-18",
            stationId: "STN-006"
          }
        ]
      }
    ]
  }
]

type SortField = "date" | "total" | "customer"
type SortOrder = "asc" | "desc"
type FilterStatus = "all" | "completed" | "pending"
type FilterType = "all" | "software" | "bundle" | "warranty"

export default function OrdersPage() {
  const { user, getUsers, isAdmin } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedReseller, setSelectedReseller] = useState<any>(null)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [sortField, setSortField] = useState<SortField>("date")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all")
  const [typeFilter, setTypeFilter] = useState<FilterType>("all")

  // Get relevant orders based on user role
  const relevantOrders = isAdmin 
    ? orders 
    : orders.filter(order => order.userId === user?.id)

  // Filter orders based on search, status, and type
  const filteredOrders = relevantOrders.filter(order => {
    const matchesSearch = 
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.product.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "completed" && order.status === "Completed") ||
      (statusFilter === "pending" && order.status === "Pending")
    
    const matchesType = typeFilter === "all" ||
      order.type.toLowerCase().includes(typeFilter.toLowerCase())
    
    return matchesSearch && matchesStatus && matchesType
  })

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortField === "date") {
      return sortOrder === "asc" 
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime()
    }
    if (sortField === "total") {
      return sortOrder === "asc" 
        ? a.totalValue - b.totalValue
        : b.totalValue - a.totalValue
    }
    if (sortField === "customer") {
      return sortOrder === "asc"
        ? a.customer.localeCompare(b.customer)
        : b.customer.localeCompare(a.customer)
    }
    return 0
  })

  // Get resellers for admin view
  const resellers = isAdmin ? getUsers()
    .filter(user => user.role === "reseller")
    .map(reseller => {
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
    }) : []

  // Calculate statistics
  const totalOrdersCount = relevantOrders.length
  const totalOrdersValue = relevantOrders.reduce((sum, order) => sum + order.totalValue, 0)
  const totalCompletedOrders = relevantOrders.filter(order => order.status === "Completed").length
  const totalPendingOrders = relevantOrders.filter(order => order.status === "Pending").length

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { title: "Orders", href: "/dashboard/orders" }
        ]}
      />

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders Overview</h1>
        <p className="text-muted-foreground">
          {isAdmin ? "View and analyze orders by reseller" : "Manage and track your orders"}
        </p>
      </div>

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

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-[300px]"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Status</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                  All Orders
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("completed")}>
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                  Pending
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Type</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setTypeFilter("all")}>
                  All Types
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter("software")}>
                  Software
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter("bundle")}>
                  Bundle
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter("warranty")}>
                  Warranty
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => {
                  setSortField("date")
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }}>
                  Date {sortField === "date" && (sortOrder === "asc" ? "↑" : "↓")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  setSortField("total")
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }}>
                  Total Value {sortField === "total" && (sortOrder === "asc" ? "↑" : "↓")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  setSortField("customer")
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }}>
                  Customer Name {sortField === "customer" && (sortOrder === "asc" ? "↑" : "↓")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Card>
          <ScrollArea className="h-[600px]">
            <div className="space-y-4 p-4">
              {sortedOrders.map((order) => (
                <Card 
                  key={order.id} 
                  className="hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{order.id}</span>
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
                        <p className="text-sm text-muted-foreground">{order.date}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="font-medium">{order.customer}</p>
                        <p className="text-sm text-muted-foreground">{order.product}</p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">{order.type}</p>
                        <p className="text-sm">{order.stations.length} stations</p>
                      </div>

                      <div className="text-right">
                        <p className="font-medium">{order.total}</p>
                        {isAdmin && (
                          <p className="text-sm text-muted-foreground">{order.reseller}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>

      {isAdmin && (
        <>
          <div className="border-t pt-6">
            <h2 className="text-2xl font-bold tracking-tight mb-4">Reseller Breakdown</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {resellers.map((reseller) => (
                <ResellerCard
                  key={reseller.id}
                  reseller={reseller}
                  onClick={() => setSelectedReseller(reseller)}
                />
              ))}
            </div>
          </div>

          <ResellerDrawer
            open={!!selectedReseller}
            onClose={() => setSelectedReseller(null)}
            reseller={selectedReseller}
          />
        </>
      )}

      <OrderDetailsDialog
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
      />
    </div>
  )
}

