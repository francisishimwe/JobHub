"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, X, Clock, User, Plus } from "lucide-react"

interface MembershipUser {
  id: string
  full_name: string
  phone_number: string
  is_approved: boolean
  expires_at: string
  created_at: string
}

export function AdminRoadRulesDashboard() {
  const [users, setUsers] = useState<MembershipUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [extensionDays, setExtensionDays] = useState<string>("10")

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/membership-users")
      const data = await response.json()
      
      if (data.success) {
        setUsers(data.users || [])
      } else {
        setError(data.message || "Ikibazo kubona abantu")
      }
    } catch (err) {
      setError("Ikibazo gikomeye serivisi")
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (userId: string, days: string = "10") => {
    try {
      const response = await fetch("/api/approve-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          extensionDays: parseInt(days)
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        await fetchUsers() // Refresh the list
        setSelectedUser(null)
      } else {
        setError(data.message || "Ikibazo kuri kugirango")
      }
    } catch (err) {
      setError("Ikibazo gikomeye serivisi")
    }
  }

  const handleDelete = async (userId: string) => {
    if (!confirm("Weweze ukwishya gusiba uyu muri iyi uruhushya?")) {
      return
    }

    try {
      const response = await fetch("/api/delete-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      })

      const data = await response.json()
      
      if (data.success) {
        await fetchUsers() // Refresh the list
        setSelectedUser(null)
      } else {
        setError(data.message || "Ikibazo kuri gusiba")
      }
    } catch (err) {
      setError("Ikibazo gikomeye serivisi")
    }
  }

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date()
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Ubufatanye bwa Abanyamizi ba Iga Amategeko
          </h1>
          <p className="text-slate-600 mb-6">
            Kugirango abanyamizi bari kugira ngo uburenganzira no kuzamura.
          </p>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Abanyamizi Bari Kugirango Uburenganzira
            </h2>
            
            <div className="mb-4">
              <Label htmlFor="extension">Kongera iminsi (igihe)</Label>
              <div className="flex gap-2 items-center">
                <Input
                  id="extension"
                  type="number"
                  value={extensionDays}
                  onChange={(e) => setExtensionDays(e.target.value)}
                  placeholder="10"
                  className="w-32"
                  min="1"
                  max="365"
                />
                <span className="text-sm text-slate-600">iminsi</span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="text-left p-3 font-semibold text-slate-900 border-b">Amazina</th>
                    <th className="text-left p-3 font-semibold text-slate-900 border-b">Nomero ya Telefone</th>
                    <th className="text-left p-3 font-semibold text-slate-900 border-b">Leta</th>
                    <th className="text-left p-3 font-semibold text-slate-900 border-b">Ubufatanye</th>
                    <th className="text-left p-3 font-semibold text-slate-900 border-b">Imisi</th>
                    <th className="text-left p-3 font-semibold text-slate-900 border-b">Ibikorwa</th>
                    <th className="text-center p-3 font-semibold text-slate-900 border-b">Igikorwa</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-slate-50">
                      <td className="p-3">{user.full_name}</td>
                      <td className="p-3">{user.phone_number}</td>
                      <td className="p-3">{new Date(user.created_at).toLocaleDateString('rw-RW')}</td>
                      <td className="p-3">
                        {isExpired(user.expires_at) ? (
                          <Badge variant="destructive">Yarabuze</Badge>
                        ) : (
                          <Badge variant="default">Kiri</Badge>
                        )}
                      </td>
                      <td className="p-3">{new Date(user.expires_at).toLocaleDateString('rw-RW')}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {user.is_approved ? (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Yemewe
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <Clock className="h-3 w-3 mr-1" />
                              Isubizwe
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          {!user.is_approved && (
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => setSelectedUser(user.id)}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Kongera
                            </Button>
                          )}
                          {selectedUser === user.id && (
                            <div className="flex gap-2">
                              <Input
                                type="number"
                                value={extensionDays}
                                onChange={(e) => setExtensionDays(e.target.value)}
                                placeholder="10"
                                className="w-20 h-8"
                                min="1"
                                max="365"
                              />
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => handleApprove(user.id, extensionDays)}
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Emeza
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDelete(user.id)}
                              >
                                <X className="h-3 w-3" />
                                Gusiba
                              </Button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
