"use client"

import { useState } from "react"
import { useInquiries } from "@/lib/inquiry-context"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Trash2, Eye, CheckCircle2, Mail } from "lucide-react"
import type { Inquiry } from "@/lib/inquiry-context"

export function InquiryList() {
  const { inquiries, deleteInquiry, markAsRead, markAsResolved } = useInquiries()
  const [inquiryToDelete, setInquiryToDelete] = useState<string | null>(null)
  const [inquiryToView, setInquiryToView] = useState<Inquiry | null>(null)

  const handleDelete = () => {
    if (inquiryToDelete) {
      deleteInquiry(inquiryToDelete)
      setInquiryToDelete(null)
    }
  }

  const handleView = async (inquiry: Inquiry) => {
    setInquiryToView(inquiry)
    if (inquiry.status === "new") {
      await markAsRead(inquiry.id)
    }
  }

  const handleMarkResolved = async (id: string) => {
    await markAsResolved(id)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-500"
      case "read":
        return "bg-yellow-500"
      case "resolved":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <>
      <div className="rounded-lg border bg-card max-w-full">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Status</TableHead>
                <TableHead className="w-[150px]">Name</TableHead>
                <TableHead className="w-[180px]">Email</TableHead>
                <TableHead className="w-[120px]">Phone</TableHead>
                <TableHead className="w-[200px]">Subject</TableHead>
                <TableHead className="w-[130px]">Date</TableHead>
                <TableHead className="text-right w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No inquiries received yet.
                  </TableCell>
                </TableRow>
              ) : (
                inquiries.map((inquiry) => (
                  <TableRow key={inquiry.id}>
                    <TableCell>
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(inquiry.status)}`} title={inquiry.status} />
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="truncate" title={`${inquiry.firstName} ${inquiry.lastName}`}>
                        {inquiry.firstName} {inquiry.lastName}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[180px]">
                      <div className="truncate" title={inquiry.email}>{inquiry.email}</div>
                    </TableCell>
                    <TableCell className="text-sm">{inquiry.phone || "N/A"}</TableCell>
                    <TableCell className="max-w-[200px]">
                      <div className="truncate" title={inquiry.subject}>{inquiry.subject}</div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(inquiry.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleView(inquiry)}
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {inquiry.status !== "resolved" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-green-600 hover:text-green-700"
                            onClick={() => handleMarkResolved(inquiry.id)}
                            title="Mark as resolved"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => setInquiryToDelete(inquiry.id)}
                          title="Delete inquiry"
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

      {/* View Inquiry Dialog */}
      {inquiryToView && (
        <Dialog open={!!inquiryToView} onOpenChange={(open) => !open && setInquiryToView(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Inquiry Details
              </DialogTitle>
              <DialogDescription>
                Received on {formatDate(inquiryToView.createdAt)}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">Name</label>
                  <p className="text-base mt-1">
                    {inquiryToView.firstName} {inquiryToView.lastName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <Badge variant="secondary" className="capitalize">
                      {inquiryToView.status}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">Email</label>
                  <p className="text-base mt-1">{inquiryToView.email}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">Phone</label>
                  <p className="text-base mt-1">{inquiryToView.phone || "Not provided"}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-muted-foreground">Subject</label>
                <p className="text-base mt-1">{inquiryToView.subject}</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-muted-foreground">Message</label>
                <p className="text-base mt-1 whitespace-pre-wrap bg-muted p-4 rounded-md">
                  {inquiryToView.message}
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => window.open(`mailto:${inquiryToView.email}?subject=Re: ${inquiryToView.subject}`)}
                  className="gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Reply via Email
                </Button>
                {inquiryToView.status !== "resolved" && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleMarkResolved(inquiryToView.id)
                      setInquiryToView(null)
                    }}
                    className="gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Mark as Resolved
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!inquiryToDelete} onOpenChange={() => setInquiryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the inquiry.
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
