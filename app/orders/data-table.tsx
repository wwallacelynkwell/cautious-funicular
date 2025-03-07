'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { config } from '@/app/api/database'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'date', desc: true }, // Default sort by date, newest first
  ])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    email: false, // Hide email column by default
    notes: true, // Show notes column by default
  })
  const [rowSelection, setRowSelection] = useState({})
  const searchParams = useSearchParams()
  const [todayOnly, setTodayOnly] = useState(false)

  // Apply URL filters to the table
  useEffect(() => {
    const customerParam = searchParams.get('customer')
    const searchParam = searchParams.get('search')
    const todayParam = searchParams.get('today')

    const newFilters: ColumnFiltersState = []

    if (customerParam) {
      newFilters.push({
        id: 'customer',
        value: customerParam,
      })
    }

    if (searchParam) {
      // Check if the search param looks like an order ID
      if (searchParam.startsWith('ORD-')) {
        newFilters.push({
          id: 'id',
          value: searchParam,
        })
      } else {
        // Otherwise, use it as a general search term
        newFilters.push({
          id: 'id',
          value: searchParam,
        })
      }
    }

    // Set today filter if it exists in URL
    if (todayParam === 'true') {
      setTodayOnly(true)
    }

    setColumnFilters(newFilters)
  }, [searchParams])

  // Custom filter function for today's orders
  const filterToday = (row: any) => {
    if (!todayOnly) return true

    const date = row.original.date
    return (
      date.getDate() === config.currentDate.getDate() &&
      date.getMonth() === config.currentDate.getMonth() &&
      date.getFullYear() === config.currentDate.getFullYear()
    )
  }

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    filterFns: {
      today: filterToday,
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  // Apply the "today only" filter
  const filteredRows = todayOnly
    ? table.getRowModel().rows.filter((row) => filterToday(row.original))
    : table.getRowModel().rows

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div className='flex flex-1 items-center space-x-2'>
          <Input
            placeholder='Filter by order ID...'
            value={(table.getColumn('id')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('id')?.setFilterValue(event.target.value)
            }
            className='max-w-sm'
          />
          <Button
            variant={todayOnly ? 'default' : 'outline'}
            size='sm'
            onClick={() => setTodayOnly(!todayOnly)}
            className={cn(
              'flex items-center',
              todayOnly && 'bg-blue-600 text-white hover:bg-blue-500'
            )}
          >
            <Clock className='h-4 w-4 mr-1.5' />
            Today's Orders
            {todayOnly && ' Only'}
          </Button>
        </div>
        <div className='flex items-center space-x-2'>
          <span className='text-sm text-muted-foreground'>
            {table.getFilteredRowModel().rows.length} orders found
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='outline'
                className='ml-auto'
              >
                Columns <ChevronDown className='ml-2 h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className='capitalize'
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {filteredRows.length ? (
              filteredRows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-between space-x-2'>
        <div className='flex-1 text-sm text-muted-foreground'>
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {todayOnly
            ? filteredRows.length
            : table.getFilteredRowModel().rows.length}{' '}
          row(s) selected.
        </div>
        <div className='flex items-center space-x-2'>
          <span className='text-sm text-muted-foreground'>
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </span>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
