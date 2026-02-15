"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AddJobForm } from "@/components/add-job-form"
import { LoginForm } from "@/components/login-form"
import { ErrorBoundary } from "@/components/error-boundary"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AddJobPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  if (!isAuthenticated) {
    return <LoginForm onSuccess={() => {}} />
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            className="mb-6 gap-2"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Add New Job</h1>
            <p className="text-muted-foreground">
              Fill in the details below to post a new job listing
            </p>
          </div>

          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <ErrorBoundary>
              <AddJobForm onSuccess={() => router.push("/dashboard")} />
            </ErrorBoundary>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
