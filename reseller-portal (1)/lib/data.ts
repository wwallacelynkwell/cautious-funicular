// Mock data for the application

export interface SoftwarePackage {
  id: string
  name: string
  description: string
  pricePerStation: number
}

export interface WarrantyPackage {
  id: string
  name: string
  description: string
  pricePerStation: number
}

export interface Bundle {
  id: string
  name: string
  description: string
  softwarePackageId: string
  warrantyPackageId: string
  pricePerStation: number
  discount: number
}

export const softwarePackages: SoftwarePackage[] = [
  {
    id: "sw1",
    name: "Basic Software",
    description: "Essential software tools for charging stations",
    pricePerStation: 199.99,
  },
  {
    id: "sw2",
    name: "Pro Software",
    description: "Advanced software tools with enhanced features",
    pricePerStation: 350.0,
  },
  {
    id: "sw3",
    name: "Enterprise Software",
    description: "Comprehensive software solution with full analytics",
    pricePerStation: 499.99,
  },
]

export const warrantyPackages: WarrantyPackage[] = [
  {
    id: "wr1",
    name: "Basic Warranty",
    description: "1-year coverage for hardware issues",
    pricePerStation: 49.99,
  },
  {
    id: "wr2",
    name: "Extended Warranty",
    description: "3-year coverage with priority support",
    pricePerStation: 99.99,
  },
  {
    id: "wr3",
    name: "Premium Warranty",
    description: "5-year comprehensive coverage with 24/7 support",
    pricePerStation: 149.99,
  },
]

export const bundles: Bundle[] = [
  {
    id: "b1",
    name: "Basic Bundle",
    description: "Basic Software with 1-year warranty",
    softwarePackageId: "sw1",
    warrantyPackageId: "wr1",
    pricePerStation: 229.99,
    discount: 19.99,
  },
  {
    id: "b2",
    name: "Pro Bundle",
    description: "Pro Software with 3-year warranty",
    softwarePackageId: "sw2",
    warrantyPackageId: "wr2",
    pricePerStation: 429.99,
    discount: 20.0,
  },
  {
    id: "b3",
    name: "Enterprise Bundle",
    description: "Enterprise Software with 5-year warranty",
    softwarePackageId: "sw3",
    warrantyPackageId: "wr3",
    pricePerStation: 629.99,
    discount: 19.99,
  },
]

// Generate a unique license key (mock implementation)
export function generateLicenseKey(type: "software" | "warranty", serialNumber: string): string {
  const prefix = type === "software" ? "SW-" : "WR-"
  const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase()
  return `${prefix}${randomPart}-${serialNumber.substring(3)}`
}

// Validate if a serial number exists (mock implementation)
export function validateSerialNumber(serialNumber: string): boolean {
  // In a real application, this would check against a database
  // For demo purposes, we'll accept serial numbers that start with "SN-"
  return serialNumber.startsWith("SN-") && serialNumber.length >= 5
}

