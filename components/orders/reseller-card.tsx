"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, ChevronRight } from "lucide-react"

interface ResellerCardProps {
  reseller: {
    id: string
    name: string
    totalOrders: number
    totalValue: number
    completedOrders: number
    pendingOrders: number
  }
  onClick: () => void
}

export function ResellerCard({ reseller, onClick }: ResellerCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all cursor-pointer" onClick={onClick}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold">{reseller.name}</CardTitle>
        <BarChart className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
            <p className="text-2xl font-bold">{reseller.totalOrders}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Value</p>
            <p className="text-2xl font-bold">${reseller.totalValue.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Completed</p>
            <p className="text-lg font-semibold text-green-600">{reseller.completedOrders}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Pending</p>
            <p className="text-lg font-semibold text-yellow-600">{reseller.pendingOrders}</p>
          </div>
        </div>
        <Button variant="ghost" className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground">
          View Details
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  )
} 