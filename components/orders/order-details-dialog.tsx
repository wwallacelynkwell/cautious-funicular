"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Download, Copy } from "lucide-react"
import { useState, useEffect, useCallback, memo } from "react"

interface License {
  id: string
  type: string
  key: string
  startDate: string
  endDate: string
  stationId: string
}

interface Station {
  id: string
  serialNumber: string
  model: string
  licenses: License[]
}

interface OrderDetailsDialogProps {
  open: boolean
  onClose: () => void
  order: {
    id: string
    date: string
    customer: string
    type: string
    product: string
    stations: number
    status: string
    total: string
    totalValue: number
    userId: string
    reseller: string
    customerDetails: {
      name: string
      email: string
      phone: string
      address: string
      company?: string
    }
    stations: Station[]
  } | null
}

// Extracted License Card Component
const LicenseCard = memo(({ license, onCopy }: { license: License, onCopy: (key: string) => void }) => (
  <div
    className="flex items-center justify-between bg-muted p-3 rounded-lg"
  >
    <div className="space-y-1">
      <p className="text-sm font-medium">{license.type}</p>
      <p className="text-xs text-muted-foreground">
        Valid: {new Date(license.startDate).toLocaleDateString()} -{" "}
        {new Date(license.endDate).toLocaleDateString()}
      </p>
    </div>
    <div className="flex items-center gap-2">
      <code className="text-xs bg-background px-2 py-1 rounded">
        {license.key}
      </code>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onCopy(license.key)}
      >
        <Copy className="w-4 h-4" />
      </Button>
    </div>
  </div>
))
LicenseCard.displayName = 'LicenseCard'

// Extracted Station Card Component
const StationCard = memo(({ station, onCopyLicense }: { 
  station: Station, 
  onCopyLicense: (key: string) => void 
}) => (
  <Card>
    <CardContent className="p-4">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">
            Station {station.model}
          </h3>
          <p className="text-sm text-muted-foreground">
            Serial Number: {station.serialNumber}
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium">Associated Licenses</h4>
          {station.licenses.map((license) => (
            <LicenseCard 
              key={license.id} 
              license={license} 
              onCopy={onCopyLicense}
            />
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
))
StationCard.displayName = 'StationCard'

export function OrderDetailsDialog({ open, onClose, order }: OrderDetailsDialogProps) {
  const [activeTab, setActiveTab] = useState("details")
  const [pdfGenerating, setPdfGenerating] = useState(false)

  const handleGeneratePDF = useCallback(async () => {
    setPdfGenerating(true)
    try {
      // In a real application, this would call your API to generate the PDF
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API call
    } catch (error) {
      console.error('Failed to generate PDF:', error)
    } finally {
      setPdfGenerating(false)
    }
    // Here you would typically trigger the PDF download
  }, [])

  const handleCopyLicenseKey = useCallback((key: string) => {
    navigator.clipboard.writeText(key)
    // You could add a toast notification here
  }, [])

  useEffect(() => {
    if (order) {
      setActiveTab("details")
    }
  }, [order])

  // Cleanup effect for PDF generation state
  useEffect(() => {
    if (!open) {
      setPdfGenerating(false)
    }
  }, [open])

  if (!order) return null

  // Memoize date formatting to avoid unnecessary recalculations
  const formattedDate = new Date(order.date).toLocaleDateString()

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[70vh] flex flex-col">
        <DialogHeader className="pb-2">
          <DialogTitle>Order {order.id}</DialogTitle>
          <DialogDescription>
            Placed on {formattedDate}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="px-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Order Details</TabsTrigger>
              <TabsTrigger value="licenses">Stations & Licenses</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-2 space-y-3">
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">Order Information</h3>
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="text-muted-foreground">Status:</span>{" "}
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            order.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {order.status}
                          </span>
                        </p>
                        <p>
                          <span className="text-muted-foreground">Type:</span> {order.type}
                        </p>
                        <p>
                          <span className="text-muted-foreground">Product:</span> {order.product}
                        </p>
                        <p>
                          <span className="text-muted-foreground">Total:</span> {order.total}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Customer Information</h3>
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="text-muted-foreground">Name:</span>{" "}
                          {order.customerDetails.name}
                        </p>
                        {order.customerDetails.company && (
                          <p>
                            <span className="text-muted-foreground">Company:</span>{" "}
                            {order.customerDetails.company}
                          </p>
                        )}
                        <p>
                          <span className="text-muted-foreground">Email:</span>{" "}
                          {order.customerDetails.email}
                        </p>
                        <p>
                          <span className="text-muted-foreground">Phone:</span>{" "}
                          {order.customerDetails.phone}
                        </p>
                        <p>
                          <span className="text-muted-foreground">Address:</span>{" "}
                          {order.customerDetails.address}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="licenses" className="mt-2 space-y-3">
              {order.stations.map((station) => (
                <StationCard
                  key={station.id}
                  station={station}
                  onCopyLicense={handleCopyLicenseKey}
                />
              ))}
            </TabsContent>
          </Tabs>
        </ScrollArea>

        <div className="flex justify-end border-t -mx-6 px-6 pt-4 mt-2">
          <Button
            onClick={handleGeneratePDF}
            disabled={pdfGenerating}
            className="w-[140px]"
          >
            {pdfGenerating ? (
              "Generating..."
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Generate PDF
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 