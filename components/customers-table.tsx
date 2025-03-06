"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MoreHorizontal, Eye, PenLine, Plus } from "lucide-react"
import { useAuth } from "@/lib/auth-provider"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

// Mock customers data with userId and associated orders
const allCustomers = [
  {
    id: "CUST-001",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    address: "123 Main St, Anytown, CA 12345",
    orders: ["ORD-001", "ORD-003", "ORD-005"],
    lastOrder: "2023-05-15",
    userId: "2", // Belongs to reseller1
  },
  {
    id: "CUST-002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "(555) 234-5678",
    address: "456 Oak Ave, Somewhere, NY 67890",
    orders: ["ORD-002"],
    lastOrder: "2023-05-16",
    userId: "2", // Belongs to reseller1
  },
  {
    id: "CUST-003",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    phone: "(555) 345-6789",
    address: "789 Pine Rd, Nowhere, TX 54321",
    orders: ["ORD-004"],
    lastOrder: "2023-05-17",
    userId: "3", // Belongs to reseller2
  },
  {
    id: "CUST-004",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    phone: "(555) 456-7890",
    address: "321 Cedar Ln, Elsewhere, FL 09876",
    orders: [],
    lastOrder: "",
    userId: "3", // Belongs to reseller2
  },
  {
    id: "CUST-005",
    name: "Michael Wilson",
    email: "michael.wilson@example.com",
    phone: "(555) 567-8901",
    address: "654 Birch Blvd, Anywhere, WA 13579",
    orders: ["ORD-006", "ORD-007"],
    lastOrder: "2023-05-19",
    userId: "2", // Belongs to reseller1
  },
]

// Mock orders data
const allOrders = [
  {
    id: "ORD-001",
    date: "2023-05-15",
    customer: "John Doe",
    customerId: "CUST-001",
    type: "Software",
    product: "Basic Software",
    stations: 3,
    status: "Completed",
    total: "$599.97",
    userId: "2", // Belongs to reseller1
  },
  {
    id: "ORD-002",
    date: "2023-05-16",
    customer: "Jane Smith",
    customerId: "CUST-002",
    type: "Bundle",
    product: "Pro Bundle",
    stations: 5,
    status: "Completed",
    total: "$2,149.95",
    userId: "2", // Belongs to reseller1
  },
  {
    id: "ORD-003",
    date: "2023-05-17",
    customer: "John Doe",
    customerId: "CUST-001",
    type: "Software + Warranty",
    product: "Pro Software + Extended Warranty",
    stations: 2,
    status: "Pending",
    total: "$899.98",
    userId: "2", // Belongs to reseller1
  },
  {
    id: "ORD-004",
    date: "2023-05-18",
    customer: "Robert Johnson",
    customerId: "CUST-003",
    type: "Software",
    product: "Enterprise Software",
    stations: 10,
    status: "Completed",
    total: "$4,999.90",
    userId: "3", // Belongs to reseller2
  },
  {
    id: "ORD-005",
    date: "2023-05-19",
    customer: "John Doe",
    customerId: "CUST-001",
    type: "Bundle",
    product: "Enterprise Bundle",
    stations: 8,
    status: "Pending",
    total: "$5,039.92",
    userId: "2", // Belongs to reseller1
  },
  {
    id: "ORD-006",
    date: "2023-05-20",
    customer: "Michael Wilson",
    customerId: "CUST-005",
    type: "Software",
    product: "Pro Software",
    stations: 3,
    status: "Completed",
    total: "$1,050.00",
    userId: "2", // Belongs to reseller1
  },
  {
    id: "ORD-007",
    date: "2023-05-21",
    customer: "Michael Wilson",
    customerId: "CUST-005",
    type: "Bundle",
    product: "Basic Bundle",
    stations: 2,
    status: "Pending",
    total: "$459.98",
    userId: "2", // Belongs to reseller1
  },
]

export function CustomersTable() {
  const { user, isAdmin } = useAuth()
  const router = useRouter()
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Filter customers based on user role and search query
  const filteredCustomers = allCustomers
    .filter((customer) => isAdmin || customer.userId === user?.id)
    .filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery),
    )

  const viewCustomerDetails = (customer: any) => {
    // Get customer orders
    const customerOrders = allOrders.filter((order) => order.customerId === customer.id)
    setSelectedCustomer({ ...customer, detailedOrders: customerOrders })
    setIsDialogOpen(true)
  }

  const handleAddCustomer = () => {
    router.push("/dashboard/customers/new")
  }

  const handleEditCustomer = (customerId: string) => {
    router.push(`/dashboard/customers/edit/${customerId}`)
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-full max-w-sm">
          <Input
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <Button onClick={handleAddCustomer}>
          <Plus className="mr-2 h-4 w-4" /> Add Customer
        </Button>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow>
              <TableHead>Customer ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Last Order</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No customers found
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.id}</TableCell>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.orders.length}</TableCell>
                  <TableCell>{customer.lastOrder || "No orders"}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => viewCustomerDetails(customer)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditCustomer(customer.id)}>
                          <PenLine className="mr-2 h-4 w-4" />
                          Edit Customer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>Complete information about this customer</DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Customer ID</p>
                  <p>{selectedCustomer.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p>{selectedCustomer.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p>{selectedCustomer.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p>{selectedCustomer.phone}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Address</p>
                <p>{selectedCustomer.address}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Order History</p>
                {selectedCustomer.detailedOrders && selectedCustomer.detailedOrders.length > 0 ? (
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Product</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedCustomer.detailedOrders.map((order: any) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.id}</TableCell>
                            <TableCell>{order.date}</TableCell>
                            <TableCell>{order.product}</TableCell>
                            <TableCell>
                              <Badge variant={order.status === "Completed" ? "success" : "outline"}>
                                {order.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{order.total}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No orders found for this customer</p>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => handleEditCustomer(selectedCustomer.id)}>Edit Customer</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

