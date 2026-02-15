"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { User, Mail, Phone, BookOpen, Briefcase, Award, Link, Download, Users } from "lucide-react"
import jsPDF from 'jspdf'

interface CVBuilderProps {
  jobId: string
  jobTitle: string
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function CVBuilder({ jobId, jobTitle, isOpen, onClose, onSuccess }: CVBuilderProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    field_of_study: "",
    experience: "",
    skills: "",
    education: "",
    portfolio_url: "",
    linkedin_url: "",
    github_url: "",
    additional_info: "",
    referee_name: "",
    referee_position: "",
    referee_organization: "",
    referee_email: "",
    referee_phone: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/cv-profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          job_id: jobId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit CV profile')
      }

      alert('CV profile submitted successfully!')
      onSuccess?.()
      onClose()
      
      // Reset form
      setFormData({
        full_name: "",
        email: "",
        phone: "",
        field_of_study: "",
        experience: "",
        skills: "",
        education: "",
        portfolio_url: "",
        linkedin_url: "",
        github_url: "",
        additional_info: "",
        referee_name: "",
        referee_position: "",
        referee_organization: "",
        referee_email: "",
        referee_phone: "",
      })
    } catch (error) {
      console.error('Error submitting CV:', error)
      alert('Failed to submit CV. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const generatePDF = () => {
    const doc = new jsPDF()
    
    // Add title
    doc.setFontSize(20)
    doc.text('Curriculum Vitae', 105, 20, { align: 'center' })
    
    // Add personal information
    doc.setFontSize(14)
    doc.text('Personal Information', 20, 40)
    doc.setFontSize(11)
    doc.text(`Name: ${formData.full_name}`, 20, 50)
    doc.text(`Email: ${formData.email}`, 20, 60)
    doc.text(`Phone: ${formData.phone}`, 20, 70)
    
    // Add field of study
    doc.setFontSize(14)
    doc.text('Field of Study', 20, 90)
    doc.setFontSize(11)
    doc.text(formData.field_of_study, 20, 100)
    
    // Add experience
    doc.setFontSize(14)
    doc.text('Experience', 20, 120)
    doc.setFontSize(11)
    const experienceLines = doc.splitTextToSize(formData.experience, 170)
    doc.text(experienceLines, 20, 130)
    
    // Add skills
    doc.setFontSize(14)
    doc.text('Skills', 20, 160)
    doc.setFontSize(11)
    const skillsLines = doc.splitTextToSize(formData.skills, 170)
    doc.text(skillsLines, 20, 170)
    
    // Add education
    doc.setFontSize(14)
    doc.text('Education', 20, 200)
    doc.setFontSize(11)
    const educationLines = doc.splitTextToSize(formData.education, 170)
    doc.text(educationLines, 20, 210)
    
    // Add referee information
    doc.setFontSize(14)
    doc.text('Referee Information', 20, 240)
    doc.setFontSize(11)
    doc.text(`Name: ${formData.referee_name}`, 20, 250)
    doc.text(`Position: ${formData.referee_position}`, 20, 260)
    doc.text(`Organization: ${formData.referee_organization}`, 20, 270)
    doc.text(`Email: ${formData.referee_email}`, 20, 280)
    doc.text(`Phone: ${formData.referee_phone}`, 20, 290)
    
    // Save PDF
    doc.save(`${formData.full_name.replace(/\s+/g, '_')}_CV.pdf`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Apply for: {jobTitle}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+250 788 123 456"
              />
            </div>
          </div>

          {/* Academic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Academic Information
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="field_of_study">Field of Study *</Label>
              <Input
                id="field_of_study"
                required
                value={formData.field_of_study}
                onChange={(e) => setFormData({ ...formData, field_of_study: e.target.value })}
                placeholder="Computer Science, Business Administration, etc."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="education">Education</Label>
              <Textarea
                id="education"
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                placeholder="Bachelor's degree in Computer Science from University of Rwanda (2020-2024)"
                rows={3}
              />
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Professional Information
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="experience">Work Experience</Label>
              <Textarea
                id="experience"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder="2 years of software development experience at Tech Company..."
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="skills">Skills *</Label>
              <Textarea
                id="skills"
                required
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                placeholder="JavaScript, React, Node.js, Python, Project Management..."
                rows={3}
              />
            </div>
          </div>

          {/* Online Presence */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Link className="h-5 w-5" />
              Online Presence
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="portfolio_url">Portfolio URL</Label>
                <Input
                  id="portfolio_url"
                  type="url"
                  value={formData.portfolio_url}
                  onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
                  placeholder="https://yourportfolio.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                <Input
                  id="linkedin_url"
                  type="url"
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="github_url">GitHub URL</Label>
              <Input
                id="github_url"
                type="url"
                value={formData.github_url}
                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                placeholder="https://github.com/yourusername"
              />
            </div>
          </div>

          {/* Referee Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-5 w-5" />
              Referee Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="referee_name">Referee Name</Label>
                <Input
                  id="referee_name"
                  value={formData.referee_name}
                  onChange={(e) => setFormData({ ...formData, referee_name: e.target.value })}
                  placeholder="Dr. John Smith"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="referee_position">Position/Title</Label>
                <Input
                  id="referee_position"
                  value={formData.referee_position}
                  onChange={(e) => setFormData({ ...formData, referee_position: e.target.value })}
                  placeholder="Senior Manager, CEO, etc."
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="referee_organization">Organization</Label>
              <Input
                id="referee_organization"
                value={formData.referee_organization}
                onChange={(e) => setFormData({ ...formData, referee_organization: e.target.value })}
                placeholder="Company Name, University, etc."
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="referee_email">Email Address</Label>
                <Input
                  id="referee_email"
                  type="email"
                  value={formData.referee_email}
                  onChange={(e) => setFormData({ ...formData, referee_email: e.target.value })}
                  placeholder="referee@example.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="referee_phone">Phone Number</Label>
                <Input
                  id="referee_phone"
                  value={formData.referee_phone}
                  onChange={(e) => setFormData({ ...formData, referee_phone: e.target.value })}
                  placeholder="+250 788 123 456"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-2">
            <Label htmlFor="additional_info">Additional Information</Label>
            <Textarea
              id="additional_info"
              value={formData.additional_info}
              onChange={(e) => setFormData({ ...formData, additional_info: e.target.value })}
              placeholder="Any additional information you'd like to share..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-between gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={generatePDF}
              className="gap-2 border-red-600 text-red-600 hover:bg-red-50"
              disabled={!formData.full_name || !formData.email}
            >
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
            
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="text-black hover:opacity-90"
                style={{ backgroundColor: '#76c893' }}
              >
                {loading ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
