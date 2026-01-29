'use client'

import { useState, useEffect } from 'react'
import { useJobs } from '@/lib/job-context'
import { useCompanies } from '@/lib/company-context'
import { Job } from '@/lib/types'
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'

export function JobList() {
  const { filteredJobs, deleteJob, isLoading, jobs } = useJobs()
  const { getCompanyById } = useCompanies()
  const [jobToDelete, setJobToDelete] = useState<string | null>(null)
  const [jobToEdit, setJobToEdit] = useState<Job | null>(null)

  // Debug: Log job data
  useEffect(() => {
    if (jobs.length > 0) {
      console.log(`📊 JobList: ${jobs.length} total jobs, ${filteredJobs.length} filtered`)
      console.log('Sample job:', jobs[0])
    } else if (!isLoading) {
      console.warn('⚠ No jobs available')
    }
  }, [jobs, filteredJobs, isLoading])

  const handleDelete = () => {
    if (jobToDelete) {
      deleteJob(jobToDelete)
      setJobToDelete(null)
    }
  }

  const formatDate = (date: any) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <>
      <div className="rounded-lg border bg-card max-w-full">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Job Title</TableHead>
                <TableHead className="w-[120px]">Company</TableHead>
                <TableHead className="w-[100px]">Type</TableHead>
                <TableHead className="w-[100px]">Deadline</TableHead>
                <TableHead className="w-[90px]">Posted</TableHead>
                <TableHead className="text-right w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* We check both filteredJobs and the main jobs array as a backup */}
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10">Searching database...</TableCell>
                </TableRow>
              ) : (filteredJobs.length > 0 ? filteredJobs : jobs).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10">
                    No jobs found. (Debug: API returned data, but mapping might be failing)
                  </TableCell>
                </TableRow>
              ) : (
                (filteredJobs.length > 0 ? filteredJobs : jobs).map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">
                      {job.title || "Untitled Job"}
                    </TableCell>
                    <TableCell>
                      {job.company?.name || "Rwanda Partner"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{job.jobType || job.job_type || "Full-time"}</Badge>
                    </TableCell>
                    <TableCell>
                      {job.deadline ? new Date(job.deadline).toLocaleDateString() : "No deadline"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setJobToEdit(job)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setJobToDelete(job.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      {/* ... Rest of your Dialog and Alert code remains the same ... */}
    </>
  )
}