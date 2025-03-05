import { LoginForm } from "@/components/login-form"
import { Logo } from "@/components/logo"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <Logo className="h-16 w-16" />
          <h1 className="mt-4 text-3xl font-bold">Reseller Portal</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Log in to manage software and warranty packages
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}

