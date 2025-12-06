"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "./supabase"

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
  console.log("Fetching inquiries from Supabase...")
  
  const { data, error } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Supabase error fetching inquiries:", error)
    console.error("Error details:", JSON.stringify(error, null, 2))
    // Don't throw, return empty array to prevent breaking the UI
    return []
  }

  if (!data) {
    console.log("No inquiries data returned from Supabase")
    return []
  }

  console.log("Fetched inquiries count:", data.length)
  console.log("Raw inquiry data:", data)

  return data.map((inquiry) => ({
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
    const insertData = {
      first_name: inquiry.firstName,
      last_name: inquiry.lastName,
      email: inquiry.email,
      phone: inquiry.phone || null,
      subject: inquiry.subject,
      message: inquiry.message,
      status: "new",
    }
    
    const { error } = await supabase
      .from("inquiries")
      .insert([insertData])

    if (error) {
      console.error("Supabase error adding inquiry:", error)
      throw error
    }

    // Invalidate and refetch
    queryClient.invalidateQueries({ queryKey: ['inquiries'] })
  }

  const deleteInquiry = async (id: string) => {
    const { error } = await supabase.from("inquiries").delete().eq("id", id)

    if (error) {
      console.error("Error deleting inquiry:", error)
      throw error
    }

    queryClient.invalidateQueries({ queryKey: ['inquiries'] })
  }

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from("inquiries")
      .update({ status: "read" })
      .eq("id", id)

    if (error) {
      console.error("Error marking inquiry as read:", error)
      throw error
    }

    queryClient.invalidateQueries({ queryKey: ['inquiries'] })
  }

  const markAsResolved = async (id: string) => {
    const { error } = await supabase
      .from("inquiries")
      .update({ status: "resolved" })
      .eq("id", id)

    if (error) {
      console.error("Error marking inquiry as resolved:", error)
      throw error
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
