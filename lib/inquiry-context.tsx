"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"

export interface Inquiry {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  subject: string
  message: string
  status: "new" | "read" | "resolved"
  createdAt: Date
}

interface InquiryContextType {
  inquiries: Inquiry[]
  isLoading: boolean
  addInquiry: (inquiry: Omit<Inquiry, "id" | "createdAt" | "status">) => Promise<void>
  deleteInquiry: (id: string) => Promise<void>
  markAsRead: (id: string) => Promise<void>
  markAsResolved: (id: string) => Promise<void>
}

const InquiryContext = createContext<InquiryContextType | undefined>(undefined)

// Fetch inquiries function
const fetchInquiries = async (): Promise<Inquiry[]> => {
  console.log("Fetching inquiries from API...")
  
  try {
    const response = await fetch('/api/inquiries')
    const data = await response.json()

    if (!response.ok) {
      console.error("API error fetching inquiries:", data)
      return []
    }

    if (!data.inquiries) {
      console.log("No inquiries data returned")
      return []
    }

    console.log("Fetched inquiries count:", data.inquiries.length)

    return data.inquiries.map((inquiry: any) => ({
      id: inquiry.id,
      firstName: inquiry.first_name,
      lastName: inquiry.last_name,
      email: inquiry.email,
      phone: inquiry.phone,
      subject: inquiry.subject,
      message: inquiry.message,
      status: inquiry.status || "new",
      createdAt: new Date(inquiry.created_at),
    }))
  } catch (error) {
    console.error("Error fetching inquiries:", error)
    return []
  }
}

export function InquiryProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()

  // Use React Query for inquiries with caching
  const { data: inquiries = [], isLoading } = useQuery({
    queryKey: ['inquiries'],
    queryFn: fetchInquiries,
    staleTime: 0, // Always fetch fresh
    gcTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  })

  const addInquiry = async (inquiry: Omit<Inquiry, "id" | "createdAt" | "status">) => {
    const response = await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: inquiry.firstName,
        lastName: inquiry.lastName,
        email: inquiry.email,
        phone: inquiry.phone || null,
        subject: inquiry.subject,
        message: inquiry.message,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("API error adding inquiry:", error)
      throw new Error(error.error || 'Failed to add inquiry')
    }

    // Invalidate and refetch
    queryClient.invalidateQueries({ queryKey: ['inquiries'] })
  }

  const deleteInquiry = async (id: string) => {
    const response = await fetch(`/api/inquiries?id=${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("Error deleting inquiry:", error)
      throw new Error(error.error || 'Failed to delete inquiry')
    }

    queryClient.invalidateQueries({ queryKey: ['inquiries'] })
  }

  const markAsRead = async (id: string) => {
    const response = await fetch(`/api/inquiries?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'read' }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("Error marking inquiry as read:", error)
      throw new Error(error.error || 'Failed to update inquiry')
    }

    queryClient.invalidateQueries({ queryKey: ['inquiries'] })
  }

  const markAsResolved = async (id: string) => {
    const response = await fetch(`/api/inquiries?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'resolved' }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("Error marking inquiry as resolved:", error)
      throw new Error(error.error || 'Failed to update inquiry')
    }

    queryClient.invalidateQueries({ queryKey: ['inquiries'] })
  }

  return (
    <InquiryContext.Provider
      value={{
        inquiries,
        isLoading,
        addInquiry,
        deleteInquiry,
        markAsRead,
        markAsResolved,
      }}
    >
      {children}
    </InquiryContext.Provider>
  )
}

export function useInquiries() {
  const context = useContext(InquiryContext)
  if (context === undefined) {
    throw new Error("useInquiries must be used within an InquiryProvider")
  }
  return context
}
