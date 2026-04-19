"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Users, 
  Shield, 
  ShieldOff, 
  Calendar, 
  CheckCircle, 
  XCircle,
  Search,
  AlertCircle
} from "lucide-react"

interface User {
  id: string
  email: string
  name?: string
  role: string
  hasQuizAccess: boolean
  quizAccessExpiry?: string
  created_at: string
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/users')
      if (!response.ok) throw new Error('Failed to fetch users')
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
      setMessage({ type: 'error', text: 'Failed to load users' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Toggle quiz access for a user
  const toggleQuizAccess = async (userId: string, currentAccess: boolean) => {
    try {
      const response = await fetch('/api/admin/users/quiz-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          hasQuizAccess: !currentAccess,
          accessExpiry: !currentAccess ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null
        }),
      })

      if (!response.ok) throw new Error('Failed to update quiz access')

      // Update local state
      setUsers(users.map(user => 
        user.id === userId 
          ? { 
              ...user, 
              hasQuizAccess: !currentAccess,
              quizAccessExpiry: !currentAccess ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null
            }
          : user
      ))

      setMessage({ 
        type: 'success', 
        text: `Quiz access ${!currentAccess ? 'granted' : 'revoked'} successfully` 
      })
    } catch (error) {
      console.error('Error updating quiz access:', error)
      setMessage({ type: 'error', text: 'Failed to update quiz access' })
    }

    // Clear message after 3 seconds
    setTimeout(() => setMessage(null), 3000)
  }

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const getAccessStatusBadge = (user: User) => {
    if (user.hasQuizAccess && user.quizAccessExpiry) {
      const expiryDate = new Date(user.quizAccessExpiry)
      const isExpired = expiryDate < new Date()
      
      if (isExpired) {
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" />
            Expired
          </Badge>
        )
      } else {
        return (
          <Badge variant="default" className="gap-1 bg-green-600">
            <CheckCircle className="h-3 w-3" />
            Active
          </Badge>
        )
      }
    }
    
    return (
      <Badge variant="secondary" className="gap-1">
        <ShieldOff className="h-3 w-3" />
        No Access
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold">User Management</h2>
            <p className="text-muted-foreground">Manage user quiz access and permissions</p>
          </div>
        </div>
        <Button onClick={fetchUsers} variant="outline">
          Refresh
        </Button>
      </div>

      {/* Message Alert */}
      {message && (
        <Alert className={message.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className={message.type === 'error' ? 'text-red-800' : 'text-green-800'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      {/* Search */}
      <Card className="p-4">
        <div className="flex items-center gap-2 max-w-sm">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by email or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-0 focus-visible:ring-0"
          />
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Quiz Access</TableHead>
                <TableHead>Access Expiry</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      Loading users...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {searchTerm ? 'No users found matching your search.' : 'No users found.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.email}</div>
                        {user.name && (
                          <div className="text-sm text-muted-foreground">{user.name}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {getAccessStatusBadge(user)}
                    </TableCell>
                    <TableCell>
                      {user.quizAccessExpiry ? (
                        <div className="text-sm">
                          <div>{new Date(user.quizAccessExpiry).toLocaleDateString()}</div>
                          <div className="text-muted-foreground">
                            {new Date(user.quizAccessExpiry).toLocaleTimeString()}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`quiz-access-${user.id}`} className="sr-only">
                          Quiz Access
                        </Label>
                        <Switch
                          id={`quiz-access-${user.id}`}
                          checked={user.hasQuizAccess}
                          onCheckedChange={() => toggleQuizAccess(user.id, user.hasQuizAccess)}
                          disabled={user.role === 'admin'}
                        />
                        <span className="text-sm text-muted-foreground">
                          {user.hasQuizAccess ? (
                            <span className="flex items-center gap-1 text-green-600">
                              <Shield className="h-3 w-3" />
                              Enabled
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <ShieldOff className="h-3 w-3" />
                              Disabled
                            </span>
                          )}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Instructions */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">How Quiz Access Works:</p>
            <ul className="space-y-1 text-xs">
              <li>• Users pay 1000 Rwf to 0783074056 (ISHIMWE FRANCIS)</li>
              <li>• After payment confirmation, enable their access here</li>
              <li>• Access expires automatically after 30 days</li>
              <li>• Admin users cannot have their quiz access toggled</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
