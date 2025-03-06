"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-provider"

// Mock customers data
const allCustomers = [
  {
    id: "CUST-001",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    address: "123 Main St",
    city: "Anytown",
    state: "CA",
    zipCode: "12345",
    orders: ["ORD-001", "ORD-003", "ORD-005"],
    lastOrder: "2023-05-15",
    userId: "2", // Belongs to reseller1
  },
  {
    id: "CUST-002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "(555) 234-5678",
    address: "456 Oak Ave",
    city: "Somewhere",
    state: "NY",
    zipCode: "67890",
    orders: ["ORD-002"],
    lastOrder: "2023-05-16",
    userId: "2", // Belongs to reseller1
  },
  {
    id: "CUST-003",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    phone: "(555) 345-6789",
    address: "789 Pine Rd",
    city: "Nowhere",
    state: "TX",
    zipCode: "54321",
    orders: ["ORD-004"],
    lastOrder: "2023-05-17",
    userId: "3", // Belongs to reseller2
  },
]

interface CustomerFormProps {
  customerId?: string
}

export function CustomerForm({ customerId }: CustomerFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  })

  // If customerId is provided, load the customer data
  useEffect(() => {
    if (customerId) {
      const customer = allCustomers.find((c) => c.id === customerId)
      if (customer) {
        setFormData({
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          city: customer.city,
          state: customer.state,
          zipCode: customer.zipCode,
        })
      }
    }
  }, [customerId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real app, this would call an API to create/update the customer
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: customerId ? "Customer Updated" : "Customer Created",
        description: customerId
          ? `${formData.name}'s information has been updated.`
          : `${formData.name} has been added to your customers.`,
      })

      router.push("/dashboard/customers")
    } catch (error) {
      toast({
        title: "Error",
        description: customerId
          ? "Failed to update customer. Please try again."
          : "Failed to create customer. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Street Address</Label>
          <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input id="state" name="state" value={formData.state} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="zipCode">Zip Code</Label>
            <Input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} required />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/customers")}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? customerId
              ? "Updating..."
              : "Creating..."
            : customerId
              ? "Update Customer"
              : "Create Customer"}
        </Button>
      </div>
    </form>
  )
}

