import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminSettings } from "@/components/admin-settings"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Settings</h1>
        <p className="text-muted-foreground">Configure portal settings and preferences</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Portal Settings</CardTitle>
          <CardDescription>Manage global settings for the reseller portal</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminSettings />
        </CardContent>
      </Card>
    </div>
  )
}

