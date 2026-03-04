"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Briefcase, Users, Eye, Calendar, Star, TrendingUp, Building2 } from "lucide-react"
import { AddJobForm } from "@/components/add-job-form"
import { useJobs } from "@/lib/job-context"
import { useAuth } from "@/lib/auth-context"

interface EmployerDashboardProps {
  employerData: {
    companyName: string
    email: string
    plan: any
    status: string
    createdAt: string
  }
}

export function EmployerDashboard({ employerData }: EmployerDashboardProps) {
  const [showJobForm, setShowJobForm] = useState(false)
  const [postedJobs, setPostedJobs] = useState<any[]>([])
  const { jobs } = useJobs()
  const { user } = useAuth()

  // Get employer's posted jobs
  useEffect(() => {
    if (jobs && employerData?.email) {
      const employerJobs = jobs.filter(job => 
        job.companyName === employerData.companyName ||
        job.company_name === employerData.companyName
      )
      setPostedJobs(employerJobs)
    }
  }, [jobs, employerData])

  const handleJobPosted = () => {
    setShowJobForm(false)
    // Jobs will be automatically updated via the job context
  }

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'featured': return Star
      case 'featured-plus': return TrendingUp
      default: return Briefcase
    }
  }

  const PlanIcon = getPlanIcon(employerData.plan?.id || 'featured')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Employer Dashboard</h1>
          <p className="text-slate-600">Manage your job postings and track performance</p>
        </div>

        {/* Plan Information Card */}
        <Card className="border-blue-200 bg-blue-50 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${employerData.plan?.color || 'from-blue-500 to-blue-600'} flex items-center justify-center`}>
                  {typeof PlanIcon === 'function' ? (
                    <PlanIcon className="w-8 h-8 text-white" />
                  ) : (
                    <Star className="w-8 h-8 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-blue-900">{employerData.plan?.name || 'Featured'}</h3>
                  <p className="text-blue-700 font-semibold">{employerData.plan?.price || '50,000 RWF'}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="bg-green-100 text-green-800">
                      {employerData.status}
                    </Badge>
                    <span className="text-sm text-blue-600">
                      Company: {employerData.companyName}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-600 mb-2">Member since</p>
                <p className="text-lg font-semibold text-blue-900">
                  {new Date(employerData.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Jobs Posted</p>
                  <p className="text-2xl font-bold text-slate-900">{postedJobs.length}</p>
                </div>
                <Briefcase className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Jobs</p>
                  <p className="text-2xl font-bold text-green-600">
                    {postedJobs.filter(job => job.status === 'active').length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Views</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {postedJobs.reduce((sum, job) => sum + (job.views || 0), 0)}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Applications</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {postedJobs.reduce((sum, job) => sum + (job.applications || 0), 0)}
                  </p>
                </div>
                <Users className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => setShowJobForm(true)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-6"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Job
          </Button>
        </div>

        {/* Posted Jobs Table */}
        {postedJobs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Your Posted Jobs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Job Title</th>
                      <th className="text-left py-3 px-4 font-semibold">Category</th>
                      <th className="text-left py-3 px-4 font-semibold">Posted Date</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 font-semibold">Views</th>
                      <th className="text-left py-3 px-4 font-semibold">Applications</th>
                    </tr>
                  </thead>
                  <tbody>
                    {postedJobs.map((job, index) => (
                      <tr key={job.id || index} className="border-b hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {job.companyLogo && (
                              <img 
                                src={job.companyLogo} 
                                alt={job.employerName}
                                className="w-6 h-6 rounded"
                              />
                            )}
                            <span className="font-medium">{job.title}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{job.category || 'N/A'}</Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600">
                          {new Date(job.createdAt || job.postedDate).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={
                            job.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }>
                            {job.status || 'Active'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600">
                          {job.views || 0}
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600">
                          {job.applications || 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {postedJobs.length === 0 && (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <Building2 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No Jobs Posted Yet</h3>
              <p className="text-slate-600 mb-6">
                Get started by posting your first job opportunity
              </p>
              <Button
                onClick={() => setShowJobForm(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Post Your First Job
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Job Form Dialog */}
        <Dialog open={showJobForm} onOpenChange={setShowJobForm}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Post New Job</DialogTitle>
            </DialogHeader>
            <AddJobForm onSuccess={handleJobPosted} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
