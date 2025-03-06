import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InviteForm } from "@/components/invite-form"
import { InvitesTable } from "@/components/invites-table"

export default function InvitePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Invite Users</h1>
        <p className="text-muted-foreground">Invite new resellers to join the portal</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Send Invitation</CardTitle>
          <CardDescription>Enter the email address of the person you want to invite</CardDescription>
        </CardHeader>
        <CardContent>
          <InviteForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pending Invitations</CardTitle>
          <CardDescription>A list of all pending invitations</CardDescription>
        </CardHeader>
        <CardContent>
          <InvitesTable />
        </CardContent>
      </Card>
    </div>
  )
}

