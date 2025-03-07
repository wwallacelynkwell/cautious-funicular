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
import { Textarea } from '@/components/ui/textarea'
import {
  HelpCircle,
  MessageSquare,
  Phone,
  Mail,
  Search,
  ChevronDown,
  ChevronUp,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Send,
} from 'lucide-react'
import Link from 'next/link'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useRouter, usePathname } from 'next/navigation'
import { faqCategories } from '@/app/api/database'

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [ticketSubject, setTicketSubject] = useState('')
  const [ticketDescription, setTicketDescription] = useState('')
  const [ticketCategory, setTicketCategory] = useState('')
  const [ticketPriority, setTicketPriority] = useState('')

  // Mock support tickets
  const supportTickets = [
    {
      id: 'TKT-001',
      subject: 'License activation failed',
      status: 'open',
      priority: 'high',
      created: '2 days ago',
      lastUpdate: '1 day ago',
    },
    {
      id: 'TKT-002',
      subject: 'Billing question',
      status: 'in-progress',
      priority: 'medium',
      created: '1 week ago',
      lastUpdate: '2 days ago',
    },
    {
      id: 'TKT-003',
      subject: 'Feature request',
      status: 'closed',
      priority: 'low',
      created: '2 weeks ago',
      lastUpdate: '1 week ago',
    },
  ]

  // Filter FAQs based on search query
  const filteredFaqs = searchQuery
    ? faqCategories
        .map((category) => ({
          title: category.title,
          items: category.items.filter(
            (item) =>
              item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.answer.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter((category) => category.items.length > 0)
    : []

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would submit the ticket to the backend
    alert('Support ticket submitted successfully!')
    setTicketSubject('')
    setTicketDescription('')
    setTicketCategory('')
    setTicketPriority('')
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return (
          <Badge
            variant='outline'
            className='bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400'
          >
            Open
          </Badge>
        )
      case 'in-progress':
        return (
          <Badge
            variant='outline'
            className='bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400'
          >
            In Progress
          </Badge>
        )
      case 'closed':
        return (
          <Badge
            variant='outline'
            className='bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400'
          >
            Closed
          </Badge>
        )
      default:
        return <Badge variant='outline'>{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return (
          <Badge
            variant='outline'
            className='bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400'
          >
            High
          </Badge>
        )
      case 'medium':
        return (
          <Badge
            variant='outline'
            className='bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400'
          >
            Medium
          </Badge>
        )
      case 'low':
        return (
          <Badge
            variant='outline'
            className='bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400'
          >
            Low
          </Badge>
        )
      default:
        return <Badge variant='outline'>{priority}</Badge>
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Help & Support</h1>
          <p className='text-muted-foreground'>
            Get help with your reseller portal
          </p>
        </div>
      </div>

      <div className='grid gap-6 grid-cols-1 md:grid-cols-3'>
        <Card className='md:col-span-2'>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>Find answers to common questions</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search FAQs...'
                className='pl-10'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {searchQuery ? (
              <div className='space-y-4'>
                {filteredFaqs.length > 0 ? (
                  filteredFaqs.map((category, i) => (
                    <div
                      key={i}
                      className='space-y-2'
                    >
                      <h3 className='font-medium'>{category.title}</h3>
                      <Accordion
                        type='single'
                        collapsible
                        className='w-full'
                      >
                        {category.items.map((item, j) => (
                          <AccordionItem
                            key={j}
                            value={`${i}-${j}`}
                          >
                            <AccordionTrigger className='text-sm font-normal'>
                              {item.question}
                            </AccordionTrigger>
                            <AccordionContent className='text-sm text-muted-foreground'>
                              {item.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  ))
                ) : (
                  <div className='text-center py-6 text-muted-foreground'>
                    No results found for "{searchQuery}"
                  </div>
                )}
              </div>
            ) : (
              <Tabs
                defaultValue='account'
                className='w-full'
              >
                <TabsList className='w-full'>
                  {faqCategories.map((category, i) => (
                    <TabsTrigger
                      key={i}
                      value={category.title.toLowerCase().replace(/\s+/g, '-')}
                      className='flex-1'
                    >
                      {category.title}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {faqCategories.map((category, i) => (
                  <TabsContent
                    key={i}
                    value={category.title.toLowerCase().replace(/\s+/g, '-')}
                  >
                    <Accordion
                      type='single'
                      collapsible
                      className='w-full'
                    >
                      {category.items.map((item, j) => (
                        <AccordionItem
                          key={j}
                          value={`${i}-${j}`}
                        >
                          <AccordionTrigger className='text-sm font-normal'>
                            {item.question}
                          </AccordionTrigger>
                          <AccordionContent className='text-sm text-muted-foreground'>
                            {item.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </CardContent>
          <CardFooter>
            <Button
              variant='outline'
              size='sm'
              asChild
            >
              <Link href='/dashboard/docs'>View Documentation</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
            <CardDescription>
              Get in touch with our support team
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center gap-3 p-3 rounded-lg bg-muted/50'>
              <div className='rounded-full bg-primary/10 p-2'>
                <Phone className='h-4 w-4 text-primary' />
              </div>
              <div>
                <h3 className='text-sm font-medium'>Phone Support</h3>
                <p className='text-xs text-muted-foreground'>
                  Available Mon-Fri, 9am-5pm
                </p>
                <p className='text-sm mt-1'>+1 (555) 123-4567</p>
              </div>
            </div>
            <div className='flex items-center gap-3 p-3 rounded-lg bg-muted/50'>
              <div className='rounded-full bg-primary/10 p-2'>
                <Mail className='h-4 w-4 text-primary' />
              </div>
              <div>
                <h3 className='text-sm font-medium'>Email Support</h3>
                <p className='text-xs text-muted-foreground'>
                  Response within 24 hours
                </p>
                <p className='text-sm mt-1'>support@example.com</p>
              </div>
            </div>
            <div className='flex items-center gap-3 p-3 rounded-lg bg-muted/50'>
              <div className='rounded-full bg-primary/10 p-2'>
                <MessageSquare className='h-4 w-4 text-primary' />
              </div>
              <div>
                <h3 className='text-sm font-medium'>Live Chat</h3>
                <p className='text-xs text-muted-foreground'>
                  Available Mon-Fri, 9am-5pm
                </p>
                <Button
                  variant='link'
                  size='sm'
                  className='h-auto p-0 mt-1'
                >
                  Start Chat
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-6 grid-cols-1 md:grid-cols-3'>
        <Card className='md:col-span-2'>
          <CardHeader>
            <CardTitle>Create Support Ticket</CardTitle>
            <CardDescription>Submit a new support request</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmitTicket}
              className='space-y-4'
            >
              <div className='space-y-2'>
                <label
                  htmlFor='subject'
                  className='text-sm font-medium'
                >
                  Subject
                </label>
                <Input
                  id='subject'
                  placeholder='Brief description of your issue'
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  required
                />
              </div>
              <div className='grid gap-4 grid-cols-1 sm:grid-cols-2'>
                <div className='space-y-2'>
                  <label
                    htmlFor='category'
                    className='text-sm font-medium'
                  >
                    Category
                  </label>
                  <Select
                    value={ticketCategory}
                    onValueChange={setTicketCategory}
                    required
                  >
                    <SelectTrigger id='category'>
                      <SelectValue placeholder='Select category' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='account'>Account Issues</SelectItem>
                      <SelectItem value='billing'>Billing Questions</SelectItem>
                      <SelectItem value='technical'>
                        Technical Support
                      </SelectItem>
                      <SelectItem value='feature'>Feature Request</SelectItem>
                      <SelectItem value='bug'>Bug Report</SelectItem>
                      <SelectItem value='other'>Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='space-y-2'>
                  <label
                    htmlFor='priority'
                    className='text-sm font-medium'
                  >
                    Priority
                  </label>
                  <Select
                    value={ticketPriority}
                    onValueChange={setTicketPriority}
                    required
                  >
                    <SelectTrigger id='priority'>
                      <SelectValue placeholder='Select priority' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='low'>Low</SelectItem>
                      <SelectItem value='medium'>Medium</SelectItem>
                      <SelectItem value='high'>High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className='space-y-2'>
                <label
                  htmlFor='description'
                  className='text-sm font-medium'
                >
                  Description
                </label>
                <Textarea
                  id='description'
                  placeholder='Please provide details about your issue'
                  rows={5}
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  required
                />
              </div>
              <div className='space-y-2'>
                <label
                  htmlFor='attachments'
                  className='text-sm font-medium'
                >
                  Attachments (optional)
                </label>
                <Input
                  id='attachments'
                  type='file'
                  multiple
                />
                <p className='text-xs text-muted-foreground'>
                  Max file size: 10MB. Supported formats: JPG, PNG, PDF
                </p>
              </div>
              <Button
                type='submit'
                className='w-full'
              >
                <Send className='mr-2 h-4 w-4' />
                Submit Ticket
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Support Tickets</CardTitle>
            <CardDescription>
              Track your existing support requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {supportTickets.length > 0 ? (
                supportTickets.map((ticket, i) => (
                  <div
                    key={i}
                    className='flex flex-col gap-2 p-3 rounded-lg border'
                  >
                    <div className='flex items-center justify-between'>
                      <div className='font-medium text-sm'>{ticket.id}</div>
                      {getStatusBadge(ticket.status)}
                    </div>
                    <div className='text-sm'>{ticket.subject}</div>
                    <div className='flex items-center justify-between text-xs text-muted-foreground'>
                      <div className='flex items-center gap-1'>
                        <Clock className='h-3 w-3' />
                        <span>Created {ticket.created}</span>
                      </div>
                      {getPriorityBadge(ticket.priority)}
                    </div>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='mt-1 h-7'
                      asChild
                    >
                      <Link href={`/dashboard/support/tickets/${ticket.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                ))
              ) : (
                <div className='text-center py-6 text-muted-foreground'>
                  No support tickets found
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant='outline'
              size='sm'
              className='w-full'
              asChild
            >
              <Link href='/dashboard/support/tickets'>View All Tickets</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
