"use client"

import type React from "react"
import { useState } from "react"
import { useCompanies } from "@/lib/company-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Upload, X, Building2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface AddCompanyFormProps {
  onSuccess?: () => void
}

export function AddCompanyForm({ onSuccess }: AddCompanyFormProps) {
  const { addCompany } = useCompanies()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    description: "",
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Create a preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setImagePreview(result)
        setFormData({ ...formData, logo: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImagePreview("")
    setFormData({ ...formData, logo: "" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      alert("Please enter a company name")
      return
    }

    setLoading(true)
    try {
      await addCompany({
        name: formData.name,
        logo: formData.logo || "/placeholder.svg?height=40&width=40",
      })

      alert("Company added successfully!")

      // Reset form
      setFormData({
        name: "",
        logo: "",
        description: "",
      })
      setImagePreview("")
      setOpen(false)
      onSuccess?.()
    } catch (error) {
      console.error("Error adding company:", error)
      alert("Failed to add company. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Company
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Company</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Image Upload Section */}
          <div className="space-y-3">
            <Label>Company Logo</Label>
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={imagePreview || formData.logo} alt="Company logo" />
                <AvatarFallback>
                  <Building2 className="h-10 w-10 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-2">
                {!imagePreview ? (
                  <div>
                    <Input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <Label
                      htmlFor="logo-upload"
                      className="flex items-center justify-center gap-2 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer transition-colors"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Image
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG or GIF (max. 2MB)
                    </p>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveImage}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Remove Image
                  </Button>
                )}
              </div>
            </div>

            {/* Or use URL */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or use URL</span>
              </div>
            </div>

            <Input
              id="company-logo-url"
              value={formData.logo}
              onChange={(e) => {
                setFormData({ ...formData, logo: e.target.value })
                setImagePreview(e.target.value)
              }}
              placeholder="https://example.com/logo.png"
            />
          </div>

          {/* Company Name */}
          <div className="space-y-2">
            <Label htmlFor="company-name">Company Name *</Label>
            <Input
              id="company-name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Acme Corporation"
            />
          </div>

          {/* Company Description */}
          <div className="space-y-2">
            <Label htmlFor="company-description">Short Description</Label>
            <Textarea
              id="company-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description about the company..."
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Optional: Add a brief description (not stored in database yet)
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Company"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}