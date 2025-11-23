"use client"

import { useState } from "react"
import { useJobs } from "@/lib/job-context"
import { useCompanies } from "@/lib/company-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { EditJobDialog } from "@/components/edit-job-dialog"
import { Pencil, Trash2, BadgeCheck } from "lucide-react"
import type { Job } from "@/lib/types"

export function JobList() {
  const { jobs, deleteJob } = useJobs()
  const { getCompanyById } = useCompanies()
  const [jobToDelete, setJobToDelete] = useState<string | null>(null)
  const [jobToEdit, setJobToEdit] = useState<Job | null>(null)

  const handleDelete = () => {
    if (jobToDelete) {
      deleteJob(jobToDelete)
      setJobToDelete(null)
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Title</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Posted</TableHead>
              <TableHead>Applicants</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  No jobs posted yet. Click "Add New Job" to get started.
                </TableCell>
              </TableRow>
            ) : (
              jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {job.title}
                    </div>
                  </TableCell>
                  <TableCell>{getCompanyById(job.companyId)?.name || "Unknown Company"}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{job.jobType}</Badge>
                  </TableCell>
                  <TableCell>{job.experienceLevel}</TableCell>
                  <TableCell>
                    {job.deadline ? formatDate(new Date(job.deadline)) : "No deadline"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(job.postedDate)}</TableCell>
                  <TableCell>{job.applicants}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setJobToEdit(job)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
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

      {jobToEdit && (
        <EditJobDialog
          job={jobToEdit}
          open={!!jobToEdit}
          onOpenChange={(open) => !open && setJobToEdit(null)}
        />
      )}

      <AlertDialog open={!!jobToDelete} onOpenChange={() => setJobToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the job posting.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
