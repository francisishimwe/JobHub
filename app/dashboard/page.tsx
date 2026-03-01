"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { JobList } from "@/components/job-list"
import { ExamList } from "@/components/exam-list"
import { InquiryList } from "@/components/inquiry-list"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { PendingApprovals } from "@/components/pending-approvals"
import { LoginForm } from "@/components/login-form"
import { Button } from "@/components/ui/button"
import { Plus, BriefcaseBusiness, GraduationCap, BarChart3, MessageSquare, CheckCircle2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("pending")

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <LoginForm onSuccess={() => { }} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8 bg-white">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Manage your job postings, exams, and view analytics</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <TabsList>
              <TabsTrigger value="pending" className="gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Pending Approvals
              </TabsTrigger>
              <TabsTrigger value="jobs" className="gap-2">
                <BriefcaseBusiness className="h-4 w-4" />
                Jobs
              </TabsTrigger>
              <TabsTrigger value="exams" className="gap-2">
                <GraduationCap className="h-4 w-4" />
                Exams
              </TabsTrigger>
              <TabsTrigger value="inquiries" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Inquiries
              </TabsTrigger>
              <TabsTrigger value="analytics" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            {activeTab === "jobs" && (
              <Button
                className="gap-2 text-black hover:opacity-90"
                style={{ backgroundColor: '#76c893' }}
                onClick={() => router.push("/dashboard/add-job")}
              >
                <Plus className="h-4 w-4" />
                Add New Job
              </Button>
            )}

            {activeTab === "exams" && (
              <Button
                className="gap-2 text-black hover:opacity-90"
                style={{ backgroundColor: '#76c893' }}
                onClick={() => router.push("/dashboard/add-exam")}
              >
                <Plus className="h-4 w-4" />
                Add New Exam
              </Button>
            )}
          </div>

          <TabsContent value="pending" className="space-y-6">
            <PendingApprovals />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="jobs" className="space-y-6">
            <JobList />
          </TabsContent>

          <TabsContent value="exams" className="space-y-6">
            <ExamList />
          </TabsContent>

          <TabsContent value="inquiries" className="space-y-6">
            <InquiryList />
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}
