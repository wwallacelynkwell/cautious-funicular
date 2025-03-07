import { Metadata } from 'next'
import { Suspense } from 'react'
import { OrdersContent } from './orders-content'

export const metadata: Metadata = {
  title: 'Orders',
  description: 'Example orders page.',
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrdersContent />
    </Suspense>
  )
}
