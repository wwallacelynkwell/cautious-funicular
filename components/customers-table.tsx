"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MoreHorizontal, Eye } from "lucide-react"

// Mock customers data
const customers = [
  {
    id: "CUST-001",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    address: "123 Main St, Anytown, CA 12345",
    orders: 3,
    lastOrder: "2023-05-15",
  },
  {
    id: "CUST-002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "(555) 234-5678",
    address: "456 Oak Ave, Somewhere, NY 67890",
    orders: 1,
    lastOrder: "2023-05-16",
  },
  {
    id: "CUST-003",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    phone: "(555) 345-6789",
    address: "789 Pine Rd, Nowhere, TX 54321",
    orders: 2,
    lastOrder: "2023-05-17",
  },
  {
    id: "CUST-004",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    phone: "(555) 456-7890",
    address: "321 Cedar Ln, Elsewhere, FL 09876",
    orders: 1,
    lastOrder: "2023-05-18",
  },
  {
    id: "CUST-005",
    name: "Michael Wilson",
    email: "michael.wilson@example.com",
    phone: "(555) 567-8901",
    address: "654 Birch Blvd, Anywhere, WA 13579",
    orders: 4,
    lastOrder: "2023-05-19",
  },
]

export function CustomersTable() {
  const [selectedCustomer, setSelectedCustomer] = useState<(typeof customers)[0] | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const viewCustomerDetails = (customer: (typeof customers)[0]) => {
    setSelectedCustomer(customer)
    setIsDialogOpen(true)
  }

  return (
    <>
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
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.id}</TableCell>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.orders}</TableCell>
                <TableCell>{customer.lastOrder}</TableCell>
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
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>Complete information about this customer</DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-4">
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
                <p className="text-sm font-medium text-muted-foreground">Order History</p>
                <p>Total Orders: {selectedCustomer.orders}</p>
                <p>Last Order Date: {selectedCustomer.lastOrder}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

