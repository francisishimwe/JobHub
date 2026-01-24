"use client"

import { createContext, useContext, useEffect, type ReactNode } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
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

// Fetch companies function using API
const fetchCompanies = async (): Promise<Company[]> => {
  const response = await fetch('/api/companies')
  
  if (!response.ok) {
    throw new Error('Failed to fetch companies')
  }

  const data = await response.json()

  return (data.companies || []).map((company: any) => ({
    id: company.id,
    name: company.name,
    logo: company.logo,
    createdDate: new Date(company.created_at),
  }))
}

export function CompanyProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()

  // Use React Query for companies with caching
  const { data: companies = [], isLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: fetchCompanies,
    staleTime: 5 * 60 * 1000, // 5 minutes fresh (companies change less frequently)
    gcTime: 30 * 60 * 1000, // 30 minutes cache
    refetchOnMount: false, // Don't refetch if fresh
    refetchOnWindowFocus: false, // Reduce background refetches
  })

  const addCompany = async (company: Omit<Company, "id" | "createdDate">) => {
    const response = await fetch('/api/companies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: company.name,
        logo: company.logo,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to add company')
    }

    queryClient.invalidateQueries({ queryKey: ['companies'] })
  }

  const updateCompany = async (id: string, updatedCompany: Partial<Company>) => {
    const response = await fetch('/api/companies', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        name: updatedCompany.name,
        logo: updatedCompany.logo,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update company')
    }

    queryClient.invalidateQueries({ queryKey: ['companies'] })
  }

  const deleteCompany = async (id: string) => {
    const response = await fetch(`/api/companies?id=${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to delete company')
    }

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