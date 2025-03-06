"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"

export function AdminSettings() {
  const [portalName, setPortalName] = useState("License Activation Portal")
  const [supportEmail, setSupportEmail] = useState("support@example.com")
  const [allowRegistration, setAllowRegistration] = useState(true)
  const [requireApproval, setRequireApproval] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real app, this would call an API to update settings
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Settings Updated",
        description: "Portal settings have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="portal-name">Portal Name</Label>
        <Input id="portal-name" value={portalName} onChange={(e) => setPortalName(e.target.value)} required />
        <p className="text-sm text-muted-foreground">
          This name will be displayed in the header and emails sent to users.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="support-email">Support Email</Label>
        <Input
          id="support-email"
          type="email"
          value={supportEmail}
          onChange={(e) => setSupportEmail(e.target.value)}
          required
        />
        <p className="text-sm text-muted-foreground">
          This email will be used for support inquiries and will be displayed to users.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Registration Settings</h3>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="allow-registration">Allow Registration</Label>
            <p className="text-sm text-muted-foreground">When enabled, invited users can register for an account.</p>
          </div>
          <Switch id="allow-registration" checked={allowRegistration} onCheckedChange={setAllowRegistration} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="require-approval">Require Approval</Label>
            <p className="text-sm text-muted-foreground">
              When enabled, new registrations require admin approval before activation.
            </p>
          </div>
          <Switch id="require-approval" checked={requireApproval} onCheckedChange={setRequireApproval} />
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Settings"}
      </Button>
    </form>
  )
}

