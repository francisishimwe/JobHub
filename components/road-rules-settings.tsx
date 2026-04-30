"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Shield, 
  Clock, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Info
} from "lucide-react"

interface RoadRulesSettings {
  system_enabled: boolean
  default_access_days: number
  max_attempts_per_exam: number
  passing_score: number
  admin_contact_phone: string
  system_maintenance: boolean
  auto_expire_users: boolean
  notification_enabled: boolean
  exam_timeout_minutes: number
  welcome_message: string
  payment_instructions: string
}

export function RoadRulesSettings() {
  const [settings, setSettings] = useState<RoadRulesSettings>({
    system_enabled: true,
    default_access_days: 30,
    max_attempts_per_exam: 3,
    passing_score: 70,
    admin_contact_phone: "+250 783 074 056",
    system_maintenance: false,
    auto_expire_users: true,
    notification_enabled: true,
    exam_timeout_minutes: 20,
    welcome_message: "Murakaza neza kuri Rwanda Job Hub! Ushobora kugira ngo uburenganzira no kuzamura ibizamini by'amategeko.",
    payment_instructions: "Kugirango wemererwe gukora ano masuzumabumenyi, urasabwa kwishyura 1000 Rwf kuri (+250 783 074 056) ISHIMWE FRANCIS."
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/road-rules-settings")
      const data = await response.json()
      if (data.success) {
        setSettings(data.settings)
      } else {
        // If no settings exist, use defaults
        setSettings(settings)
      }
    } catch (err) {
      console.error("Failed to fetch settings:", err)
      // Use defaults on error
      setSettings(settings)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/road-rules-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      })

      const data = await response.json()
      if (data.success) {
        setSuccess("Igenamirongo ryahinduwe neza!")
      } else {
        setError(data.message || "Ikibazo muri iki gikorwa")
      }
    } catch (err) {
      console.error("Save settings error:", err)
      setError("Ikibazo gikomeye serivisi")
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof RoadRulesSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription className="text-green-800">
            {success}
          </AlertDescription>
        </Alert>
      )}

      {/* System Status */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="h-5 w-5 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-900">Imiterere y'Isanzuye</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="system_enabled" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Sistema yakiriye
              </Label>
              <Switch
                id="system_enabled"
                checked={settings.system_enabled}
                onCheckedChange={(checked) => handleInputChange("system_enabled", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="system_maintenance" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Ukwihangira
              </Label>
              <Switch
                id="system_maintenance"
                checked={settings.system_maintenance}
                onCheckedChange={(checked) => handleInputChange("system_maintenance", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="auto_expire_users" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Kwihangira abakoresha
              </Label>
              <Switch
                id="auto_expire_users"
                checked={settings.auto_expire_users}
                onCheckedChange={(checked) => handleInputChange("auto_expire_users", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="notification_enabled" className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                Amakuru yakiriye
              </Label>
              <Switch
                id="notification_enabled"
                checked={settings.notification_enabled}
                onCheckedChange={(checked) => handleInputChange("notification_enabled", checked)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="default_access_days">Iminota y'uburenganzira (igihe cya mbere)</Label>
              <Input
                id="default_access_days"
                type="number"
                value={settings.default_access_days}
                onChange={(e) => handleInputChange("default_access_days", parseInt(e.target.value))}
                min="1"
                max="365"
              />
            </div>

            <div>
              <Label htmlFor="max_attempts_per_exam">Ugereranyo rukurikira kuri ibizamini</Label>
              <Input
                id="max_attempts_per_exam"
                type="number"
                value={settings.max_attempts_per_exam}
                onChange={(e) => handleInputChange("max_attempts_per_exam", parseInt(e.target.value))}
                min="1"
                max="10"
              />
            </div>

            <div>
              <Label htmlFor="passing_score">Igisubizo cyiza (%)</Label>
              <Input
                id="passing_score"
                type="number"
                value={settings.passing_score}
                onChange={(e) => handleInputChange("passing_score", parseInt(e.target.value))}
                min="0"
                max="100"
              />
            </div>

            <div>
              <Label htmlFor="exam_timeout_minutes">Igihe cy'ibizamini (iminota)</Label>
              <Input
                id="exam_timeout_minutes"
                type="number"
                value={settings.exam_timeout_minutes}
                onChange={(e) => handleInputChange("exam_timeout_minutes", parseInt(e.target.value))}
                min="5"
                max="120"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Contact & Messages */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-green-600" />
          <h3 className="text-xl font-semibold text-gray-900">Ubufatanye n'Ubutumwa</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="admin_contact_phone">Telefoni ya Admin</Label>
            <Input
              id="admin_contact_phone"
              value={settings.admin_contact_phone}
              onChange={(e) => handleInputChange("admin_contact_phone", e.target.value)}
              placeholder="+250 783 074 056"
            />
          </div>

          <div>
            <Label htmlFor="welcome_message">Ubutumza bwo kwakira</Label>
            <Textarea
              id="welcome_message"
              value={settings.welcome_message}
              onChange={(e) => handleInputChange("welcome_message", e.target.value)}
              placeholder="Murakaza neza kuri Rwanda Job Hub!"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="payment_instructions">Amabwiriza y'ishyura</Label>
            <Textarea
              id="payment_instructions"
              value={settings.payment_instructions}
              onChange={(e) => handleInputChange("payment_instructions", e.target.value)}
              placeholder="Kugirango wemererwe gukora ano masuzumabumenyi..."
              rows={3}
            />
          </div>
        </div>
      </Card>

      {/* System Status Overview */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Info className="h-5 w-5 text-purple-600" />
          <h3 className="text-xl font-semibold text-gray-900">Imiterere y'Isanzuye</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <Badge variant={settings.system_enabled ? "default" : "secondary"}>
              {settings.system_enabled ? "Yakiriye" : "Yahagaritswe"}
            </Badge>
            <p className="text-sm text-gray-600 mt-1">Sistema</p>
          </div>
          
          <div className="text-center">
            <Badge variant={settings.system_maintenance ? "destructive" : "default"}>
              {settings.system_maintenance ? "Iri mu kwihangira" : "Iri ku gukora"}
            </Badge>
            <p className="text-sm text-gray-600 mt-1">Imikorere</p>
          </div>
          
          <div className="text-center">
            <Badge variant="outline">
              {settings.default_access_days} Iminota
            </Badge>
            <p className="text-sm text-gray-600 mt-1">Uburenganzira</p>
          </div>
          
          <div className="text-center">
            <Badge variant="outline">
              {settings.passing_score}%
            </Badge>
            <p className="text-sm text-gray-600 mt-1">Igisubizo cyiza</p>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Bikora..." : "Bika Igenamirongo"}
        </Button>
      </div>
    </div>
  )
}
