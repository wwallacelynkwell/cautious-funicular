import { RegisterForm } from "@/components/register-form"
import { Logo } from "@/components/logo"
import { Suspense } from "react"

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <Logo className="h-16 w-16" />
          <h1 className="mt-4 text-3xl font-bold">Create Your Account</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Complete your registration to access the reseller portal
          </p>
        </div>
        <Suspense fallback={<div className="text-center">Loading registration form...</div>}>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  )
}

