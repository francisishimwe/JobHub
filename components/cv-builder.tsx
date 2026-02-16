"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CVPreview } from "@/components/cv-preview"
import { User, Mail, Phone, BookOpen, Briefcase, Award, Link, Download, Users, Globe, Calendar, MapPin, UserCircle } from "lucide-react"
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
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    // Personal Information
    full_name: "",
    email: "",
    phone: "",
    residence: "",
    birth_date: "",
    gender: "",
    fathers_name: "",
    mothers_name: "",
    place_of_birth: "",
    nationality: "",
    
    // Education
    university_degree: "",
    university_graduation: "",
    secondary_degree: "",
    secondary_graduation: "",
    
    // Experience
    experience_level: "",
    current_position: "",
    years_experience: "",
    current_employer: "",
    
    // Language Proficiency
    kinyarwanda_reading: "",
    kinyarwanda_writing: "",
    kinyarwanda_speaking: "",
    english_reading: "",
    english_writing: "",
    english_speaking: "",
    french_reading: "",
    french_writing: "",
    french_speaking: "",
    other_reading: "",
    other_writing: "",
    other_speaking: "",
    
    // Referees
    referee_name: "",
    referee_phone: "",
    referee_email: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      generatePDF()
      setIsSubmitted(true)
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const generatePDF = () => {
    const doc = new jsPDF()
    
    // Title - Centered and Bold
    doc.setFontSize(20)
    doc.setFont(undefined, 'bold')
    doc.text(formData.full_name.toUpperCase(), 105, 20, { align: 'center' })
    
    // Contact Information - Centered
    doc.setFontSize(12)
    doc.setFont(undefined, 'normal')
    doc.text(formData.email, 105, 30, { align: 'center' })
    doc.text(formData.phone, 105, 37, { align: 'center' })
    doc.text(formData.nationality, 105, 44, { align: 'center' })
    
    // Personal Information Section
    doc.setFontSize(14)
    doc.setFont(undefined, 'bold')
    doc.text('Personal Information', 20, 60)
    
    doc.setFontSize(11)
    doc.setFont(undefined, 'normal')
    let yPos = 70
    doc.text(`Birth Date: ${formData.birth_date}`, 20, yPos)
    yPos += 7
    doc.text(`Gender: ${formData.gender}`, 20, yPos)
    yPos += 7
    doc.text(`Father's Name: ${formData.fathers_name}`, 20, yPos)
    yPos += 7
    doc.text(`Residence: ${formData.residence}`, 20, yPos)
    yPos += 7
    doc.text(`Place of Birth: ${formData.place_of_birth}`, 20, yPos)
    yPos += 7
    doc.text(`Nationality: ${formData.nationality}`, 20, yPos)
    yPos += 7
    doc.text(`Mother's Name: ${formData.mothers_name}`, 20, yPos)
    
    // Education Section
    yPos += 15
    doc.setFontSize(14)
    doc.setFont(undefined, 'bold')
    doc.text('Education', 20, yPos)
    
    doc.setFontSize(11)
    doc.setFont(undefined, 'normal')
    yPos += 10
    doc.text(`${formData.university_degree} - ${formData.university_graduation}`, 20, yPos)
    yPos += 7
    doc.text(`${formData.secondary_degree} - ${formData.secondary_graduation}`, 20, yPos)
    
    // Experience Section
    yPos += 15
    doc.setFontSize(14)
    doc.setFont(undefined, 'bold')
    doc.text('Experience', 20, yPos)
    
    doc.setFontSize(11)
    doc.setFont(undefined, 'normal')
    yPos += 10
    doc.text(`${formData.experience_level} with ${formData.years_experience} years of experience`, 20, yPos)
    yPos += 7
    doc.text(`Current role: ${formData.current_position}`, 20, yPos)
    
    // Language Proficiency Section
    yPos += 15
    doc.setFontSize(14)
    doc.setFont(undefined, 'bold')
    doc.text('Language Proficiency', 20, yPos)
    
    doc.setFontSize(11)
    doc.setFont(undefined, 'normal')
    yPos += 10
    
    // Kinyarwanda
    doc.setFont(undefined, 'bold')
    doc.text('Kinyarwanda:', 20, yPos)
    doc.setFont(undefined, 'normal')
    yPos += 7
    doc.text(`Reading: ${formData.kinyarwanda_reading}, Writing: ${formData.kinyarwanda_writing}, Speaking: ${formData.kinyarwanda_speaking}`, 25, yPos)
    
    // English
    yPos += 7
    doc.setFont(undefined, 'bold')
    doc.text('English:', 20, yPos)
    doc.setFont(undefined, 'normal')
    yPos += 7
    doc.text(`Reading: ${formData.english_reading}, Writing: ${formData.english_writing}, Speaking: ${formData.english_speaking}`, 25, yPos)
    
    // French
    yPos += 7
    doc.setFont(undefined, 'bold')
    doc.text('French:', 20, yPos)
    doc.setFont(undefined, 'normal')
    yPos += 7
    doc.text(`Reading: ${formData.french_reading}, Writing: ${formData.french_writing}, Speaking: ${formData.french_speaking}`, 25, yPos)
    
    // Other
    yPos += 7
    doc.setFont(undefined, 'bold')
    doc.text('Other:', 20, yPos)
    doc.setFont(undefined, 'normal')
    yPos += 7
    doc.text(`Reading: ${formData.other_reading}, Writing: ${formData.other_writing}, Speaking: ${formData.other_speaking}`, 25, yPos)
    
    // Referees Section
    yPos += 15
    doc.setFontSize(14)
    doc.setFont(undefined, 'bold')
    doc.text('Referees', 20, yPos)
    
    doc.setFontSize(11)
    doc.setFont(undefined, 'normal')
    yPos += 10
    doc.text(formData.referee_name, 20, yPos)
    yPos += 7
    doc.text(`Contact: ${formData.referee_phone}, ${formData.referee_email}`, 20, yPos)
    
    // Save PDF
    doc.save(`${formData.full_name.replace(/\s+/g, '_')}_CV.pdf`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-screen h-screen max-w-none max-h-none p-0">
        <DialogHeader className="p-6 border-b">
          <DialogTitle className="text-2xl font-bold text-center">CURRICULUM VITAE (CV)</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col lg:flex-row h-[calc(100vh-88px)] gap-6 overflow-hidden p-6">
          {/* Form Section - Left Side */}
          <div className="flex-1 overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-6 pr-4">
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
                  placeholder="Ishimwe francis"
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
                  placeholder="ishimwefrancis2018@gmail.com"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+250789298623"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality *</Label>
                <Input
                  id="nationality"
                  required
                  value={formData.nationality}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                  placeholder="Rwanda"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="birth_date">Birth Date</Label>
                <Input
                  id="birth_date"
                  type="date"
                  value={formData.birth_date}
                  onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                  placeholder="2007-02-02"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Input
                  id="gender"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  placeholder="Male"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fathers_name">Father's Name</Label>
                <Input
                  id="fathers_name"
                  value={formData.fathers_name}
                  onChange={(e) => setFormData({ ...formData, fathers_name: e.target.value })}
                  placeholder="Harindintwari Salomon"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mothers_name">Mother's Name</Label>
                <Input
                  id="mothers_name"
                  value={formData.mothers_name}
                  onChange={(e) => setFormData({ ...formData, mothers_name: e.target.value })}
                  placeholder="Nyirabhindi Immacule"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="residence">Residence</Label>
                <Input
                  id="residence"
                  value={formData.residence}
                  onChange={(e) => setFormData({ ...formData, residence: e.target.value })}
                  placeholder="Mukeke, Nyarubona, Nyamirambo, Nyarugenge"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="place_of_birth">Place of Birth</Label>
                <Input
                  id="place_of_birth"
                  value={formData.place_of_birth}
                  onChange={(e) => setFormData({ ...formData, place_of_birth: e.target.value })}
                  placeholder="Nyamasheke"
                />
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Education
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="university_degree">University Degree</Label>
                  <Input
                    id="university_degree"
                    value={formData.university_degree}
                    onChange={(e) => setFormData({ ...formData, university_degree: e.target.value })}
                    placeholder="Bachelor's in Economics with Education"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="university_graduation">Graduation Year</Label>
                  <Input
                    id="university_graduation"
                    value={formData.university_graduation}
                    onChange={(e) => setFormData({ ...formData, university_graduation: e.target.value })}
                    placeholder="2023"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="secondary_degree">Secondary Education</Label>
                  <Input
                    id="secondary_degree"
                    value={formData.secondary_degree}
                    onChange={(e) => setFormData({ ...formData, secondary_degree: e.target.value })}
                    placeholder="A2 in Mathematics_Economics"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="secondary_graduation">Graduation Year</Label>
                  <Input
                    id="secondary_graduation"
                    value={formData.secondary_graduation}
                    onChange={(e) => setFormData({ ...formData, secondary_graduation: e.target.value })}
                    placeholder="2018"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Experience */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Experience
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="experience_level">Experience Level</Label>
                <Input
                  id="experience_level"
                  value={formData.experience_level}
                  onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                  placeholder="Junior"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="years_experience">Years of Experience</Label>
                <Input
                  id="years_experience"
                  value={formData.years_experience}
                  onChange={(e) => setFormData({ ...formData, years_experience: e.target.value })}
                  placeholder="3"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="current_position">Current Position</Label>
                <Input
                  id="current_position"
                  value={formData.current_position}
                  onChange={(e) => setFormData({ ...formData, current_position: e.target.value })}
                  placeholder="Teacher"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="current_employer">Current Employer</Label>
              <Input
                id="current_employer"
                value={formData.current_employer}
                onChange={(e) => setFormData({ ...formData, current_employer: e.target.value })}
                placeholder="G.S MUGOZI"
              />
            </div>
          </div>

          {/* Language Proficiency */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Language Proficiency
            </h3>
            
            <div className="space-y-4">
              {/* Kinyarwanda */}
              <div>
                <h4 className="font-medium mb-2">Kinyarwanda</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="kinyarwanda_reading">Reading</Label>
                    <select 
                      id="kinyarwanda_reading"
                      value={formData.kinyarwanda_reading}
                      onChange={(e) => setFormData({ ...formData, kinyarwanda_reading: e.target.value })}
                      className="w-full h-10 px-3 border border-gray-300 rounded-md"
                    >
                      <option value="">Select</option>
                      <option value="Excellent">Excellent</option>
                      <option value="Very Good">Very Good</option>
                      <option value="Good">Good</option>
                      <option value="Basic">Basic</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="kinyarwanda_writing">Writing</Label>
                    <select 
                      id="kinyarwanda_writing"
                      value={formData.kinyarwanda_writing}
                      onChange={(e) => setFormData({ ...formData, kinyarwanda_writing: e.target.value })}
                      className="w-full h-10 px-3 border border-gray-300 rounded-md"
                    >
                      <option value="">Select</option>
                      <option value="Excellent">Excellent</option>
                      <option value="Very Good">Very Good</option>
                      <option value="Good">Good</option>
                      <option value="Basic">Basic</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="kinyarwanda_speaking">Speaking</Label>
                    <select 
                      id="kinyarwanda_speaking"
                      value={formData.kinyarwanda_speaking}
                      onChange={(e) => setFormData({ ...formData, kinyarwanda_speaking: e.target.value })}
                      className="w-full h-10 px-3 border border-gray-300 rounded-md"
                    >
                      <option value="">Select</option>
                      <option value="Excellent">Excellent</option>
                      <option value="Very Good">Very Good</option>
                      <option value="Good">Good</option>
                      <option value="Basic">Basic</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* English */}
              <div>
                <h4 className="font-medium mb-2">English</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="english_reading">Reading</Label>
                    <select 
                      id="english_reading"
                      value={formData.english_reading}
                      onChange={(e) => setFormData({ ...formData, english_reading: e.target.value })}
                      className="w-full h-10 px-3 border border-gray-300 rounded-md"
                    >
                      <option value="">Select</option>
                      <option value="Excellent">Excellent</option>
                      <option value="Very Good">Very Good</option>
                      <option value="Good">Good</option>
                      <option value="Basic">Basic</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="english_writing">Writing</Label>
                    <select 
                      id="english_writing"
                      value={formData.english_writing}
                      onChange={(e) => setFormData({ ...formData, english_writing: e.target.value })}
                      className="w-full h-10 px-3 border border-gray-300 rounded-md"
                    >
                      <option value="">Select</option>
                      <option value="Excellent">Excellent</option>
                      <option value="Very Good">Very Good</option>
                      <option value="Good">Good</option>
                      <option value="Basic">Basic</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="english_speaking">Speaking</Label>
                    <select 
                      id="english_speaking"
                      value={formData.english_speaking}
                      onChange={(e) => setFormData({ ...formData, english_speaking: e.target.value })}
                      className="w-full h-10 px-3 border border-gray-300 rounded-md"
                    >
                      <option value="">Select</option>
                      <option value="Excellent">Excellent</option>
                      <option value="Very Good">Very Good</option>
                      <option value="Good">Good</option>
                      <option value="Basic">Basic</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* French */}
              <div>
                <h4 className="font-medium mb-2">French</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="french_reading">Reading</Label>
                    <select 
                      id="french_reading"
                      value={formData.french_reading}
                      onChange={(e) => setFormData({ ...formData, french_reading: e.target.value })}
                      className="w-full h-10 px-3 border border-gray-300 rounded-md"
                    >
                      <option value="">Select</option>
                      <option value="Excellent">Excellent</option>
                      <option value="Very Good">Very Good</option>
                      <option value="Good">Good</option>
                      <option value="Basic">Basic</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="french_writing">Writing</Label>
                    <select 
                      id="french_writing"
                      value={formData.french_writing}
                      onChange={(e) => setFormData({ ...formData, french_writing: e.target.value })}
                      className="w-full h-10 px-3 border border-gray-300 rounded-md"
                    >
                      <option value="">Select</option>
                      <option value="Excellent">Excellent</option>
                      <option value="Very Good">Very Good</option>
                      <option value="Good">Good</option>
                      <option value="Basic">Basic</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="french_speaking">Speaking</Label>
                    <select 
                      id="french_speaking"
                      value={formData.french_speaking}
                      onChange={(e) => setFormData({ ...formData, french_speaking: e.target.value })}
                      className="w-full h-10 px-3 border border-gray-300 rounded-md"
                    >
                      <option value="">Select</option>
                      <option value="Excellent">Excellent</option>
                      <option value="Very Good">Very Good</option>
                      <option value="Good">Good</option>
                      <option value="Basic">Basic</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Other */}
              <div>
                <h4 className="font-medium mb-2">Other</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="other_reading">Reading</Label>
                    <select 
                      id="other_reading"
                      value={formData.other_reading}
                      onChange={(e) => setFormData({ ...formData, other_reading: e.target.value })}
                      className="w-full h-10 px-3 border border-gray-300 rounded-md"
                    >
                      <option value="">Select</option>
                      <option value="Excellent">Excellent</option>
                      <option value="Very Good">Very Good</option>
                      <option value="Good">Good</option>
                      <option value="Basic">Basic</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="other_writing">Writing</Label>
                    <select 
                      id="other_writing"
                      value={formData.other_writing}
                      onChange={(e) => setFormData({ ...formData, other_writing: e.target.value })}
                      className="w-full h-10 px-3 border border-gray-300 rounded-md"
                    >
                      <option value="">Select</option>
                      <option value="Excellent">Excellent</option>
                      <option value="Very Good">Very Good</option>
                      <option value="Good">Good</option>
                      <option value="Basic">Basic</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="other_speaking">Speaking</Label>
                    <select 
                      id="other_speaking"
                      value={formData.other_speaking}
                      onChange={(e) => setFormData({ ...formData, other_speaking: e.target.value })}
                      className="w-full h-10 px-3 border border-gray-300 rounded-md"
                    >
                      <option value="">Select</option>
                      <option value="Excellent">Excellent</option>
                      <option value="Very Good">Very Good</option>
                      <option value="Good">Good</option>
                      <option value="Basic">Basic</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Referees */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-5 w-5" />
              Referees
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="referee_name">Referee Name</Label>
                <Input
                  id="referee_name"
                  value={formData.referee_name}
                  onChange={(e) => setFormData({ ...formData, referee_name: e.target.value })}
                  placeholder="Ishimwe francis"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="referee_phone">Phone</Label>
                  <Input
                    id="referee_phone"
                    value={formData.referee_phone}
                    onChange={(e) => setFormData({ ...formData, referee_phone: e.target.value })}
                    placeholder="+250789298623"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="referee_email">Email</Label>
                  <Input
                    id="referee_email"
                    type="email"
                    value={formData.referee_email}
                    onChange={(e) => setFormData({ ...formData, referee_email: e.target.value })}
                    placeholder="ishimwefrancis2018@gmail.com"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between gap-3 pt-4 border-t">
            {isSubmitted && (
              <Button
                type="button"
                variant="outline"
                onClick={generatePDF}
                className="gap-2 border-red-600 text-red-600 hover:bg-red-50"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            )}
            
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
                {loading ? "Downloading..." : "DOWNLOAD YOUR CV"}
              </Button>
            </div>
          </div>
            </form>
          </div>
          
          {/* Preview Section - Right Side */}
          <div className="flex-1 lg:border-l border-gray-200 pl-4 overflow-hidden">
            <div className="h-full overflow-y-auto">
              <div className="sticky top-0 bg-white p-3 border-b border-gray-200 mb-4 rounded-t-lg">
                <h3 className="text-lg font-semibold text-center">Live Preview</h3>
                <p className="text-sm text-gray-600 text-center">See how your CV will look</p>
              </div>
              <div className="bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden" style={{ minHeight: 'calc(100% - 80px)' }}>
                <CVPreview formData={formData} />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
