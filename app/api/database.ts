// DATABASE.TS - SINGLE SOURCE OF TRUTH FOR ALL APPLICATION DATA
// Current date reference: March 6, 2025

// Define types
export type OrderStatus = 'pending' | 'processing' | 'success' | 'failed';
export type UserRole = 'admin' | 'customer' | 'reseller' | 'guest';

export type Order = {
  id: string;
  customerId: string;
  status: OrderStatus;
  amount: number;
  date: string;
  items: string[];  // Now required
  notes: string;    // Now required
  visibleToRoles: UserRole[]; // Control visibility based on user role
  totalValue?: number;
  stations?: number;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  image: string;
  createdAt: string;
  resellerId: string;  // Now required
  visibleToRoles: UserRole[]; // Control visibility based on user role
  phone: string;
  address: string;
  city?: string;
  state?: string;
  zipCode?: string;
  userId?: string;
};

export type Reseller = {
  id: string;
  name: string;
  email: string;
  region: string;
};

// SOFTWARE AND WARRANTY PACKAGES
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

// RESELLERS DATA
export const resellers: Reseller[] = [
  {
    id: "RES-001",
    name: "EastCoast Distributors",
    email: "sales@eastcoastdist.example.com",
    region: "East Coast",
  },
  {
    id: "RES-002",
    name: "WestCoast Partners",
    email: "sales@westcoastpartners.example.com",
    region: "West Coast",
  },
  {
    id: "RES-003",
    name: "Central Sales Group",
    email: "sales@centralsales.example.com",
    region: "Central",
  }
];

// CUSTOMERS DATA 
export const customers: Customer[] = [
  {
    id: "CUST-1001",
    name: "Candice Schinner",
    email: "candice_schinner@example.com",
    image: "https://avatar.vercel.sh/1.png",
    createdAt: "2024-11-10T00:00:00.000Z",
    resellerId: "RES-001",
    visibleToRoles: ['admin', 'reseller', 'customer'],
    phone: "+1 (555) 123-4567",
    address: "123 Main St, Boston, MA 02108",
    city: "Boston",
    state: "MA",
    zipCode: "02108",
    userId: "USER-1001"
  },
  {
    id: "CUST-1002",
    name: "Katherine Bernhard",
    email: "katherine_bernhard@example.com",
    image: "https://avatar.vercel.sh/2.png",
    createdAt: "2024-10-05T00:00:00.000Z",
    resellerId: "RES-001",
    visibleToRoles: ['admin', 'reseller', 'customer'],
    phone: "+1 (555) 234-5678",
    address: "456 Oak Ave, New York, NY 10001",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    userId: "USER-1002"
  },
  {
    id: "CUST-1003",
    name: "Garrick Waelchi",
    email: "garrick_waelchi@example.com",
    image: "https://avatar.vercel.sh/3.png",
    createdAt: "2024-12-15T00:00:00.000Z",
    resellerId: "RES-001",
    visibleToRoles: ['admin', 'reseller', 'customer'],
    phone: "+1 (555) 345-6789",
    address: "789 Pine St, Chicago, IL 60601",
    city: "Chicago",
    state: "IL",
    zipCode: "60601"
  },
  {
    id: "CUST-1004",
    name: "Hildegard Fisher",
    email: "hildegard_fisher@example.com",
    image: "https://avatar.vercel.sh/4.png",
    createdAt: "2024-09-20T00:00:00.000Z",
    resellerId: "RES-001",
    visibleToRoles: ['admin', 'reseller', 'customer'],
    phone: "+1 (555) 456-7890",
    address: "101 Elm St, San Francisco, CA 94105",
    city: "San Francisco",
    state: "CA",
    zipCode: "94105"
  },
  {
    id: "CUST-1005",
    name: "Garland Quitzon",
    email: "garland_quitzon@example.com",
    image: "https://avatar.vercel.sh/5.png",
    createdAt: "2025-01-05T00:00:00.000Z",
    resellerId: "RES-002",
    visibleToRoles: ['admin', 'reseller', 'customer'],
    phone: "+1 (555) 567-8901",
    address: "202 Maple Ave, Los Angeles, CA 90001",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90001"
  },
  {
    id: "CUST-1006",
    name: "Luella Wunsch",
    email: "luella_wunsch@example.com",
    image: "https://avatar.vercel.sh/6.png",
    createdAt: "2024-08-15T00:00:00.000Z",
    resellerId: "RES-002",
    visibleToRoles: ['admin', 'reseller', 'customer'],
    phone: "+1 (555) 678-9012",
    address: "303 Cedar St, Seattle, WA 98101",
    city: "Seattle",
    state: "WA",
    zipCode: "98101"
  },
  {
    id: "CUST-1007",
    name: "Alfonzo Effertz",
    email: "alfonzo_effertz@example.com",
    image: "https://avatar.vercel.sh/7.png",
    createdAt: "2024-11-25T00:00:00.000Z",
    resellerId: "RES-002",
    visibleToRoles: ['admin', 'reseller', 'customer'],
    phone: "+1 (555) 789-0123",
    address: "404 Birch Rd, Denver, CO 80202",
    city: "Denver",
    state: "CO",
    zipCode: "80202"
  },
  {
    id: "CUST-1008",
    name: "Thaddeus Stanton",
    email: "thaddeus_stanton@example.com",
    image: "https://avatar.vercel.sh/8.png",
    createdAt: "2024-12-30T00:00:00.000Z",
    resellerId: "RES-003",
    visibleToRoles: ['admin', 'reseller', 'customer'],
    phone: "+1 (555) 890-1234",
    address: "505 Walnut Blvd, Austin, TX 78701",
    city: "Austin",
    state: "TX",
    zipCode: "78701"
  },
  {
    id: "CUST-1009",
    name: "Antonina Turcotte",
    email: "antonina_turcotte@example.com",
    image: "https://avatar.vercel.sh/9.png",
    createdAt: "2024-10-20T00:00:00.000Z",
    resellerId: "RES-003",
    visibleToRoles: ['admin', 'reseller', 'customer'],
    phone: "+1 (555) 901-2345",
    address: "606 Spruce Ct, Miami, FL 33101",
    city: "Miami",
    state: "FL",
    zipCode: "33101"
  },
  {
    id: "CUST-1010",
    name: "Garfield Schulist",
    email: "garfield_schulist@example.com",
    image: "https://avatar.vercel.sh/10.png",
    createdAt: "2024-09-05T00:00:00.000Z",
    resellerId: "RES-003",
    visibleToRoles: ['admin', 'reseller', 'customer'],
    phone: "+1 (555) 012-3456",
    address: "707 Aspen Ln, Atlanta, GA 30301",
    city: "Atlanta",
    state: "GA",
    zipCode: "30301"
  },

  // New customers (very recent - March 2025)
  {
    id: "CUST-1011",
    name: "Morgan Reynolds",
    email: "morgan.reynolds@example.com",
    image: "https://avatar.vercel.sh/morgan.png",
    createdAt: "2025-03-05T10:30:00.000Z", // Just yesterday
    resellerId: "RES-001",
    visibleToRoles: ['admin', 'reseller'],
    phone: "+1 (555) 123-7890",
    address: "808 Redwood Dr, Portland, OR 97201",
    city: "Portland",
    state: "OR",
    zipCode: "97201"
  },
  {
    id: "CUST-1012",
    name: "Taylor Swift",
    email: "taylor.swift@example.com",
    image: "https://avatar.vercel.sh/taylor.png",
    createdAt: "2025-03-04T14:15:00.000Z", // 2 days ago
    resellerId: "RES-002",
    visibleToRoles: ['admin', 'reseller'],
    phone: "+1 (555) 234-8901",
    address: "909 Sequoia Way, Nashville, TN 37201",
    city: "Nashville",
    state: "TN",
    zipCode: "37201"
  },
  {
    id: "CUST-1013",
    name: "Jordan Peterson",
    email: "jordan.peterson@example.com",
    image: "https://avatar.vercel.sh/jordan.png",
    createdAt: "2025-03-01T09:45:00.000Z", // 5 days ago
    resellerId: "RES-003",
    visibleToRoles: ['admin', 'reseller', 'customer'],
    phone: "+1 (555) 345-9012",
    address: "1010 Cypress Ave, Toronto, ON M5V 2A8",
    city: "Toronto",
    state: "ON",
    zipCode: "M5V 2A8"
  },
  {
    id: "CUST-1014",
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    image: "https://avatar.vercel.sh/alex.png",
    createdAt: "2025-02-28T16:20:00.000Z", // About a week ago
    resellerId: "RES-003",
    visibleToRoles: ['admin', 'reseller', 'customer'],
    phone: "+1 (555) 456-0123",
    address: "1111 Fir St, Phoenix, AZ 85001",
    city: "Phoenix",
    state: "AZ",
    zipCode: "85001"
  },
];

// ORDERS DATA
export const orders: Order[] = [
  // Candice Schinner (3 orders) - Reseller: EastCoast Distributors
  {
    id: "ORD-5678",
    customerId: "CUST-1001",
    status: "pending",
    amount: 499.99,
    date: "2025-02-15T00:00:00.000Z",
    items: ["sw3"],  // Enterprise Software
    notes: "Standard order for Enterprise Software package",
    visibleToRoles: ['admin', 'reseller', 'customer'],
    totalValue: 499.99,
    stations: 1
  },
  {
    id: "ORD-5688",
    customerId: "CUST-1001",
    status: "success",
    amount: 350.00,
    date: "2025-01-10T00:00:00.000Z",
    items: ["sw2"],  // Pro Software
    notes: "Standard order for Pro Software package",
    visibleToRoles: ['admin', 'reseller', 'customer'],
    totalValue: 350.00,
    stations: 1
  },
  {
    id: "ORD-5698",
    customerId: "CUST-1001",
    status: "success",
    amount: 400.00,
    date: "2025-01-05T00:00:00.000Z",
    items: ["sw2", "wr2"],  // Pro Software with Extended Warranty
    notes: "Combined order for Pro Software and Extended Warranty",
    visibleToRoles: ['admin', 'reseller', 'customer'],
  },

  // Katherine Bernhard (5 orders) - Reseller: EastCoast Distributors
  {
    id: "ORD-5679",
    customerId: "CUST-1002",
    status: "processing",
    amount: 399.99,
    date: "2025-02-21T00:00:00.000Z",
    items: ["b2"],  // Pro Bundle
    notes: "Pro Bundle package order",
    visibleToRoles: ['admin', 'reseller', 'customer'],
  },
  {
    id: "ORD-5689",
    customerId: "CUST-1002",
    status: "success",
    amount: 499.99,
    date: "2025-01-15T00:00:00.000Z",
    items: ["sw3"],  // Enterprise Software
    notes: "Enterprise Software package order",
    visibleToRoles: ['admin', 'reseller', 'customer'],
  },
  {
    id: "ORD-5699",
    customerId: "CUST-1002",
    status: "success",
    amount: 499.99,
    date: "2025-01-10T00:00:00.000Z",
    items: ["sw3"],  // Enterprise Software
    notes: "Enterprise Software package renewal",
    visibleToRoles: ['admin', 'reseller', 'customer'],
  },
  {
    id: "ORD-5709",
    customerId: "CUST-1002",
    status: "success",
    amount: 499.99,
    date: "2025-01-05T00:00:00.000Z",
    items: ["b3"],  // Enterprise Bundle
    notes: "Enterprise Bundle with 5-year warranty",
    visibleToRoles: ['admin', 'reseller', 'customer'],
  },
  {
    id: "ORD-5719",
    customerId: "CUST-1002",
    status: "success",
    amount: 499.99,
    date: "2025-01-01T00:00:00.000Z",
    items: ["sw3", "wr3"],  // Enterprise Software with Premium Warranty
    notes: "Enterprise Software with Premium Warranty package",
    visibleToRoles: ['admin', 'reseller', 'customer'],
  },

  // Garrick Waelchi (2 orders) - Reseller: EastCoast Distributors
  {
    id: "ORD-5680",
    customerId: "CUST-1003",
    status: "success",
    amount: 299.99,
    date: "2025-02-28T00:00:00.000Z",
    items: ["b1"],  // Basic Bundle
    notes: "Basic Bundle package order",
    visibleToRoles: ['admin', 'reseller', 'customer'],
  },
  {
    id: "ORD-5690",
    customerId: "CUST-1003",
    status: "success",
    amount: 499.99,
    date: "2025-01-15T00:00:00.000Z",
    items: ["sw3"],  // Enterprise Software
    notes: "Enterprise Software package order",
    visibleToRoles: ['admin', 'reseller', 'customer'],
  },

  // Hildegard Fisher (4 orders) - Reseller: EastCoast Distributors
  {
    id: "ORD-5681",
    customerId: "CUST-1004",
    status: "failed",
    amount: 599.99,
    date: "2025-03-01T00:00:00.000Z",
    items: ["b3"],  // Enterprise Bundle
    notes: "Payment processing failed for Enterprise Bundle",
    visibleToRoles: ['admin', 'reseller', 'customer'],
  },
  {
    id: "ORD-5691",
    customerId: "CUST-1004",
    status: "success",
    amount: 399.99,
    date: "2025-02-05T00:00:00.000Z",
    items: ["b2"],  // Pro Bundle
    notes: "Pro Bundle package order",
    visibleToRoles: ['admin', 'reseller', 'customer'],
  },
  {
    id: "ORD-5701",
    customerId: "CUST-1004",
    status: "success",
    amount: 499.99,
    date: "2025-01-20T00:00:00.000Z",
    items: ["sw3"],  // Enterprise Software
    notes: "Enterprise Software package order",
    visibleToRoles: ['admin', 'reseller', 'customer'],
  },
  {
    id: "ORD-5711",
    customerId: "CUST-1004",
    status: "success",
    amount: 399.99,
    date: "2025-01-15T00:00:00.000Z",
    items: ["b2"],  // Pro Bundle
    notes: "Pro Bundle package renewal",
    visibleToRoles: ['admin', 'reseller', 'customer'],
  },

  // Garland Quitzon (1 order) - Reseller: WestCoast Partners
  {
    id: "ORD-5682",
    customerId: "CUST-1005",
    status: "pending",
    amount: 499.99,
    date: "2025-03-05T00:00:00.000Z",
    items: ["sw3"],  // Enterprise Software
    notes: "Enterprise Software package order",
    visibleToRoles: ['admin', 'reseller', 'customer'],
  },

  // Luella Wunsch (6 orders) - Reseller: WestCoast Partners
  {
    id: "ORD-5683",
    customerId: "CUST-1006",
    status: "processing",
    amount: 399.99,
    date: "2025-03-04T00:00:00.000Z",
    items: ["b2"],  // Pro Bundle
    notes: "Pro Bundle package order",
    visibleToRoles: ['admin', 'reseller', 'customer'],
  },
  {
    id: "ORD-5693",
    customerId: "CUST-1006",
    status: "success",
    amount: 499.99,
    date: "2025-02-20T00:00:00.000Z",
    items: ["sw3"],  // Enterprise Software
    notes: "Enterprise Software package order",
    visibleToRoles: ['admin', 'reseller', 'customer'],
  },
  {
    id: "ORD-5703",
    customerId: "CUST-1006",
    status: "success",
    amount: 499.99,
    date: "2025-01-15T00:00:00.000Z",
    items: ["sw3"],  // Enterprise Software
    notes: "Enterprise Software package renewal",
    visibleToRoles: ['admin', 'reseller', 'customer'],
  },
  {
    id: "ORD-5713",
    customerId: "CUST-1006",
    status: "success",
    amount: 499.99,
    date: "2025-01-10T00:00:00.000Z",
    items: ["b3"],  // Enterprise Bundle
    notes: "Enterprise Bundle with 5-year warranty",
    visibleToRoles: ['admin', 'reseller', 'customer'],
  },
  {
    id: "ORD-5723",
    customerId: "CUST-1006",
    status: "success",
    amount: 499.99,
    date: "2025-01-05T00:00:00.000Z",
    items: ["sw3", "wr3"],  // Enterprise Software with Premium Warranty
    notes: "Enterprise Software with Premium Warranty package",
    visibleToRoles: ['admin', 'reseller', 'customer'],
  },
  {
    id: "ORD-5733",
    customerId: "CUST-1006",
    status: "success",
    amount: 499.99,
    date: "2025-01-01T00:00:00.000Z",
    items: ["sw3"],  // Enterprise Software
    notes: "Enterprise Software package order",
    visibleToRoles: ['admin', 'reseller', 'customer'],
  },

  // Alfonzo Effertz (3 orders) - Reseller: WestCoast Partners
  {
    id: "ORD-5684",
    customerId: "CUST-1007",
    status: "success",
    amount: 299.99,
    date: "2025-03-02T00:00:00.000Z",
    items: ["b1"],  // Basic Bundle
    notes: "Basic Bundle package order",
    visibleToRoles: ['admin', 'reseller', 'customer'],
  },
  {
    id: "ORD-5694",
    customerId: "CUST-1007",
    status: "success",
    amount: 450.00,
    date: "2025-02-15T00:00:00.000Z",
    items: ["sw2", "wr2"],  // Pro Software with Extended Warranty
    notes: "Pro Software with Extended Warranty package",
    visibleToRoles: ['admin', 'reseller', 'customer'],
  },
  {
    id: "ORD-5704",
    customerId: "CUST-1007",
    status: "success",
    amount: 500.00,
    date: "2025-01-10T00:00:00.000Z",
    items: ["sw3"],  // Enterprise Software
    notes: "Enterprise Software package order",
    visibleToRoles: ['admin', 'reseller', 'customer'],
  },

  // Thaddeus Stanton (2 orders) - Reseller: Central Sales Group
  {
    id: "ORD-5685",
    customerId: "CUST-1008",
    status: "failed",
    amount: 599.99,
    date: "2025-03-03T00:00:00.000Z",
    items: ["b3"],  // Enterprise Bundle
    notes: "Payment failed for Enterprise Bundle order",
    visibleToRoles: ['admin', 'reseller', 'customer'],
  },
  {
    id: "ORD-5695",
    customerId: "CUST-1008",
    status: "success",
    amount: 199.99,
    date: "2025-02-05T00:00:00.000Z",
    items: ["sw1"],  // Basic Software
    notes: "Basic Software package order",
    visibleToRoles: ['admin', 'reseller', 'customer'],
  },

  // Antonina Turcotte (4 orders) - Reseller: Central Sales Group
  {
    id: "ORD-5686",
    customerId: "CUST-1009",
    status: "pending",
    amount: 499.99,
    date: "2025-02-25T00:00:00.000Z",
    items: ["sw3"],  // Enterprise Software
    notes: "Enterprise Software package order",
    visibleToRoles: ['admin', 'reseller', 'customer'],
  },
  {
    id: "ORD-5696",
    customerId: "CUST-1009",
    status: "success",
    amount: 399.99,
    date: "2025-01-20T00:00:00.000Z",
    items: ["b2"],  // Pro Bundle
    notes: "Pro Bundle package order",
    visibleToRoles: ['admin', 'reseller', 'customer'],
  },
  {
    id: "ORD-5706",
    customerId: "CUST-1009",
    status: "success",
    amount: 499.99,
    date: "2025-01-15T00:00:00.000Z",
    items: ["sw3"],  // Enterprise Software
    notes: "Enterprise Software package order",
    visibleToRoles: ['admin', 'reseller', 'customer'],
  },
  {
    id: "ORD-5716",
    customerId: "CUST-1009",
    status: "success",
    amount: 499.99,
    date: "2025-01-10T00:00:00.000Z",
    items: ["sw3"],  // Enterprise Software
    notes: "Enterprise Software package renewal",
    visibleToRoles: ['admin', 'reseller', 'customer'],
  },

  // Garfield Schulist (5 orders) - Reseller: Central Sales Group
  {
    id: "ORD-5687",
    customerId: "CUST-1010",
    status: "processing",
    amount: 399.99,
    date: "2025-03-01T00:00:00.000Z",
    items: ["b2"],  // Pro Bundle
    notes: "Pro Bundle package order",
    visibleToRoles: ['admin', 'reseller', 'customer'],
  },
  {
    id: "ORD-5697",
    customerId: "CUST-1010",
    status: "success",
    amount: 499.99,
    date: "2025-02-01T00:00:00.000Z",
    items: ["sw3"],  // Enterprise Software
    notes: "Enterprise Software package order",
    visibleToRoles: ['admin', 'reseller', 'customer'],
  },
  {
    id: "ORD-5707",
    customerId: "CUST-1010",
    status: "success",
    amount: 499.99,
    date: "2025-01-01T00:00:00.000Z",
    items: ["sw3"],  // Enterprise Software
    notes: "Enterprise Software package renewal",
    visibleToRoles: ['admin', 'reseller', 'customer'],
  },
  {
    id: "ORD-5717",
    customerId: "CUST-1010",
    status: "success",
    amount: 499.99,
    date: "2025-01-15T00:00:00.000Z",
    items: ["b3"],  // Enterprise Bundle
    notes: "Enterprise Bundle with 5-year warranty",
    visibleToRoles: ['admin', 'reseller', 'customer'],
  },
  {
    id: "ORD-5727",
    customerId: "CUST-1010",
    status: "success",
    amount: 499.99,
    date: "2025-01-01T00:00:00.000Z",
    items: ["sw3", "wr3"],  // Enterprise Software with Premium Warranty
    notes: "Enterprise Software with Premium Warranty package",
    visibleToRoles: ['admin', 'reseller', 'customer'],
  },

  // New orders for new customers (very recent - March 2025)
  // Morgan Reynolds (new customer - 2 orders)
  {
    id: "ORD-5800",
    customerId: "CUST-1011",
    status: "pending",
    amount: 799.99,
    date: "2025-03-06T09:15:00.000Z",
    items: ["sw3", "wr3", "sw2"],  // Enterprise Software + Premium Warranty + Pro Software
    notes: "Express shipping requested - Multiple package order",
    visibleToRoles: ['admin', 'reseller'],
  },
  {
    id: "ORD-5801",
    customerId: "CUST-1011",
    status: "processing",
    amount: 349.50,
    date: "2025-03-05T14:30:00.000Z",
    items: ["sw2"],  // Pro Software
    notes: "Pro Software package order",
    visibleToRoles: ['admin', 'reseller'],
  },

  // Taylor Swift (new customer - 1 order)
  {
    id: "ORD-5802",
    customerId: "CUST-1012",
    status: "processing",
    amount: 1299.99,
    date: "2025-03-04T16:45:00.000Z",
    items: ["b3", "sw3", "wr3"],  // Enterprise Bundle + Additional Enterprise Software + Premium Warranty
    notes: "Premium package with gift wrapping - Multiple package order",
    visibleToRoles: ['admin', 'reseller'],
  },

  // Jordan Peterson (new customer - 3 orders)
  {
    id: "ORD-5803",
    customerId: "CUST-1013",
    status: "success",
    amount: 599.99,
    date: "2025-03-05T11:20:00.000Z",
    items: ["b3"],  // Enterprise Bundle
    notes: "Enterprise Bundle package order",
    visibleToRoles: ['admin', 'reseller', 'customer'],
  },
  {
    id: "ORD-5804",
    customerId: "CUST-1013",
    status: "success",
    amount: 129.99,
    date: "2025-03-03T10:15:00.000Z",
    items: ["wr1"],  // Basic Warranty
    notes: "Additional Basic Warranty package",
    visibleToRoles: ['admin', 'reseller', 'customer'],
  },
  {
    id: "ORD-5805",
    customerId: "CUST-1013",
    status: "pending",
    amount: 899.99,
    date: "2025-03-01T15:30:00.000Z",
    items: ["sw3", "sw2"],  // Enterprise Software + Pro Software
    notes: "Multiple software package order",
    visibleToRoles: ['admin', 'reseller', 'customer'],
  },

  // Alex Johnson (new customer - 2 orders)
  {
    id: "ORD-5806",
    customerId: "CUST-1014",
    status: "success",
    amount: 449.99,
    date: "2025-03-04T09:45:00.000Z",
    items: ["b2"],  // Pro Bundle
    notes: "Pro Bundle package order with additional support",
    visibleToRoles: ['admin', 'reseller', 'customer'],
  },
  {
    id: "ORD-5807",
    customerId: "CUST-1014",
    status: "failed",
    amount: 1299.99,
    date: "2025-02-28T13:20:00.000Z",
    items: ["b3", "sw3", "wr3"],  // Enterprise Bundle + Additional Enterprise Software + Premium Warranty
    notes: "Payment verification failed - Multiple package order",
    visibleToRoles: ['admin', 'reseller', 'customer'],
  },

  // Additional very recent orders for existing customers
  {
    id: "ORD-5808",
    customerId: "CUST-1001",
    status: "pending",
    amount: 899.99,
    date: "2025-03-06T08:30:00.000Z",
    items: ["sw3", "sw2"],  // Enterprise Software + Pro Software
    notes: "Urgent order - Multiple software package",
    visibleToRoles: ['admin', 'reseller', 'customer'],
  },
  {
    id: "ORD-5809",
    customerId: "CUST-1002",
    status: "processing",
    amount: 649.99,
    date: "2025-03-06T10:15:00.000Z",
    items: ["b3", "wr1"],  // Enterprise Bundle + Basic Warranty
    notes: "Enterprise Bundle with additional Basic Warranty",
    visibleToRoles: ['admin', 'reseller', 'customer'],
  },
  {
    id: "ORD-5810",
    customerId: "CUST-1003",
    status: "pending",
    amount: 399.99,
    date: "2025-03-05T16:45:00.000Z",
    items: ["b2"],  // Pro Bundle
    notes: "Pro Bundle package order",
    visibleToRoles: ['admin', 'reseller', 'customer'],
  },

  // Additional extremely recent orders
  {
    id: "ORD-5811",
    customerId: "CUST-1006",
    status: "pending",
    amount: 899.99,
    date: "2025-03-06T07:30:00.000Z",
    items: ["sw3", "sw2"],  // Enterprise Software + Pro Software
    notes: "Requested expedited shipping - Multiple software package",
    visibleToRoles: ['admin', 'reseller', 'customer'],
  },
  {
    id: "ORD-5812",
    customerId: "CUST-1008",
    status: "processing",
    amount: 1249.99,
    date: "2025-03-06T09:45:00.000Z",
    items: ["b3", "sw3", "wr2"],  // Enterprise Bundle + Additional Enterprise Software + Extended Warranty
    notes: "Enterprise Bundle with additional software and warranty",
    visibleToRoles: ['admin', 'reseller', 'customer'],
  },
  {
    id: "ORD-5813",
    customerId: "CUST-1010",
    status: "pending",
    amount: 459.99,
    date: "2025-03-06T11:20:00.000Z",
    items: ["b2", "wr1"],  // Pro Bundle + Basic Warranty
    notes: "Pro Bundle with additional Basic Warranty",
    visibleToRoles: ['admin', 'reseller', 'customer'],
  },
  {
    id: "ORD-5814",
    customerId: "CUST-1013",
    status: "processing",
    amount: 799.99,
    date: "2025-03-06T08:15:00.000Z",
    items: ["sw3", "wr3"],  // Enterprise Software + Premium Warranty
    notes: "Enterprise Software with Premium Warranty package",
    visibleToRoles: ['admin', 'reseller', 'customer'],
  },
  {
    id: "ORD-5815",
    customerId: "CUST-1005",
    status: "pending",
    amount: 329.99,
    date: "2025-03-06T10:05:00.000Z",
    items: ["b1", "wr1"],  // Basic Bundle + Basic Warranty
    notes: "Basic Bundle with additional Basic Warranty",
    visibleToRoles: ['admin', 'reseller', 'customer'],
  }
];

// SOFTWARE AND WARRANTY PACKAGES DATA
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

// Helper functions for software and warranty packages
export function generateLicenseKey(type: "software" | "warranty", serialNumber: string): string {
  const prefix = type === "software" ? "SW-" : "WR-"
  const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase()
  return `${prefix}${randomPart}-${serialNumber.substring(3)}`
}

export function validateSerialNumber(serialNumber: string): boolean {
  return serialNumber.startsWith("SN-") && serialNumber.length >= 5
}

// CONFIGURATION
export const config = {
  // Current user role - can be changed to test different visibility scenarios
  currentUserRole: 'admin' as UserRole,
  // Current reseller ID - used when role is 'reseller'
  currentResellerId: 'RES-001',
  // Current date for the application
  currentDate: new Date('2025-03-06T12:00:00.000Z'),
};

// DATABASE ACCESS METHODS

// Get customers
export function getCustomerById(id: string, role: UserRole = config.currentUserRole): Customer | undefined {
  return customers.find(customer => {
    if (customer.id === id && customer.visibleToRoles.includes(role)) {
      // If role is reseller, check if customer belongs to current reseller
      if (role === 'reseller') {
        return customer.resellerId === config.currentResellerId;
      }
      return true;
    }
    return false;
  });
}

// Get orders
export function getOrderById(id: string, role: UserRole = config.currentUserRole): Order | undefined {
  const order = orders.find(order => order.id === id && order.visibleToRoles.includes(role));

  if (order && role === 'reseller') {
    // For resellers, check if the order's customer belongs to them
    const customer = customers.find(c => c.id === order.customerId);
    return customer && customer.resellerId === config.currentResellerId ? order : undefined;
  }

  return order;
}

// Get orders by customer
export function getOrdersByCustomerId(customerId: string, role: UserRole = config.currentUserRole): Order[] {
  // Check if customer is visible to this role
  const customer = getCustomerById(customerId, role);
  if (!customer) return [];

  return orders.filter(order => {
    const basicCheck = order.customerId === customerId && order.visibleToRoles.includes(role);

    // If role is reseller, add additional check
    if (role === 'reseller') {
      return basicCheck && customer.resellerId === config.currentResellerId;
    }

    return basicCheck;
  });
}

// Get all visible customers
export function getVisibleCustomers(role: UserRole = config.currentUserRole): Customer[] {
  return customers.filter(customer => {
    const visibleToRole = customer.visibleToRoles.includes(role);

    // For resellers, only show customers assigned to them
    if (role === 'reseller') {
      return visibleToRole && customer.resellerId === config.currentResellerId;
    }

    return visibleToRole;
  });
}

// Get all visible orders
export function getVisibleOrders(role: UserRole = config.currentUserRole): Order[] {
  return orders.filter(order => {
    // Basic role visibility check
    const visibleToRole = order.visibleToRoles.includes(role);

    // For resellers, check if the order's customer belongs to them
    if (role === 'reseller') {
      const customer = customers.find(c => c.id === order.customerId);
      return visibleToRole && customer && customer.resellerId === config.currentResellerId;
    }

    return visibleToRole;
  });
}

// Get all customers with their orders info
export function getCustomerOrders(role: UserRole = config.currentUserRole) {
  return getVisibleCustomers(role).map(customer => {
    const customerOrders = getOrdersByCustomerId(customer.id, role);
    const lastOrder = customerOrders.length > 0
      ? customerOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
      : null;

    const totalSpent = customerOrders.reduce((sum, order) => sum + order.amount, 0);

    return {
      ...customer,
      orders: customerOrders.length,
      lastOrder: lastOrder?.id || "",
      totalSpent: parseFloat(totalSpent.toFixed(2)),
    };
  });
}

// Get all orders with customer details
export function getOrdersWithCustomerDetails(role: UserRole = config.currentUserRole) {
  return getVisibleOrders(role).map(order => {
    const customer = getCustomerById(order.customerId, role);

    return {
      ...order,
      customer: customer?.name || "Unknown Customer",
      email: customer?.email || "",
      customerImage: customer?.image || "",
    };
  });
}

// Get reseller by ID
export function getResellerById(id: string): Reseller | undefined {
  return resellers.find(reseller => reseller.id === id);
}

// Get customers by reseller ID
export function getCustomersByResellerId(resellerId: string): Customer[] {
  return customers.filter(customer => customer.resellerId === resellerId);
}

// Get today's orders
export function getTodayOrders(role: UserRole = config.currentUserRole) {
  const today = config.currentDate;
  return getVisibleOrders(role).filter(order => {
    const orderDate = new Date(order.date);
    return orderDate.getDate() === today.getDate() &&
      orderDate.getMonth() === today.getMonth() &&
      orderDate.getFullYear() === today.getFullYear();
  });
}

// Format date relative to current date
export function formatRelativeDate(date: Date) {
  const now = config.currentDate;
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return 'Just now';
    if (diffHours === 1) return '1 hour ago';
    return `${diffHours} hours ago`;
  }

  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

  return date.toLocaleDateString();
}

// FAQ CATEGORIES DATA
export const faqCategories = [
  {
    title: 'Account & Billing',
    items: [
      {
        question: 'How do I update my company information?',
        answer:
          "You can update your company information by going to your profile settings. Click on your profile icon in the top right corner, select 'Profile', and then edit your company details.",
      },
      {
        question: 'How am I billed for licenses?',
        answer:
          'You are billed based on the number of licenses you purchase. Invoices are generated at the time of purchase and can be viewed in the Billing section of your account.',
      },
      {
        question: 'Can I transfer licenses between customers?',
        answer:
          'No, licenses are tied to specific customers and cannot be transferred. You would need to deactivate the existing license and purchase a new one for the other customer.',
      },
    ],
  },
  {
    title: 'Orders & Licenses',
    items: [
      {
        question: 'How do I create a new order?',
        answer:
          "To create a new order, navigate to the Dashboard and click on 'Create New Order' button. Follow the steps to select products, quantities, and assign to customers.",
      },
      {
        question: 'What happens when a license expires?',
        answer:
          'When a license expires, the software will continue to function but with limited features. A notification will be sent to both you and the customer 30 days before expiration.',
      },
      {
        question: 'How do I activate a license?',
        answer:
          "After purchasing a license, go to the Orders section, find the order, and click on 'Activate License'. You'll need to enter the charging station serial number to complete the activation.",
      },
    ],
  },
  {
    title: 'Technical Issues',
    items: [
      {
        question: 'The portal is loading slowly. What can I do?',
        answer:
          'Try clearing your browser cache and cookies. If the issue persists, check your internet connection or try using a different browser.',
      },
      {
        question: "I can't log in to my account. What should I do?",
        answer:
          "First, ensure you're using the correct email and password. If you've forgotten your password, use the 'Forgot Password' link. If you still can't log in, contact support.",
      },
      {
        question: 'How do I report a bug?',
        answer:
          "You can report bugs by creating a support ticket. Go to the Support page, click on 'Create Ticket', select 'Bug Report' as the category, and provide detailed information about the issue.",
      },
    ],
  },
] 