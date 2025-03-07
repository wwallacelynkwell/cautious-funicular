'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  softwarePackages,
  bundles,
  validateSerialNumber,
  generateLicenseKey,
} from '@/app/api/database'
import { AlertCircle, Check, Plus, Minus, UserPlus } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/lib/auth-provider'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { customers as allCustomers } from '@/app/api/database'

type OrderType = 'software' | 'bundle'
type OrderStep = 'product' | 'stations' | 'customer' | 'review' | 'licenses'
type CustomerSelectionType = 'existing' | 'new'

interface Station {
  serialNumber: string
  isValid: boolean
  softwareLicenseKey?: string
  warrantyLicenseKey?: string
}

export function OrderForm() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()

  // Order state
  const [orderType, setOrderType] = useState<OrderType>('software')
  const [currentStep, setCurrentStep] = useState<OrderStep>('product')
  const [selectedSoftware, setSelectedSoftware] = useState('')
  const [selectedBundle, setSelectedBundle] = useState('')
  const [softwareTerm, setSoftwareTerm] = useState('1')
  const [warrantyTerm, setWarrantyTerm] = useState('1')
  const [stationCount, setStationCount] = useState(1)
  const [stations, setStations] = useState<Station[]>([
    { serialNumber: '', isValid: false },
  ])

  // Customer selection
  const [customerSelectionType, setCustomerSelectionType] =
    useState<CustomerSelectionType>('existing')
  const [selectedCustomerId, setSelectedCustomerId] = useState('')

  // Filter customers based on current user
  const userCustomers = allCustomers.filter(
    (customer) => customer.userId === user?.id
  )

  // Customer information
  const [customer, setCustomer] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  })

  // Load customer data if existing customer is selected
  useEffect(() => {
    if (customerSelectionType === 'existing' && selectedCustomerId) {
      const selectedCustomer = userCustomers.find(
        (c) => c.id === selectedCustomerId
      )
      if (selectedCustomer) {
        // Parse address into components
        const addressParts = selectedCustomer.address?.split(', ') || []
        setCustomer({
          firstName: selectedCustomer.name.split(' ')[0],
          lastName: selectedCustomer.name.split(' ').slice(1).join(' '),
          email: selectedCustomer.email,
          phone: selectedCustomer.phone || '',
          address: selectedCustomer.address || '',
          city: addressParts[0] || '',
          state: addressParts[1] || '',
          zipCode: addressParts[2] || '',
        })
      }
    }
  }, [customerSelectionType, selectedCustomerId, userCustomers])

  const handleStationCountChange = (count: number) => {
    if (count < 1) return

    setStationCount(count)

    // Update stations array to match the new count
    if (count > stations.length) {
      // Add new stations
      const newStations = [...stations]
      for (let i = stations.length; i < count; i++) {
        newStations.push({ serialNumber: '', isValid: false })
      }
      setStations(newStations)
    } else if (count < stations.length) {
      // Remove excess stations
      setStations(stations.slice(0, count))
    }
  }

  const handleSerialNumberChange = (index: number, value: string) => {
    const updatedStations = [...stations]
    updatedStations[index] = {
      ...updatedStations[index],
      serialNumber: value,
      isValid: false, // Reset validation when serial number changes
    }
    setStations(updatedStations)
  }

  const validateStationSerialNumber = (index: number) => {
    const updatedStations = [...stations]
    const isValid = validateSerialNumber(updatedStations[index].serialNumber)
    updatedStations[index] = { ...updatedStations[index], isValid }
    setStations(updatedStations)
    return isValid
  }

  const validateAllSerialNumbers = () => {
    let allValid = true
    const updatedStations = stations.map((station) => {
      const isValid = validateSerialNumber(station.serialNumber)
      if (!isValid) allValid = false
      return { ...station, isValid }
    })

    setStations(updatedStations)
    return allValid
  }

  const generateLicenseKeys = () => {
    const updatedStations = stations.map((station) => {
      const softwareLicenseKey = generateLicenseKey(
        'software',
        station.serialNumber
      )
      let warrantyLicenseKey

      if (orderType === 'bundle') {
        warrantyLicenseKey = generateLicenseKey(
          'warranty',
          station.serialNumber
        )
      }

      return {
        ...station,
        softwareLicenseKey,
        warrantyLicenseKey,
      }
    })

    setStations(updatedStations)
  }

  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCustomer((prev) => ({ ...prev, [name]: value }))
  }

  const nextStep = () => {
    if (currentStep === 'product') {
      setCurrentStep('stations')
    } else if (currentStep === 'stations') {
      if (!validateAllSerialNumbers()) {
        toast({
          title: 'Invalid Serial Numbers',
          description: 'Please ensure all serial numbers are valid.',
          variant: 'destructive',
        })
        return
      }
      setCurrentStep('customer')
    } else if (currentStep === 'customer') {
      // Validate customer information
      if (customerSelectionType === 'existing' && !selectedCustomerId) {
        toast({
          title: 'Customer Required',
          description:
            'Please select an existing customer or create a new one.',
          variant: 'destructive',
        })
        return
      }

      if (customerSelectionType === 'new') {
        // Validate new customer fields
        if (
          !customer.firstName ||
          !customer.lastName ||
          !customer.email ||
          !customer.phone ||
          !customer.address ||
          !customer.city ||
          !customer.state ||
          !customer.zipCode
        ) {
          toast({
            title: 'Missing Information',
            description: 'Please fill in all customer information fields.',
            variant: 'destructive',
          })
          return
        }
      }

      setCurrentStep('review')
    } else if (currentStep === 'review') {
      generateLicenseKeys()
      setCurrentStep('licenses')
    }
  }

  const prevStep = () => {
    if (currentStep === 'stations') {
      setCurrentStep('product')
    } else if (currentStep === 'customer') {
      setCurrentStep('stations')
    } else if (currentStep === 'review') {
      setCurrentStep('customer')
    } else if (currentStep === 'licenses') {
      setCurrentStep('review')
    }
  }

  const handleSubmit = () => {
    // In a real application, this would submit the order to your backend
    // and associate it with the current user and customer
    toast({
      title: 'Order Submitted',
      description: 'Your order has been successfully submitted.',
    })
    router.push('/dashboard/orders')
  }

  const calculateTotal = () => {
    let pricePerStation = 0

    if (orderType === 'software') {
      const software = softwarePackages.find((sw) => sw.id === selectedSoftware)
      if (software) {
        pricePerStation =
          software.pricePerStation * Number.parseInt(softwareTerm)
      }
    } else if (orderType === 'bundle') {
      const bundle = bundles.find((b) => b.id === selectedBundle)
      if (bundle) {
        // For bundles, we assume the price already includes both components for 1 year
        // and we multiply by the max term between software and warranty
        const term = Math.max(
          Number.parseInt(softwareTerm),
          Number.parseInt(warrantyTerm)
        )
        pricePerStation = bundle.pricePerStation * term
      }
    }

    const total = pricePerStation * stationCount
    return {
      pricePerStation: pricePerStation.toFixed(2),
      total: total.toFixed(2),
    }
  }

  const handleCreateNewCustomer = () => {
    router.push('/dashboard/customers/new')
  }

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Create New Order</CardTitle>
        <CardDescription>
          Creating order as: <span className='font-medium'>{user?.name}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {currentStep === 'product' && (
          <div className='space-y-6'>
            <div className='space-y-4'>
              <Label>Order Type</Label>
              <RadioGroup
                value={orderType}
                onValueChange={(value) => setOrderType(value as OrderType)}
                className='grid grid-cols-1 sm:grid-cols-2 gap-4'
              >
                <div>
                  <RadioGroupItem
                    value='software'
                    id='software'
                    className='peer sr-only'
                  />
                  <Label
                    htmlFor='software'
                    className='flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary'
                  >
                    <span>Software Package</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value='bundle'
                    id='bundle'
                    className='peer sr-only'
                  />
                  <Label
                    htmlFor='bundle'
                    className='flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary'
                  >
                    <span>Bundle (Software + Warranty)</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {orderType === 'software' && (
              <div className='space-y-4'>
                <div>
                  <Label htmlFor='software-package'>Software Package</Label>
                  <Select
                    value={selectedSoftware}
                    onValueChange={setSelectedSoftware}
                  >
                    <SelectTrigger id='software-package'>
                      <SelectValue placeholder='Select a software package' />
                    </SelectTrigger>
                    <SelectContent>
                      {softwarePackages.map((software) => (
                        <SelectItem
                          key={software.id}
                          value={software.id}
                        >
                          {software.name} - ${software.pricePerStation}/station
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor='software-term'>Term (Years)</Label>
                  <Select
                    value={softwareTerm}
                    onValueChange={setSoftwareTerm}
                  >
                    <SelectTrigger id='software-term'>
                      <SelectValue placeholder='Select term length' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='1'>1 Year</SelectItem>
                      <SelectItem value='2'>2 Years</SelectItem>
                      <SelectItem value='3'>3 Years</SelectItem>
                      <SelectItem value='4'>4 Years</SelectItem>
                      <SelectItem value='5'>5 Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {orderType === 'bundle' && (
              <div className='space-y-4'>
                <div>
                  <Label htmlFor='bundle-package'>Bundle Package</Label>
                  <Select
                    value={selectedBundle}
                    onValueChange={setSelectedBundle}
                  >
                    <SelectTrigger id='bundle-package'>
                      <SelectValue placeholder='Select a bundle' />
                    </SelectTrigger>
                    <SelectContent>
                      {bundles.map((bundle) => (
                        <SelectItem
                          key={bundle.id}
                          value={bundle.id}
                        >
                          {bundle.name} - ${bundle.pricePerStation}/station
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div>
                    <Label htmlFor='bundle-software-term'>
                      Software Term (Years)
                    </Label>
                    <Select
                      value={softwareTerm}
                      onValueChange={setSoftwareTerm}
                    >
                      <SelectTrigger id='bundle-software-term'>
                        <SelectValue placeholder='Select term length' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='1'>1 Year</SelectItem>
                        <SelectItem value='2'>2 Years</SelectItem>
                        <SelectItem value='3'>3 Years</SelectItem>
                        <SelectItem value='4'>4 Years</SelectItem>
                        <SelectItem value='5'>5 Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor='bundle-warranty-term'>
                      Warranty Term (Years)
                    </Label>
                    <Select
                      value={warrantyTerm}
                      onValueChange={setWarrantyTerm}
                    >
                      <SelectTrigger id='bundle-warranty-term'>
                        <SelectValue placeholder='Select term length' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='1'>1 Year</SelectItem>
                        <SelectItem value='2'>2 Years</SelectItem>
                        <SelectItem value='3'>3 Years</SelectItem>
                        <SelectItem value='4'>4 Years</SelectItem>
                        <SelectItem value='5'>5 Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === 'stations' && (
          <div className='space-y-6'>
            <div className='space-y-4'>
              <Label htmlFor='station-count'>Number of Charging Stations</Label>
              <div className='flex items-center space-x-2'>
                <Button
                  type='button'
                  variant='outline'
                  size='icon'
                  onClick={() => handleStationCountChange(stationCount - 1)}
                  disabled={stationCount <= 1}
                >
                  <Minus className='h-4 w-4' />
                </Button>
                <Input
                  id='station-count'
                  type='number'
                  min='1'
                  value={stationCount}
                  onChange={(e) =>
                    handleStationCountChange(
                      Number.parseInt(e.target.value) || 1
                    )
                  }
                  className='w-20 text-center'
                />
                <Button
                  type='button'
                  variant='outline'
                  size='icon'
                  onClick={() => handleStationCountChange(stationCount + 1)}
                >
                  <Plus className='h-4 w-4' />
                </Button>
              </div>
            </div>

            <div className='space-y-4'>
              <Label>Charging Station Serial Numbers</Label>
              {stations.map((station, index) => (
                <div
                  key={index}
                  className='space-y-2 sm:space-y-0 sm:flex sm:items-center sm:space-x-2'
                >
                  <Input
                    placeholder={`Serial number for station ${
                      index + 1
                    } (e.g., SN-12345)`}
                    value={station.serialNumber}
                    onChange={(e) =>
                      handleSerialNumberChange(index, e.target.value)
                    }
                    className='w-full'
                  />
                  <div className='flex items-center space-x-2'>
                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => validateStationSerialNumber(index)}
                      className='whitespace-nowrap'
                    >
                      Validate
                    </Button>
                    {station.isValid && (
                      <div className='flex items-center text-sm font-medium text-green-600'>
                        <Check className='h-4 w-4' />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <Alert>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription>
                  Note: Each charging station requires a valid serial number
                  starting with "SN-".
                </AlertDescription>
              </Alert>
            </div>
          </div>
        )}

        {currentStep === 'customer' && (
          <div className='space-y-6'>
            <div className='space-y-4'>
              <Label>Customer Selection</Label>
              <RadioGroup
                value={customerSelectionType}
                onValueChange={(value) =>
                  setCustomerSelectionType(value as CustomerSelectionType)
                }
                className='grid grid-cols-1 sm:grid-cols-2 gap-4'
              >
                <div>
                  <RadioGroupItem
                    value='existing'
                    id='existing'
                    className='peer sr-only'
                  />
                  <Label
                    htmlFor='existing'
                    className='flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary'
                  >
                    <span>Existing Customer</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value='new'
                    id='new'
                    className='peer sr-only'
                  />
                  <Label
                    htmlFor='new'
                    className='flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary'
                  >
                    <span>New Customer</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {customerSelectionType === 'existing' && (
              <div className='space-y-4'>
                <div className='flex items-end gap-2'>
                  <div className='flex-1'>
                    <Label htmlFor='customer-select'>Select Customer</Label>
                    <Select
                      value={selectedCustomerId}
                      onValueChange={setSelectedCustomerId}
                    >
                      <SelectTrigger id='customer-select'>
                        <SelectValue placeholder='Choose a customer' />
                      </SelectTrigger>
                      <SelectContent>
                        {userCustomers.length === 0 ? (
                          <SelectItem
                            value='none'
                            disabled
                          >
                            No customers found
                          </SelectItem>
                        ) : (
                          userCustomers.map((customer) => (
                            <SelectItem
                              key={customer.id}
                              value={customer.id}
                            >
                              {customer.name} - {customer.email}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type='button'
                    onClick={handleCreateNewCustomer}
                    className='flex items-center gap-1'
                  >
                    <UserPlus className='h-4 w-4' />
                    <span>Create New</span>
                  </Button>
                </div>

                {selectedCustomerId && (
                  <div className='rounded-md border p-4 mt-4'>
                    <h3 className='font-medium mb-2'>Customer Information</h3>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      <div>
                        <p className='text-sm font-medium text-muted-foreground'>
                          Name
                        </p>
                        <p>
                          {
                            userCustomers.find(
                              (c) => c.id === selectedCustomerId
                            )?.name
                          }
                        </p>
                      </div>
                      <div>
                        <p className='text-sm font-medium text-muted-foreground'>
                          Email
                        </p>
                        <p>
                          {
                            userCustomers.find(
                              (c) => c.id === selectedCustomerId
                            )?.email
                          }
                        </p>
                      </div>
                      <div>
                        <p className='text-sm font-medium text-muted-foreground'>
                          Phone
                        </p>
                        <p>
                          {
                            userCustomers.find(
                              (c) => c.id === selectedCustomerId
                            )?.phone
                          }
                        </p>
                      </div>
                      <div>
                        <p className='text-sm font-medium text-muted-foreground'>
                          Address
                        </p>
                        <p>
                          {
                            userCustomers.find(
                              (c) => c.id === selectedCustomerId
                            )?.address
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {customerSelectionType === 'new' && (
              <div className='space-y-4'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='firstName'>First Name</Label>
                    <Input
                      id='firstName'
                      name='firstName'
                      value={customer.firstName}
                      onChange={handleCustomerChange}
                      required
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='lastName'>Last Name</Label>
                    <Input
                      id='lastName'
                      name='lastName'
                      value={customer.lastName}
                      onChange={handleCustomerChange}
                      required
                    />
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                    id='email'
                    name='email'
                    type='email'
                    value={customer.email}
                    onChange={handleCustomerChange}
                    required
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='phone'>
                    Phone Number <span className='text-red-500'>*</span>
                  </Label>
                  <Input
                    id='phone'
                    name='phone'
                    value={customer.phone}
                    onChange={handleCustomerChange}
                    required
                    placeholder='e.g. +1 (555) 123-4567'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='address'>
                    Street Address <span className='text-red-500'>*</span>
                  </Label>
                  <Input
                    id='address'
                    name='address'
                    value={customer.address}
                    onChange={handleCustomerChange}
                    required
                    placeholder='Full street address'
                  />
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='city'>City</Label>
                    <Input
                      id='city'
                      name='city'
                      value={customer.city}
                      onChange={handleCustomerChange}
                      required
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='state'>State</Label>
                    <Input
                      id='state'
                      name='state'
                      value={customer.state}
                      onChange={handleCustomerChange}
                      required
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='zipCode'>Zip Code</Label>
                    <Input
                      id='zipCode'
                      name='zipCode'
                      value={customer.zipCode}
                      onChange={handleCustomerChange}
                      required
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === 'review' && (
          <div className='space-y-6'>
            <div>
              <h3 className='text-lg font-medium'>Order Summary</h3>
              <div className='mt-4 rounded-md border p-4'>
                <div className='space-y-2'>
                  <div className='flex justify-between'>
                    <span className='font-medium'>Order Type:</span>
                    <span className='capitalize'>{orderType}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='font-medium'>
                      Number of Charging Stations:
                    </span>
                    <span>{stationCount}</span>
                  </div>
                  {orderType === 'software' && selectedSoftware && (
                    <>
                      <div className='flex justify-between'>
                        <span className='font-medium'>Software Package:</span>
                        <span>
                          {
                            softwarePackages.find(
                              (sw) => sw.id === selectedSoftware
                            )?.name
                          }
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='font-medium'>Software Term:</span>
                        <span>
                          {softwareTerm}{' '}
                          {Number.parseInt(softwareTerm) === 1
                            ? 'Year'
                            : 'Years'}
                        </span>
                      </div>
                    </>
                  )}
                  {orderType === 'bundle' && selectedBundle && (
                    <>
                      <div className='flex justify-between'>
                        <span className='font-medium'>Bundle Package:</span>
                        <span>
                          {bundles.find((b) => b.id === selectedBundle)?.name}
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='font-medium'>Software Term:</span>
                        <span>
                          {softwareTerm}{' '}
                          {Number.parseInt(softwareTerm) === 1
                            ? 'Year'
                            : 'Years'}
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='font-medium'>Warranty Term:</span>
                        <span>
                          {warrantyTerm}{' '}
                          {Number.parseInt(warrantyTerm) === 1
                            ? 'Year'
                            : 'Years'}
                        </span>
                      </div>
                    </>
                  )}
                  <div className='pt-2'>
                    <div className='flex justify-between'>
                      <span className='font-medium'>Price Per Station:</span>
                      <span>${calculateTotal().pricePerStation}</span>
                    </div>
                    <div className='flex justify-between font-bold border-t mt-2 pt-2'>
                      <span>Total Amount Due:</span>
                      <span>${calculateTotal().total}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Alert className='bg-blue-50 border-blue-200 text-blue-800'>
              <AlertCircle className='h-4 w-4 text-blue-600' />
              <AlertDescription className='text-blue-700'>
                This portal is only for activating licenses and associating them
                with charging station serial numbers. The total amount shown is
                what you owe to the supplier. You are responsible for your own
                client invoicing and payment processing.
              </AlertDescription>
            </Alert>

            <div>
              <h3 className='text-lg font-medium'>Customer Information</h3>
              <div className='mt-4 rounded-md border p-4'>
                <div className='space-y-2'>
                  {customerSelectionType === 'existing' &&
                    selectedCustomerId && (
                      <>
                        <div className='flex justify-between'>
                          <span className='font-medium'>Customer:</span>
                          <span>
                            {
                              userCustomers.find(
                                (c) => c.id === selectedCustomerId
                              )?.name
                            }
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='font-medium'>Email:</span>
                          <span>
                            {
                              userCustomers.find(
                                (c) => c.id === selectedCustomerId
                              )?.email
                            }
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='font-medium'>Phone:</span>
                          <span>
                            {
                              userCustomers.find(
                                (c) => c.id === selectedCustomerId
                              )?.phone
                            }
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='font-medium'>Address:</span>
                          <span>
                            {
                              userCustomers.find(
                                (c) => c.id === selectedCustomerId
                              )?.address
                            }
                          </span>
                        </div>
                      </>
                    )}
                  {customerSelectionType === 'new' && (
                    <>
                      <div className='flex justify-between'>
                        <span className='font-medium'>Name:</span>
                        <span>
                          {customer.firstName} {customer.lastName}
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='font-medium'>Email:</span>
                        <span>{customer.email}</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='font-medium'>Phone:</span>
                        <span>{customer.phone}</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='font-medium'>Address:</span>
                        <span>
                          {customer.address}, {customer.city}, {customer.state}{' '}
                          {customer.zipCode}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className='text-lg font-medium'>Charging Stations</h3>
              <div className='mt-4 rounded-md border p-4'>
                <div className='space-y-2'>
                  {stations.map((station, index) => (
                    <div
                      key={index}
                      className='flex justify-between'
                    >
                      <span className='font-medium'>Station {index + 1}:</span>
                      <span>{station.serialNumber}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'licenses' && (
          <div className='space-y-6'>
            <div>
              <h3 className='text-lg font-medium'>License Keys</h3>
              <p className='text-sm text-muted-foreground mb-4'>
                Below are the unique license keys for each charging station.
                Please save this information.
              </p>
              <div className='rounded-md border overflow-x-auto'>
                <Table className='min-w-[600px]'>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Station</TableHead>
                      <TableHead>Serial Number</TableHead>
                      <TableHead>Software License Key</TableHead>
                      {orderType === 'bundle' && (
                        <TableHead>Warranty License Key</TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stations.map((station, index) => (
                      <TableRow key={index}>
                        <TableCell>Station {index + 1}</TableCell>
                        <TableCell>{station.serialNumber}</TableCell>
                        <TableCell className='font-mono text-xs'>
                          {station.softwareLicenseKey}
                        </TableCell>
                        {orderType === 'bundle' && (
                          <TableCell className='font-mono text-xs'>
                            {station.warrantyLicenseKey}
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div>
              <h3 className='text-lg font-medium'>Order Summary</h3>
              <div className='mt-4 rounded-md border p-4'>
                <div className='space-y-2'>
                  <div className='flex justify-between'>
                    <span className='font-medium'>Order Type:</span>
                    <span className='capitalize'>{orderType}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='font-medium'>
                      Number of Charging Stations:
                    </span>
                    <span>{stationCount}</span>
                  </div>
                  <div className='flex justify-between font-bold border-t mt-2 pt-2'>
                    <span>Total Amount Due:</span>
                    <span>${calculateTotal().total}</span>
                  </div>
                </div>
              </div>
            </div>

            <Alert>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>
                Please save or print this page for your records. You will need
                these license keys to activate the software and warranty for
                each charging station.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
      <CardFooter className='flex justify-between'>
        {currentStep !== 'product' && (
          <Button
            variant='outline'
            onClick={prevStep}
          >
            Back
          </Button>
        )}
        {currentStep === 'licenses' ? (
          <Button onClick={handleSubmit}>Complete Order</Button>
        ) : (
          <Button
            onClick={nextStep}
            disabled={
              currentStep === 'product' &&
              ((orderType === 'software' && !selectedSoftware) ||
                (orderType === 'bundle' && !selectedBundle))
            }
          >
            Next
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
