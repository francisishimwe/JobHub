"use client"

import { createContext, useContext, useEffect, type ReactNode } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "./supabase"
import type { Company } from "./types"

interface CompanyContextType {
  companies: Company[]
  isLoading: boolean
  addCompany: (company: Omit<Company, "id" | "createdDate">) => Promise<void>
  updateCompany: (id: string, company: Partial<Company>) => Promise<void>
  deleteCompany: (id: string) => Promise<void>
  getCompanyById: (id: string) => Company | undefined
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined)

// Fetch companies function
const fetchCompanies = async (): Promise<Company[]> => {
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .order("created_date", { ascending: false })

  if (error) throw error

  return (data || []).map((company) => ({
    id: company.id,
    name: company.name,
    logo: company.logo,
    createdDate: new Date(company.created_date),
  }))
}

export function CompanyProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()

  // Use React Query for companies with caching
  const { data: companies = [], isLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: fetchCompanies,
    staleTime: 0, // Always fetch fresh
    gcTime: 1 * 60 * 1000, // 1 minute cache
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  })

  // Set up real-time subscription
  useEffect(() => {
    const subscription = supabase
      .channel('companies_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'companies' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['companies'] })
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [queryClient])

  const addCompany = async (company: Omit<Company, "id" | "createdDate">) => {
    const { error } = await supabase
      .from("companies")
      .insert([{
        name: company.name,
        logo: company.logo,
      }])

    if (error) throw error

    queryClient.invalidateQueries({ queryKey: ['companies'] })
  }

  const updateCompany = async (id: string, updatedCompany: Partial<Company>) => {
    const { error } = await supabase
      .from("companies")
      .update({
        name: updatedCompany.name,
        logo: updatedCompany.logo,
      })
      .eq("id", id)

    if (error) throw error

    queryClient.invalidateQueries({ queryKey: ['companies'] })
  }

  const deleteCompany = async (id: string) => {
    const { error } = await supabase.from("companies").delete().eq("id", id)

    if (error) throw error

    queryClient.invalidateQueries({ queryKey: ['companies'] })
  }

  const getCompanyById = (id: string) => {
    return companies.find((company) => company.id === id)
  }

  return (
    <CompanyContext.Provider
      value={{
        companies,
        isLoading,
        addCompany,
        updateCompany,
        deleteCompany,
        getCompanyById,
      }}
    >
      {children}
    </CompanyContext.Provider>
  )
}

export function useCompanies() {
  const context = useContext(CompanyContext)
  if (context === undefined) {
    throw new Error("useCompanies must be used within a CompanyProvider")
  }
  return context
}