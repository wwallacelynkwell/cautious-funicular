import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResellerOrdersBreakdown } from "@/components/reseller-orders-breakdown"

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders by Reseller</h1>
        <p className="text-muted-foreground">View and analyze orders broken down by reseller</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Reseller Order Analysis</CardTitle>
          <CardDescription>A breakdown of orders by reseller</CardDescription>
        </CardHeader>
        <CardContent>
          <ResellerOrdersBreakdown />
        </CardContent>
      </Card>
    </div>
  )
} 