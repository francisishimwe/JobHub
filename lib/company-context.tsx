"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { supabase } from "./supabase"
import type { Company } from "./types"

interface CompanyContextType {
  companies: Company[]
  addCompany: (company: Omit<Company, "id" | "createdDate">) => Promise<void>
  updateCompany: (id: string, company: Partial<Company>) => Promise<void>
  deleteCompany: (id: string) => Promise<void>
  getCompanyById: (id: string) => Company | undefined
  loading: boolean
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined)

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch companies from Supabase
  useEffect(() => {
    fetchCompanies()
    
    // Set up real-time subscription for company changes
    const subscription = supabase
      .channel('companies_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'companies' },
        () => {
          fetchCompanies()
        }
      )
      .subscribe()
    
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .order("created_date", { ascending: false })

      if (error) throw error

      const formattedCompanies: Company[] = (data || []).map((company) => ({
        id: company.id,
        name: company.name,
        logo: company.logo,
        createdDate: new Date(company.created_date),
      }))

      setCompanies(formattedCompanies)
    } catch (error) {
      console.error("Error fetching companies:", error)
    } finally {
      setLoading(false)
    }
  }

  const addCompany = async (company: Omit<Company, "id" | "createdDate">) => {
    try {
      const { data, error } = await supabase
        .from("companies")
        .insert([
          {
            name: company.name,
            logo: company.logo,
          },
        ])
        .select()
        .single()

      if (error) throw error

      const newCompany: Company = {
        id: data.id,
        name: data.name,
        logo: data.logo,
        createdDate: new Date(data.created_date),
      }

      setCompanies([newCompany, ...companies])
    } catch (error) {
      console.error("Error adding company:", error)
      throw error
    }
  }

  const updateCompany = async (id: string, updatedCompany: Partial<Company>) => {
    try {
      const { error } = await supabase
        .from("companies")
        .update({
          name: updatedCompany.name,
          logo: updatedCompany.logo,
        })
        .eq("id", id)

      if (error) throw error

      setCompanies(
        companies.map((company) =>
          company.id === id ? { ...company, ...updatedCompany } : company
        )
      )
    } catch (error) {
      console.error("Error updating company:", error)
      throw error
    }
  }

  const deleteCompany = async (id: string) => {
    try {
      const { error } = await supabase.from("companies").delete().eq("id", id)

      if (error) throw error

      setCompanies(companies.filter((company) => company.id !== id))
    } catch (error) {
      console.error("Error deleting company:", error)
      throw error
    }
  }

  const getCompanyById = (id: string) => {
    return companies.find((company) => company.id === id)
  }

  return (
    <CompanyContext.Provider
      value={{
        companies,
        addCompany,
        updateCompany,
        deleteCompany,
        getCompanyById,
        loading,
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