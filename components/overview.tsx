'use client'

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { getVisibleOrders } from '@/app/api/database'
import { useEffect, useState } from 'react'

export function Overview() {
  const [data, setData] = useState<{ name: string; total: number }[]>([])

  useEffect(() => {
    // Get orders from the last 7 days
    const orders = getVisibleOrders()
    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Create a map for the last 7 days
    const dailyTotals = new Map()
    for (let i = 0; i < 7; i++) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
      dailyTotals.set(dayName, 0)
    }

    // Calculate daily totals
    orders.forEach((order) => {
      const orderDate = new Date(order.date)
      if (orderDate >= sevenDaysAgo) {
        const dayName = orderDate.toLocaleDateString('en-US', {
          weekday: 'short',
        })
        const currentTotal = dailyTotals.get(dayName) || 0
        dailyTotals.set(dayName, currentTotal + order.amount)
      }
    })

    // Convert map to array and reverse to show oldest to newest
    const chartData = Array.from(dailyTotals.entries())
      .map(([name, total]) => ({
        name,
        total: Number(total.toFixed(2)),
      }))
      .reverse()

    setData(chartData)
  }, [])

  return (
    <ResponsiveContainer
      width='100%'
      height={350}
    >
      <BarChart data={data}>
        <XAxis
          dataKey='name'
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Bar
          dataKey='total'
          fill='currentColor'
          radius={[4, 4, 0, 0]}
          className='fill-primary'
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
