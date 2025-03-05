import { OrderForm } from "@/components/order-form"

export default function NewOrderPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Order</h1>
        <p className="text-muted-foreground">Create a new order for software and warranty packages</p>
      </div>
      <OrderForm />
    </div>
  )
}

