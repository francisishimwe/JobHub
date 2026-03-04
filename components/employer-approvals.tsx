"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Building, 
  Mail, 
  Calendar,
  Search,
  Filter,
  Eye,
  MessageSquare
} from "lucide-react"

interface Employer {
  id: number
  companyName: string
  email: string
  plan: string
  selectedPlan: any
  registrationDate: string
  status: 'pending' | 'approved' | 'rejected'
}

export function EmployerApprovals() {
  const [employers, setEmployers] = useState<Employer[]>([])
  const [filteredEmployers, setFilteredEmployers] = useState<Employer[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadEmployers()
  }, [])

  useEffect(() => {
    filterEmployers()
  }, [employers, searchTerm, statusFilter])

  const loadEmployers = () => {
    // Load from localStorage
    const pendingEmployers = JSON.parse(localStorage.getItem('pendingEmployers') || '[]')
    setEmployers(pendingEmployers)
  }

  const filterEmployers = () => {
    let filtered = employers

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(employer => 
        employer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employer.plan.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(employer => employer.status === statusFilter)
    }

    setFilteredEmployers(filtered)
  }

  const handleApprove = (employerId: number) => {
    setLoading(true)
    
    // Update employer status
    const updatedEmployers = employers.map(employer => {
      if (employer.id === employerId) {
        const updatedEmployer = { ...employer, status: 'approved' as const }
        
        console.log('🔍 Approving employer:', employer.email)
        
        // Update employer data in localStorage (both formats)
        const storedEmployerData = localStorage.getItem('employerData')
        const storedEmployer = localStorage.getItem('employer')
        
        console.log('📦 Current storage:', {
          employerData: storedEmployerData,
          employer: storedEmployer
        })
        
        // Update employerData format
        if (storedEmployerData) {
          const employerData = JSON.parse(storedEmployerData)
          if (employerData.email === employer.email) {
            const updatedData = {
              ...employerData,
              status: 'approved'
            }
            localStorage.setItem('employerData', JSON.stringify(updatedData))
            console.log('✅ Updated employerData:', updatedData)
          }
        }
        
        // Update employer format
        if (storedEmployer) {
          const employerData = JSON.parse(storedEmployer)
          if (employerData.email === employer.email) {
            const updatedData = {
              ...employerData,
              status: 'approved'
            }
            localStorage.setItem('employer', JSON.stringify(updatedData))
            console.log('✅ Updated employer:', updatedData)
          }
        }
        
        // If neither exists, create new employerData entry
        if (!storedEmployerData && !storedEmployer) {
          const newEmployerData = {
            companyName: employer.companyName,
            email: employer.email,
            plan: { name: employer.plan },
            status: 'approved',
            createdAt: new Date().toISOString()
          }
          localStorage.setItem('employerData', JSON.stringify(newEmployerData))
          console.log('✅ Created new employerData:', newEmployerData)
        }
        
        return updatedEmployer
      }
      return employer
    })
    
    setEmployers(updatedEmployers)
    localStorage.setItem('pendingEmployers', JSON.stringify(updatedEmployers))
    
    setTimeout(() => {
      setLoading(false)
      alert('Employer approved successfully!')
    }, 500)
  }

  const handleReject = (employerId: number) => {
    const reason = prompt('Please provide a reason for rejection (optional):')
    
    setLoading(true)
    
    // Update employer status
    const updatedEmployers = employers.map(employer => {
      if (employer.id === employerId) {
        const updatedEmployer = { ...employer, status: 'rejected' as const }
        
        // Update employer data in localStorage (both formats)
        const storedEmployerData = localStorage.getItem('employerData')
        if (storedEmployerData) {
          const employerData = JSON.parse(storedEmployerData)
          if (employerData.email === employer.email) {
            localStorage.setItem('employerData', JSON.stringify({
              ...employerData,
              status: 'rejected'
            }))
          }
        }
        
        const storedEmployer = localStorage.getItem('employer')
        if (storedEmployer) {
          const employerData = JSON.parse(storedEmployer)
          if (employerData.email === employer.email) {
            localStorage.setItem('employer', JSON.stringify({
              ...employerData,
              status: 'rejected'
            }))
          }
        }
        
        return updatedEmployer
      }
      return employer
    })
    
    setEmployers(updatedEmployers)
    localStorage.setItem('pendingEmployers', JSON.stringify(updatedEmployers))
    
    setTimeout(() => {
      setLoading(false)
      alert('Employer rejected successfully!')
    }, 500)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const stats = {
    total: employers.length,
    pending: employers.filter(e => e.status === 'pending').length,
    approved: employers.filter(e => e.status === 'approved').length,
    rejected: employers.filter(e => e.status === 'rejected').length
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-gray-600">Total Employers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.approved}</p>
                <p className="text-sm text-gray-600">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <XCircle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{stats.rejected}</p>
                <p className="text-sm text-gray-600">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Employer Approvals
          </CardTitle>
          <CardDescription>
            Manage employer account approvals and rejections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by company name, email, or plan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("all")}
              >
                All ({stats.total})
              </Button>
              <Button
                variant={statusFilter === "pending" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("pending")}
              >
                Pending ({stats.pending})
              </Button>
              <Button
                variant={statusFilter === "approved" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("approved")}
              >
                Approved ({stats.approved})
              </Button>
              <Button
                variant={statusFilter === "rejected" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("rejected")}
              >
                Rejected ({stats.rejected})
              </Button>
            </div>
          </div>

          {/* Employers List */}
          <div className="space-y-4">
            {filteredEmployers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No employers found</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            ) : (
              filteredEmployers.map((employer) => (
                <Card key={employer.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Building className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{employer.companyName}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail className="h-3 w-3" />
                              {employer.email}
                            </div>
                          </div>
                          <Badge className={getStatusColor(employer.status)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(employer.status)}
                              {employer.status.charAt(0).toUpperCase() + employer.status.slice(1)}
                            </div>
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">Plan:</span>
                            <span className="font-medium">{employer.plan}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            <span className="text-gray-500">Applied:</span>
                            <span>{formatDate(employer.registrationDate)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">Price:</span>
                            <span className="font-medium">{employer.selectedPlan?.price || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                      
                      {employer.status === 'pending' && (
                        <div className="flex gap-2 ml-4">
                          <Button
                            onClick={() => handleApprove(employer.id)}
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700"
                            size="sm"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleReject(employer.id)}
                            disabled={loading}
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                      
                      {employer.status === 'approved' && (
                        <div className="flex gap-2 ml-4">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View Profile
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Contact
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
