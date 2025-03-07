import { Metadata } from 'next'
import { Suspense } from 'react'
import { CustomersContent } from './customers-content'

export const metadata: Metadata = {
  title: 'Customers',
  description: 'Example customers page.',
}

export default function CustomersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CustomersContent />
    </Suspense>
  )
}
