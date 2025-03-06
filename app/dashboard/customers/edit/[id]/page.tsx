import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CustomerForm } from "@/components/customer-form"

export default function EditCustomerPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Customer</h1>
        <p className="text-muted-foreground">Update customer information</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
          <CardDescription>Edit the details of your customer</CardDescription>
        </CardHeader>
        <CardContent>
          <CustomerForm customerId={params.id} />
        </CardContent>
      </Card>
    </div>
  )
}

