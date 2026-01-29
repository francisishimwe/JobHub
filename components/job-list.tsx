'use client'

import { useState } from 'react'
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
  const { filteredJobs, jobs, deleteJob, isLoading } = useJobs()
  const { getCompanyById } = useCompanies()
  const [jobToDelete, setJobToDelete] = useState<string | null>(null)
  const [jobToEdit, setJobToEdit] = useState<Job | null>(null)

  // Use filteredJobs if available, otherwise fallback to the raw jobs array
  const displayJobs = filteredJobs.length > 0 ? filteredJobs : jobs

  const formatDate = (date: any) => {
    if (!date) return "N/A";
    try {
      return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    } catch {
      return "Invalid Date";
    }
  }

  return (
    <div className="rounded-lg border bg-card max-w-full">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Job Title</TableHead>
              <TableHead className="w-[150px]">Company</TableHead>
              <TableHead className="w-[120px]">Type</TableHead>
              <TableHead className="w-[120px]">Deadline</TableHead>
              <TableHead className="text-right w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">Searching database...</TableCell>
              </TableRow>
            ) : displayJobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  No jobs found. (Check console for "Mapped" status)
                </TableCell>
              </TableRow>
            ) : (
              displayJobs.map((job, index) => (
                <TableRow key={job.id || index}>
                  <TableCell className="font-medium truncate max-w-[200px]">
                    {job.title || "Untitled Position"}
                  </TableCell>
                  <TableCell className="truncate max-w-[150px]">
                    {getCompanyById(job.companyId || job.company_id || "")?.name || "Rwanda Partner"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {job.jobType || job.job_type || "Full-time"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDate(job.deadline)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setJobToEdit(job)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive" 
                        onClick={() => setJobToDelete(job.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}