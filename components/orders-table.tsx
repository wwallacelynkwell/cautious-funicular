"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MoreHorizontal, Eye } from "lucide-react"
import { useAuth } from "@/lib/auth-provider"

// Mock orders data
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
    userId: "2", // Belongs to reseller1
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
    userId: "2", // Belongs to reseller1
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
    userId: "3", // Belongs to reseller2
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
    userId: "3", // Belongs to reseller2
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
    userId: "2", // Belongs to reseller1
  },
]

export function OrdersTable() {
  const { user, isAdmin } = useAuth()
  const [selectedOrder, setSelectedOrder] = useState<(typeof orders)[0] | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Filter orders based on user role
  // Admin can see all orders, resellers can only see their own
  const filteredOrders = isAdmin ? orders : orders.filter((order) => order.userId === user?.id)

  const viewOrderDetails = (order: (typeof orders)[0]) => {
    setSelectedOrder(order)
    setIsDialogOpen(true)
  }

  return (
    <>
      <div className="rounded-md border overflow-x-auto">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Stations</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.type}</TableCell>
                  <TableCell>{order.product}</TableCell>
                  <TableCell>{order.stations}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        order.status === "Completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell>{order.total}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => viewOrderDetails(order)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>Complete information about this order</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Order ID</p>
                  <p>{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date</p>
                  <p>{selectedOrder.date}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Customer</p>
                  <p>{selectedOrder.customer}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <p>{selectedOrder.status}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Type</p>
                  <p>{selectedOrder.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Product</p>
                  <p>{selectedOrder.product}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Stations</p>
                  <p>{selectedOrder.stations}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total</p>
                  <p>{selectedOrder.total}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Customer Information</p>
                <p>123 Main St, Anytown, CA 12345</p>
                <p>customer@example.com</p>
                <p>(555) 123-4567</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">License Keys</p>
                <p className="text-xs font-mono">SW-A1B2C3D4-12345 (Station 1)</p>
                <p className="text-xs font-mono">WR-E5F6G7H8-12345 (Station 1)</p>
                {selectedOrder.stations > 1 && (
                  <p className="text-xs text-muted-foreground">+ {selectedOrder.stations - 1} more stations</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

