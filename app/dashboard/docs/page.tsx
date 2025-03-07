'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  BookOpen,
  FileText,
  Search,
  Video,
  Download,
  ChevronRight,
  Star,
  Clock,
  CheckCircle2,
  Zap,
  Package,
  ShieldCheck,
} from 'lucide-react'
import Link from 'next/link'
import { generateDocumentation } from '@/lib/pdf-generator'
import { toast } from '@/components/ui/use-toast'

export default function DocumentationPage() {
  const [searchQuery, setSearchQuery] = useState('')

  // Mock documentation data
  const gettingStartedDocs = [
    {
      title: 'Portal Overview',
      description: 'Learn about the reseller portal and its features',
      icon: BookOpen,
      popular: true,
      updated: '2 weeks ago',
      content: [
        {
          heading: 'Introduction',
          text: 'The License Portal is a comprehensive platform designed for resellers to manage software licenses and charging station activations. This portal provides tools for creating orders, managing customers, and tracking license activations.',
        },
        {
          heading: 'Key Features',
          text: '• Order Management: Create and track orders for software licenses and charging stations.\n• Customer Management: Add and manage customer information.\n• License Activation: Activate software licenses and associate them with charging station serial numbers.\n• Reporting: Generate reports on sales, product distribution, and customer performance.',
        },
        {
          heading: 'Getting Started',
          text: "To get started with the License Portal, you'll need to create an account and set up your company profile. Once your account is set up, you can start adding customers, creating orders, and activating licenses.",
        },
      ],
    },
    {
      title: 'Creating Your First Order',
      description: 'Step-by-step guide to creating and managing orders',
      icon: FileText,
      popular: true,
      updated: '1 month ago',
      content: [
        {
          heading: 'Creating an Order',
          text: "To create a new order, navigate to the Dashboard and click on the 'Create New Order' button. You'll be prompted to select products, quantities, and assign them to customers.",
        },
        {
          heading: 'Order Types',
          text: 'There are several types of orders you can create:\n• Software Licenses: Basic, Pro, and Enterprise software packages.\n• Warranty Extensions: Standard and Extended warranty options.\n• Bundles: Combinations of software and warranty packages.',
        },
        {
          heading: 'Managing Orders',
          text: 'After creating an order, you can view and manage it from the Orders section. From there, you can track the status of the order, activate licenses, and generate invoices.',
        },
      ],
    },
    {
      title: 'Managing Customers',
      description: 'How to add, edit, and manage customer information',
      icon: FileText,
      popular: false,
      updated: '1 month ago',
      content: [
        {
          heading: 'Adding Customers',
          text: "To create a new customer, navigate to the Customers section and click on the 'Add New Customer' button. You'll need to provide basic information such as name, contact details, and billing information.",
        },
        {
          heading: 'Customer Management',
          text: 'From the Customers section, you can view and manage all your customers. You can edit customer information, view their order history, and manage their licenses.',
        },
        {
          heading: 'Customer Hierarchy',
          text: 'You can organize customers into a hierarchy by creating parent-child relationships. This is useful for managing large organizations with multiple departments or locations.',
        },
      ],
    },
    {
      title: 'License Activation Process',
      description: 'Understanding how to activate software licenses',
      icon: FileText,
      popular: true,
      updated: '2 months ago',
      content: [
        {
          heading: 'License Activation',
          text: "After purchasing a license, you need to activate it and associate it with a charging station. To do this, go to the Orders section, find the order, and click on 'Activate License'.",
        },
        {
          heading: 'Serial Number Association',
          text: "During activation, you'll need to enter the charging station serial number. This associates the license with the specific hardware device.",
        },
        {
          heading: 'Activation Status',
          text: 'You can track the activation status of licenses from the Orders section. Licenses can be in one of several states: Pending, Active, Expired, or Revoked.',
        },
        {
          heading: 'Bulk Activation',
          text: 'For multiple licenses, you can use the bulk activation feature. This allows you to activate multiple licenses at once by uploading a CSV file with serial numbers.',
        },
      ],
    },
  ]

  const productDocs = [
    {
      title: 'Basic Software Package',
      description: 'Features and specifications of the Basic Software package',
      icon: Package,
      popular: false,
      updated: '3 months ago',
      content: [
        {
          heading: 'Overview',
          text: "The Basic Software package provides essential functionality for charging station management. It's designed for small businesses or residential installations with basic needs.",
        },
        {
          heading: 'Features',
          text: '• Remote monitoring of charging station status\n• Basic usage reporting\n• User authentication\n• Manual firmware updates',
        },
        {
          heading: 'Limitations',
          text: 'The Basic package does not include advanced features such as payment processing, multi-user access, or API integration.',
        },
      ],
    },
    {
      title: 'Pro Software Package',
      description: 'Features and specifications of the Pro Software package',
      icon: Package,
      popular: true,
      updated: '3 months ago',
      content: [
        {
          heading: 'Overview',
          text: 'The Pro Software package is designed for businesses with multiple charging stations. It includes all features from the Basic package plus additional functionality for business operations.',
        },
        {
          heading: 'Features',
          text: '• All Basic features\n• Advanced usage analytics\n• Payment processing integration\n• Automated firmware updates\n• Basic API access\n• Multi-user access with role-based permissions',
        },
        {
          heading: 'Use Cases',
          text: 'The Pro package is ideal for businesses such as parking garages, shopping centers, and office buildings that need to manage multiple charging stations and process payments.',
        },
      ],
    },
    {
      title: 'Enterprise Software Package',
      description:
        'Features and specifications of the Enterprise Software package',
      icon: Package,
      popular: false,
      updated: '3 months ago',
      content: [
        {
          heading: 'Overview',
          text: 'The Enterprise Software package is our most comprehensive solution, designed for large organizations with complex requirements.',
        },
        {
          heading: 'Features',
          text: '• All Pro features\n• Advanced API integration\n• Custom reporting and analytics\n• White labeling options\n• Priority support\n• Advanced user management\n• Load balancing and energy management',
        },
        {
          heading: 'Integration',
          text: 'The Enterprise package offers extensive integration capabilities with third-party systems such as building management systems, fleet management software, and energy management platforms.',
        },
      ],
    },
    {
      title: 'Warranty Options',
      description: 'Understanding the different warranty options available',
      icon: ShieldCheck,
      popular: false,
      updated: '4 months ago',
      content: [
        {
          heading: 'Standard Warranty',
          text: 'All charging stations come with a standard 1-year warranty that covers manufacturing defects and hardware failures under normal use conditions.',
        },
        {
          heading: 'Extended Warranty',
          text: 'The Extended Warranty option extends coverage to 3 years and includes additional benefits such as priority support and expedited replacements.',
        },
        {
          heading: 'Premium Warranty',
          text: 'The Premium Warranty option provides 5 years of coverage and includes all Extended Warranty benefits plus on-site service for eligible locations.',
        },
        {
          heading: 'Warranty Claims',
          text: 'To file a warranty claim, customers should contact their reseller with the charging station serial number and a description of the issue.',
        },
      ],
    },
  ]

  const videoTutorials = [
    {
      title: 'Portal Navigation Tutorial',
      description: 'A quick tour of the reseller portal interface',
      duration: '5:32',
      thumbnail: '/placeholder-video-1.jpg',
    },
    {
      title: 'Creating and Managing Orders',
      description: 'How to create, edit, and track orders',
      duration: '8:45',
      thumbnail: '/placeholder-video-2.jpg',
    },
    {
      title: 'License Activation Walkthrough',
      description: 'Step-by-step guide to activating licenses',
      duration: '6:18',
      thumbnail: '/placeholder-video-3.jpg',
    },
    {
      title: 'Customer Management',
      description: 'Adding and managing customer information',
      duration: '4:56',
      thumbnail: '/placeholder-video-4.jpg',
    },
  ]

  // Filter documentation based on search query
  const filteredDocs = searchQuery
    ? [...gettingStartedDocs, ...productDocs].filter(
        (doc) =>
          doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  // Handle downloading documentation as PDF
  const handleDownloadDocumentation = (doc: any) => {
    try {
      generateDocumentation(
        doc.title,
        doc.content,
        doc.title.toLowerCase().replace(/\s+/g, '-')
      )

      toast({
        title: 'Documentation Downloaded',
        description: `${doc.title} has been downloaded as a PDF.`,
      })
    } catch (error) {
      console.error('Error generating documentation PDF:', error)
      toast({
        title: 'Download Failed',
        description: 'There was an error generating the PDF. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Documentation</h1>
          <p className='text-muted-foreground'>
            Guides and resources to help you use the portal
          </p>
        </div>
      </div>

      <div className='relative'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
        <Input
          placeholder='Search documentation...'
          className='pl-10'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {searchQuery && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
            <CardDescription>
              Found {filteredDocs.length} results for "{searchQuery}"
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {filteredDocs.length > 0 ? (
                filteredDocs.map((doc, i) => (
                  <div
                    key={i}
                    className='flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors'
                  >
                    <div className='rounded-full bg-primary/10 p-2'>
                      <doc.icon className='h-4 w-4 text-primary' />
                    </div>
                    <div className='flex-1'>
                      <h3 className='text-sm font-medium'>{doc.title}</h3>
                      <p className='text-xs text-muted-foreground'>
                        {doc.description}
                      </p>
                      <div className='flex items-center gap-4 mt-1'>
                        <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                          <Clock className='h-3 w-3' />
                          <span>Updated {doc.updated}</span>
                        </div>
                        {doc.popular && (
                          <div className='flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400'>
                            <Star className='h-3 w-3 fill-amber-500 text-amber-500' />
                            <span>Popular</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => handleDownloadDocumentation(doc)}
                      >
                        <Download className='h-4 w-4' />
                        <span className='sr-only'>Download</span>
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        asChild
                      >
                        <Link
                          href={`/dashboard/docs/${doc.title
                            .toLowerCase()
                            .replace(/\s+/g, '-')}`}
                        >
                          <ChevronRight className='h-4 w-4' />
                          <span className='sr-only'>View</span>
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className='text-center py-6 text-muted-foreground'>
                  No results found for "{searchQuery}"
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {!searchQuery && (
        <Tabs
          defaultValue='guides'
          className='space-y-6'
        >
          <TabsList>
            <TabsTrigger value='guides'>
              <FileText className='h-4 w-4 mr-2' />
              Guides
            </TabsTrigger>
            <TabsTrigger value='products'>
              <Package className='h-4 w-4 mr-2' />
              Products
            </TabsTrigger>
            <TabsTrigger value='videos'>
              <Video className='h-4 w-4 mr-2' />
              Video Tutorials
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value='guides'
            className='space-y-6'
          >
            <div className='grid gap-4 grid-cols-1 md:grid-cols-2'>
              {gettingStartedDocs.map((doc, i) => (
                <Card
                  key={i}
                  className='overflow-hidden'
                >
                  <CardHeader className='pb-2'>
                    <div className='flex items-start justify-between'>
                      <div className='space-y-1'>
                        <CardTitle className='text-base'>{doc.title}</CardTitle>
                        <CardDescription>{doc.description}</CardDescription>
                      </div>
                      <div className='rounded-full bg-primary/10 p-2'>
                        <doc.icon className='h-4 w-4 text-primary' />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='pb-2'>
                    <div className='flex items-center gap-4'>
                      <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                        <Clock className='h-3 w-3' />
                        <span>Updated {doc.updated}</span>
                      </div>
                      {doc.popular && (
                        <div className='flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400'>
                          <Star className='h-3 w-3 fill-amber-500 text-amber-500' />
                          <span>Popular</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className='pt-2 flex justify-between'>
                    <Button
                      variant='outline'
                      size='sm'
                      className='gap-1'
                      onClick={() => handleDownloadDocumentation(doc)}
                    >
                      <Download className='h-4 w-4' />
                      Download PDF
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='gap-1'
                      asChild
                    >
                      <Link
                        href={`/dashboard/docs/${doc.title
                          .toLowerCase()
                          .replace(/\s+/g, '-')}`}
                      >
                        Read Guide
                        <ChevronRight className='h-4 w-4' />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Start Checklist</CardTitle>
                <CardDescription>
                  Complete these steps to get started with the portal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {[
                    { text: 'Create your account', completed: true },
                    { text: 'Set up your company profile', completed: true },
                    { text: 'Add your first customer', completed: false },
                    { text: 'Create your first order', completed: false },
                    { text: 'Activate your first license', completed: false },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className='flex items-center gap-3'
                    >
                      <div
                        className={`rounded-full p-1 ${
                          item.completed
                            ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <CheckCircle2 className='h-4 w-4' />
                      </div>
                      <span
                        className={
                          item.completed
                            ? 'line-through text-muted-foreground'
                            : ''
                        }
                      >
                        {item.text}
                      </span>
                      {!item.completed && (
                        <Button
                          variant='link'
                          size='sm'
                          className='ml-auto h-auto p-0'
                          asChild
                        >
                          <Link href='#'>Start</Link>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent
            value='products'
            className='space-y-6'
          >
            <div className='grid gap-4 grid-cols-1 md:grid-cols-2'>
              {productDocs.map((doc, i) => (
                <Card
                  key={i}
                  className='overflow-hidden'
                >
                  <CardHeader className='pb-2'>
                    <div className='flex items-start justify-between'>
                      <div className='space-y-1'>
                        <CardTitle className='text-base'>{doc.title}</CardTitle>
                        <CardDescription>{doc.description}</CardDescription>
                      </div>
                      <div className='rounded-full bg-primary/10 p-2'>
                        <doc.icon className='h-4 w-4 text-primary' />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='pb-2'>
                    <div className='flex items-center gap-4'>
                      <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                        <Clock className='h-3 w-3' />
                        <span>Updated {doc.updated}</span>
                      </div>
                      {doc.popular && (
                        <div className='flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400'>
                          <Star className='h-3 w-3 fill-amber-500 text-amber-500' />
                          <span>Popular</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className='pt-2 flex justify-between'>
                    <Button
                      variant='outline'
                      size='sm'
                      className='gap-1'
                      onClick={() => handleDownloadDocumentation(doc)}
                    >
                      <Download className='h-4 w-4' />
                      Download PDF
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='gap-1'
                      asChild
                    >
                      <Link
                        href={`/dashboard/docs/${doc.title
                          .toLowerCase()
                          .replace(/\s+/g, '-')}`}
                      >
                        Read Documentation
                        <ChevronRight className='h-4 w-4' />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Product Comparison</CardTitle>
                <CardDescription>
                  Compare features across different software packages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='overflow-x-auto'>
                  <table className='w-full border-collapse'>
                    <thead>
                      <tr className='border-b'>
                        <th className='text-left py-3 px-4'>Feature</th>
                        <th className='text-center py-3 px-4'>Basic</th>
                        <th className='text-center py-3 px-4'>Pro</th>
                        <th className='text-center py-3 px-4'>Enterprise</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          feature: 'Remote Monitoring',
                          basic: true,
                          pro: true,
                          enterprise: true,
                        },
                        {
                          feature: 'Usage Analytics',
                          basic: false,
                          pro: true,
                          enterprise: true,
                        },
                        {
                          feature: 'Payment Processing',
                          basic: false,
                          pro: true,
                          enterprise: true,
                        },
                        {
                          feature: 'Multi-user Access',
                          basic: false,
                          pro: false,
                          enterprise: true,
                        },
                        {
                          feature: 'API Integration',
                          basic: false,
                          pro: false,
                          enterprise: true,
                        },
                        {
                          feature: 'White Labeling',
                          basic: false,
                          pro: false,
                          enterprise: true,
                        },
                      ].map((row, i) => (
                        <tr
                          key={i}
                          className='border-b last:border-0'
                        >
                          <td className='py-3 px-4'>{row.feature}</td>
                          <td className='text-center py-3 px-4'>
                            {row.basic ? (
                              <CheckCircle2 className='h-4 w-4 text-emerald-500 mx-auto' />
                            ) : (
                              '-'
                            )}
                          </td>
                          <td className='text-center py-3 px-4'>
                            {row.pro ? (
                              <CheckCircle2 className='h-4 w-4 text-emerald-500 mx-auto' />
                            ) : (
                              '-'
                            )}
                          </td>
                          <td className='text-center py-3 px-4'>
                            {row.enterprise ? (
                              <CheckCircle2 className='h-4 w-4 text-emerald-500 mx-auto' />
                            ) : (
                              '-'
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant='outline'
                  size='sm'
                  asChild
                >
                  <Link href='/dashboard/docs/product-comparison'>
                    View Full Comparison
                    <ChevronRight className='ml-2 h-4 w-4' />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent
            value='videos'
            className='space-y-6'
          >
            <div className='grid gap-4 grid-cols-1 md:grid-cols-2'>
              {videoTutorials.map((video, i) => (
                <Card
                  key={i}
                  className='overflow-hidden'
                >
                  <div className='aspect-video bg-muted relative group'>
                    <div className='absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity'>
                      <Button
                        variant='secondary'
                        size='sm'
                        className='gap-1'
                      >
                        <Video className='h-4 w-4' />
                        Watch Video
                      </Button>
                    </div>
                    <div className='absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded'>
                      {video.duration}
                    </div>
                  </div>
                  <CardHeader className='pb-2'>
                    <CardTitle className='text-base'>{video.title}</CardTitle>
                    <CardDescription>{video.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className='pt-0'>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='gap-1'
                      asChild
                    >
                      <Link
                        href={`/dashboard/docs/videos/${video.title
                          .toLowerCase()
                          .replace(/\s+/g, '-')}`}
                      >
                        Watch Tutorial
                        <ChevronRight className='h-4 w-4' />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Featured Tutorial</CardTitle>
                <CardDescription>
                  Learn how to use bulk license activation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='aspect-video bg-muted relative group'>
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <Button
                      variant='secondary'
                      size='lg'
                      className='gap-2'
                    >
                      <Video className='h-5 w-5' />
                      Watch Tutorial
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className='flex flex-col items-start gap-2'>
                <h3 className='font-medium'>Bulk License Activation</h3>
                <p className='text-sm text-muted-foreground'>
                  Learn how to activate multiple licenses at once, saving time
                  and streamlining your workflow.
                </p>
                <div className='flex items-center gap-4 mt-1'>
                  <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                    <Clock className='h-3 w-3' />
                    <span>10:45</span>
                  </div>
                  <div className='flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400'>
                    <Zap className='h-3 w-3' />
                    <span>New Feature</span>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
