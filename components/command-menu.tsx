"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-provider"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Home, Package, ShoppingCart, Users, Settings, UserPlus, Search, User, LogOut } from "lucide-react"

// Mock customers data
const allCustomers = [
  {
    id: "CUST-001",
    name: "John Doe",
    email: "john.doe@example.com",
    userId: "2",
  },
  {
    id: "CUST-002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    userId: "2",
  },
  {
    id: "CUST-003",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    userId: "3",
  },
  {
    id: "CUST-004",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    userId: "3",
  },
  {
    id: "CUST-005",
    name: "Michael Wilson",
    email: "michael.wilson@example.com",
    userId: "2",
  },
]

// Mock orders data
const allOrders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    customerId: "CUST-001",
    product: "Basic Software",
    userId: "2",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    customerId: "CUST-002",
    product: "Pro Bundle",
    userId: "2",
  },
  {
    id: "ORD-003",
    customer: "John Doe",
    customerId: "CUST-001",
    product: "Pro Software + Extended Warranty",
    userId: "2",
  },
  {
    id: "ORD-004",
    customer: "Robert Johnson",
    customerId: "CUST-003",
    product: "Enterprise Software",
    userId: "3",
  },
  {
    id: "ORD-005",
    customer: "John Doe",
    customerId: "CUST-001",
    product: "Enterprise Bundle",
    userId: "2",
  },
]

export function CommandMenu() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()
  const { user, isAdmin, logout } = useAuth()

  // Filter customers and orders based on user role
  const userCustomers = allCustomers.filter((customer) => isAdmin || customer.userId === user?.id)
  const userOrders = allOrders.filter((order) => isAdmin || order.userId === user?.id)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground px-4 py-2 text-sm h-9 w-full justify-between text-muted-foreground sm:w-64 lg:w-80"
      >
        <span className="inline-flex items-center gap-1">
          <Search className="h-4 w-4" />
          <span>Search...</span>
        </span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard"))}>
              <Home className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/new-order"))}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              <span>New Order</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/orders"))}>
              <Package className="mr-2 h-4 w-4" />
              <span>Orders</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/customers"))}>
              <Users className="mr-2 h-4 w-4" />
              <span>Customers</span>
            </CommandItem>
          </CommandGroup>

          {isAdmin && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Admin">
                <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/admin/users"))}>
                  <Users className="mr-2 h-4 w-4" />
                  <span>User Management</span>
                </CommandItem>
                <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/admin/invite"))}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  <span>Invite Users</span>
                </CommandItem>
                <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/admin/settings"))}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </CommandItem>
              </CommandGroup>
            </>
          )}

          <CommandSeparator />
          <CommandGroup heading="Customers">
            {userCustomers.length > 0 ? (
              userCustomers.map((customer) => (
                <CommandItem
                  key={customer.id}
                  onSelect={() => runCommand(() => router.push(`/dashboard/customers/edit/${customer.id}`))}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>{customer.name}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{customer.email}</span>
                </CommandItem>
              ))
            ) : (
              <CommandItem disabled>No customers found</CommandItem>
            )}
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/customers/new"))}>
              <UserPlus className="mr-2 h-4 w-4" />
              <span>Add New Customer</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />
          <CommandGroup heading="Orders">
            {userOrders.length > 0 ? (
              userOrders.map((order) => (
                <CommandItem
                  key={order.id}
                  onSelect={() => runCommand(() => router.push(`/dashboard/orders?id=${order.id}`))}
                >
                  <Package className="mr-2 h-4 w-4" />
                  <span>{order.id}</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {order.product} - {order.customer}
                  </span>
                </CommandItem>
              ))
            ) : (
              <CommandItem disabled>No orders found</CommandItem>
            )}
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/new-order"))}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              <span>Create New Order</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />
          <CommandGroup heading="Account">
            <CommandItem onSelect={() => runCommand(() => logout())}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}

