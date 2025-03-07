'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { MoreHorizontal, Eye, UserX } from 'lucide-react'
import { useAuth } from '@/lib/auth-provider'
import { Badge } from '@/components/ui/badge'

export function UsersTable() {
  const { getUsers } = useAuth()
  const users = getUsers()
  const [selectedUser, setSelectedUser] = useState<any | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const viewUserDetails = (user: any) => {
    setSelectedUser(user)
    setIsDialogOpen(true)
  }

  return (
    <>
      <div className='rounded-md border overflow-x-auto'>
        <Table className='min-w-[800px]'>
          <TableHeader>
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className='w-[80px]'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className='font-medium'>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge
                    variant={user.role === 'admin' ? 'default' : 'outline'}
                  >
                    {user.role === 'admin' ? 'Admin' : 'Reseller'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant='ghost'
                        size='icon'
                      >
                        <MoreHorizontal className='h-4 w-4' />
                        <span className='sr-only'>Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem onClick={() => viewUserDetails(user)}>
                        <Eye className='mr-2 h-4 w-4' />
                        View Details
                      </DropdownMenuItem>
                      {user.role !== 'admin' && (
                        <DropdownMenuItem className='text-destructive'>
                          <UserX className='mr-2 h-4 w-4' />
                          Deactivate User
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      >
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Complete information about this user
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    User ID
                  </p>
                  <p>{selectedUser.id}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Name
                  </p>
                  <p>{selectedUser.name}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Username
                  </p>
                  <p>{selectedUser.username}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Email
                  </p>
                  <p>{selectedUser.email}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Role
                  </p>
                  <Badge
                    variant={
                      selectedUser.role === 'admin' ? 'default' : 'outline'
                    }
                  >
                    {selectedUser.role === 'admin' ? 'Admin' : 'Reseller'}
                  </Badge>
                </div>
              </div>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Account Status
                </p>
                <Badge variant='success'>Active</Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
