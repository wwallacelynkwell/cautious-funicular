'use client'

import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileText, Copy } from 'lucide-react'
import { useState, useCallback, memo } from 'react'
import { generateOrderPdf } from '@/lib/pdf-generator'
import { toast } from '@/components/ui/use-toast'
import { getCustomerById, generateLicenseKey } from '@/app/api/database'

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
    customerId: string
    status: string
    amount: number
    date: string
    items: string[]
    notes?: string
    visibleToRoles: string[]
  }
}

const StationCard = memo(
  ({
    station,
    onCopyLicense,
  }: {
    station: Station
    onCopyLicense: (key: string) => void
  }) => {
    return (
      <Card key={station.id}>
        <CardContent className='p-4 space-y-3'>
          <div className='flex justify-between items-center'>
            <h3 className='font-semibold'>Station {station.id}</h3>
            <span className='text-sm text-muted-foreground'>
              SN: {station.serialNumber}
            </span>
          </div>
          <div className='space-y-2'>
            {station.licenses.map((license) => (
              <div
                key={license.id}
                className='text-sm space-y-1'
              >
                <div className='flex justify-between items-center'>
                  <span className='font-medium'>{license.type}</span>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='h-8 w-8 p-0'
                    onClick={() => onCopyLicense(license.key)}
                  >
                    <Copy className='h-4 w-4' />
                  </Button>
                </div>
                <div className='grid grid-cols-2 gap-2 text-muted-foreground'>
                  <div>
                    Start: {new Date(license.startDate).toLocaleDateString()}
                  </div>
                  <div>
                    End: {new Date(license.endDate).toLocaleDateString()}
                  </div>
                </div>
                <div className='font-mono text-xs bg-muted p-2 rounded'>
                  {license.key}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }
)

StationCard.displayName = 'StationCard'

export function OrderDetailsDialog({
  open,
  onClose,
  order,
}: OrderDetailsDialogProps) {
  const [activeTab, setActiveTab] = useState('details')
  const [pdfGenerating, setPdfGenerating] = useState(false)

  if (!order) {
    return null
  }

  const formattedDate = new Date(order.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const handleCopyLicenseKey = useCallback((key: string) => {
    navigator.clipboard.writeText(key)
    toast({
      title: 'License key copied',
      description: 'The license key has been copied to your clipboard.',
    })
  }, [])

  const handleGeneratePDF = useCallback(async () => {
    setPdfGenerating(true)
    try {
      await generateOrderPdf(order, `order-${order.id}`)
      toast({
        title: 'PDF Generated',
        description: 'The order PDF has been downloaded.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate PDF. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setPdfGenerating(false)
    }
  }, [order])

  const generateStationsData = useCallback(() => {
    if (!order.items || !order.items.length) return []

    const stations: Station[] = []
    const now = new Date()
    let stationCounter = 1

    order.items.forEach((itemId: string) => {
      const station: Station = {
        id: `ST-${stationCounter}`,
        serialNumber: `SN-${Math.random()
          .toString(36)
          .substring(2, 7)
          .toUpperCase()}`,
        model: `Model ${stationCounter}`,
        licenses: [],
      }

      if (itemId.startsWith('sw') || itemId.startsWith('b')) {
        const softwareLicenseKey = generateLicenseKey(
          'software',
          station.serialNumber
        )
        station.licenses.push({
          id: `LIC-SW-${stationCounter}`,
          type: 'Software License',
          key: softwareLicenseKey,
          startDate: now.toISOString(),
          endDate: new Date(
            now.getFullYear() + 1,
            now.getMonth(),
            now.getDate()
          ).toISOString(),
          stationId: station.id,
        })
      }

      if (itemId.startsWith('wr') || itemId.startsWith('b')) {
        const warrantyLicenseKey = generateLicenseKey(
          'warranty',
          station.serialNumber
        )
        station.licenses.push({
          id: `LIC-WR-${stationCounter}`,
          type: 'Warranty License',
          key: warrantyLicenseKey,
          startDate: now.toISOString(),
          endDate: new Date(
            now.getFullYear() +
              (itemId.endsWith('3') ? 5 : itemId.endsWith('2') ? 3 : 1),
            now.getMonth(),
            now.getDate()
          ).toISOString(),
          stationId: station.id,
        })
      }

      stations.push(station)
      stationCounter++
    })

    return stations
  }, [order.items])

  const stations = generateStationsData()

  return (
    <Dialog
      open={open}
      onOpenChange={onClose}
    >
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Order {order.id}</DialogTitle>
          <DialogDescription>Placed on {formattedDate}</DialogDescription>
        </DialogHeader>
        <div className='h-[70vh] flex flex-col'>
          <ScrollArea className='flex-1 -mx-6'>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className='px-6'
            >
              <TabsList className='grid w-full grid-cols-2'>
                <TabsTrigger value='details'>Order Details</TabsTrigger>
                <TabsTrigger value='licenses'>Stations & Licenses</TabsTrigger>
              </TabsList>

              <TabsContent
                value='details'
                className='mt-2 space-y-3'
              >
                <div className='grid gap-4'>
                  <div>
                    <h3 className='font-semibold mb-2'>Order Information</h3>
                    <div className='grid grid-cols-2 gap-2 text-sm'>
                      <div>
                        <span className='text-muted-foreground'>Status:</span>{' '}
                        <span className='capitalize'>{order.status}</span>
                      </div>
                      <div>
                        <span className='text-muted-foreground'>Amount:</span>{' '}
                        <span>${order.amount.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className='text-muted-foreground'>Items:</span>{' '}
                        <span>{order.items?.length || 0}</span>
                      </div>
                      <div>
                        <span className='text-muted-foreground'>Order ID:</span>{' '}
                        <span>{order.id}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className='font-semibold mb-2'>Customer Information</h3>
                    {(() => {
                      const customer = getCustomerById(order.customerId)
                      return customer ? (
                        <div className='grid grid-cols-2 gap-2 text-sm'>
                          <div>
                            <span className='text-muted-foreground'>Name:</span>{' '}
                            <span>{customer.name}</span>
                          </div>
                          <div>
                            <span className='text-muted-foreground'>
                              Email:
                            </span>{' '}
                            <span>{customer.email}</span>
                          </div>
                          <div>
                            <span className='text-muted-foreground'>
                              Phone:
                            </span>{' '}
                            <span>{customer.phone}</span>
                          </div>
                          <div>
                            <span className='text-muted-foreground'>
                              Address:
                            </span>{' '}
                            <span>{customer.address}</span>
                          </div>
                          <div>
                            <span className='text-muted-foreground'>
                              Customer Since:
                            </span>{' '}
                            <span>
                              {new Date(
                                customer.createdAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <p className='text-sm text-muted-foreground'>
                          Customer information not available
                        </p>
                      )
                    })()}
                  </div>

                  <div>
                    <h3 className='font-semibold mb-2'>Order Notes</h3>
                    <p className='text-sm text-muted-foreground'>
                      {order.notes || 'No notes available for this order.'}
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent
                value='licenses'
                className='mt-2 space-y-3'
              >
                {stations.length > 0 ? (
                  stations.map((station) => (
                    <StationCard
                      key={station.id}
                      station={station}
                      onCopyLicense={handleCopyLicenseKey}
                    />
                  ))
                ) : (
                  <p className='text-muted-foreground'>
                    No stations available for this order.
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </ScrollArea>

          <div className='flex justify-end border-t -mx-6 px-6 pt-4 mt-2'>
            <Button
              variant='outline'
              size='sm'
              className='gap-2 mr-4'
              onClick={handleGeneratePDF}
              disabled={pdfGenerating}
            >
              {pdfGenerating ? (
                <>
                  <div className='h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className='h-4 w-4' />
                  Download PDF
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
