"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CVPreview } from "@/components/cv-preview"
import { User, Mail, Phone, BookOpen, Briefcase, Award, Link, Download, Users, Globe, Calendar, MapPin, UserCircle, ArrowLeft, Plus, X } from "lucide-react"
import jsPDF from 'jspdf'

interface CVBuilderFullscreenProps {
  jobId: string
  jobTitle: string
  onSuccess?: () => void
}

export function CVBuilderFullscreen({ jobId, jobTitle, onSuccess }: CVBuilderFullscreenProps) {
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
    
    // Dynamic arrays for additional entries
    additional_education: [{ degree: "", graduation_year: "", institution: "" }],
    additional_experience: [{ position: "", company: "", start_date: "", end_date: "", description: "" }],
    additional_languages: [{ name: "", reading: "", writing: "", speaking: "" }],
    additional_referees: [{ name: "", phone: "", email: "", relationship: "" }],
  })

  // Helper functions for dynamic arrays
  const addEducation = () => {
    setFormData({
      ...formData,
      additional_education: [...formData.additional_education, { degree: "", graduation_year: "", institution: "" }]
    })
  }

  const removeEducation = (index: number) => {
    setFormData({
      ...formData,
      additional_education: formData.additional_education.filter((_, i) => i !== index)
    })
  }

  const updateEducation = (index: number, field: string, value: string) => {
    const updatedEducation = [...formData.additional_education]
    updatedEducation[index] = { ...updatedEducation[index], [field]: value }
    setFormData({
      ...formData,
      additional_education: updatedEducation
    })
  }

  const addExperience = () => {
    setFormData({
      ...formData,
      additional_experience: [...formData.additional_experience, { position: "", company: "", start_date: "", end_date: "", description: "" }]
    })
  }

  const removeExperience = (index: number) => {
    setFormData({
      ...formData,
      additional_experience: formData.additional_experience.filter((_, i) => i !== index)
    })
  }

  const updateExperience = (index: number, field: string, value: string) => {
    const updatedExperience = [...formData.additional_experience]
    updatedExperience[index] = { ...updatedExperience[index], [field]: value }
    setFormData({
      ...formData,
      additional_experience: updatedExperience
    })
  }

  const addLanguage = () => {
    setFormData({
      ...formData,
      additional_languages: [...formData.additional_languages, { name: "", reading: "", writing: "", speaking: "" }]
    })
  }

  const removeLanguage = (index: number) => {
    setFormData({
      ...formData,
      additional_languages: formData.additional_languages.filter((_, i) => i !== index)
    })
  }

  const updateLanguage = (index: number, field: string, value: string) => {
    const updatedLanguages = [...formData.additional_languages]
    updatedLanguages[index] = { ...updatedLanguages[index], [field]: value }
    setFormData({
      ...formData,
      additional_languages: updatedLanguages
    })
  }

  const addReferee = () => {
    setFormData({
      ...formData,
      additional_referees: [...formData.additional_referees, { name: "", phone: "", email: "", relationship: "" }]
    })
  }

  const removeReferee = (index: number) => {
    setFormData({
      ...formData,
      additional_referees: formData.additional_referees.filter((_, i) => i !== index)
    })
  }

  const updateReferee = (index: number, field: string, value: string) => {
    const updatedReferees = [...formData.additional_referees]
    updatedReferees[index] = { ...updatedReferees[index], [field]: value }
    setFormData({
      ...formData,
      additional_referees: updatedReferees
    })
  }

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
      setIsSubmitted(true)
      onSuccess?.()
      
      // Reset form
      setIsSubmitted(false)
      setFormData({
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
        education: [{ degree: "", graduation_year: "", institution: "" }],
        experience: [{ position: "", company: "", start_date: "", end_date: "", description: "" }],
        languages: [
          { name: "Kinyarwanda", reading: "", writing: "", speaking: "" },
          { name: "English", reading: "", writing: "", speaking: "" },
          { name: "French", reading: "", writing: "", speaking: "" }
        ],
        referees: [{ name: "", phone: "", email: "", relationship: "" }],
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
    
    // Title - Centered and Bold
    doc.setFontSize(20)
    doc.setFont(undefined, 'bold')
    doc.text(formData.full_name?.toUpperCase() || 'YOUR NAME', 105, 20, { align: 'center' })
    
    // Contact Information - Centered
    doc.setFontSize(12)
    doc.setFont(undefined, 'normal')
    if (formData.email) doc.text(formData.email, 105, 30, { align: 'center' })
    if (formData.phone) doc.text(formData.phone, 105, 37, { align: 'center' })
    if (formData.nationality) doc.text(formData.nationality, 105, 44, { align: 'center' })
    
    // Personal Information Section
    doc.setFontSize(14)
    doc.setFont(undefined, 'bold')
    doc.text('Personal Information', 20, 60)
    
    doc.setFontSize(11)
    doc.setFont(undefined, 'normal')
    let yPos = 70
    if (formData.birth_date) doc.text(`Birth Date: ${formData.birth_date}`, 20, yPos)
    yPos += 7
    if (formData.gender) doc.text(`Gender: ${formData.gender}`, 20, yPos)
    yPos += 7
    if (formData.fathers_name) doc.text(`Father's Name: ${formData.fathers_name}`, 20, yPos)
    yPos += 7
    if (formData.residence) doc.text(`Residence: ${formData.residence}`, 20, yPos)
    yPos += 7
    if (formData.place_of_birth) doc.text(`Place of Birth: ${formData.place_of_birth}`, 20, yPos)
    yPos += 7
    if (formData.nationality) doc.text(`Nationality: ${formData.nationality}`, 20, yPos)
    yPos += 7
    if (formData.mothers_name) doc.text(`Mother's Name: ${formData.mothers_name}`, 20, yPos)
    
    // Education Section
    yPos += 15
    doc.setFontSize(14)
    doc.setFont(undefined, 'bold')
    doc.text('Education', 20, yPos)
    
    doc.setFontSize(11)
    doc.setFont(undefined, 'normal')
    yPos += 10
    if (formData.university_degree || formData.university_graduation) {
      doc.text(`${formData.university_degree || ''} ${formData.university_graduation ? `- ${formData.university_graduation}` : ''}`, 20, yPos)
      yPos += 7
    }
    if (formData.secondary_degree || formData.secondary_graduation) {
      doc.text(`${formData.secondary_degree || ''} ${formData.secondary_graduation ? `- ${formData.secondary_graduation}` : ''}`, 20, yPos)
    }
    
    // Experience Section
    yPos += 15
    doc.setFontSize(14)
    doc.setFont(undefined, 'bold')
    doc.text('Experience', 20, yPos)
    
    doc.setFontSize(11)
    doc.setFont(undefined, 'normal')
    yPos += 10
    if (formData.experience_level || formData.years_experience) {
      doc.text(`${formData.experience_level || ''}${formData.years_experience ? ` with ${formData.years_experience} years of experience` : ''}`, 20, yPos)
      yPos += 7
    }
    if (formData.current_position) {
      doc.text(`Current role: ${formData.current_position}`, 20, yPos)
    }
    
    // Language Proficiency Section
    yPos += 15
    doc.setFontSize(14)
    doc.setFont(undefined, 'bold')
    doc.text('Language Proficiency', 20, yPos)
    
    doc.setFontSize(11)
    doc.setFont(undefined, 'normal')
    yPos += 10
    
    // Kinyarwanda
    if (formData.kinyarwanda_reading || formData.kinyarwanda_writing || formData.kinyarwanda_speaking) {
      doc.setFont(undefined, 'bold')
      doc.text('Kinyarwanda:', 20, yPos)
      doc.setFont(undefined, 'normal')
      yPos += 7
      const kinyarwandaSkills = []
      if (formData.kinyarwanda_reading) kinyarwandaSkills.push(`Reading: ${formData.kinyarwanda_reading}`)
      if (formData.kinyarwanda_writing) kinyarwandaSkills.push(`Writing: ${formData.kinyarwanda_writing}`)
      if (formData.kinyarwanda_speaking) kinyarwandaSkills.push(`Speaking: ${formData.kinyarwanda_speaking}`)
      if (kinyarwandaSkills.length > 0) doc.text(kinyarwandaSkills.join(', '), 25, yPos)
    }
    
    // English
    if (formData.english_reading || formData.english_writing || formData.english_speaking) {
      yPos += 7
      doc.setFont(undefined, 'bold')
      doc.text('English:', 20, yPos)
      doc.setFont(undefined, 'normal')
      yPos += 7
      const englishSkills = []
      if (formData.english_reading) englishSkills.push(`Reading: ${formData.english_reading}`)
      if (formData.english_writing) englishSkills.push(`Writing: ${formData.english_writing}`)
      if (formData.english_speaking) englishSkills.push(`Speaking: ${formData.english_speaking}`)
      if (englishSkills.length > 0) doc.text(englishSkills.join(', '), 25, yPos)
    }
    
    // French
    if (formData.french_reading || formData.french_writing || formData.french_speaking) {
      yPos += 7
      doc.setFont(undefined, 'bold')
      doc.text('French:', 20, yPos)
      doc.setFont(undefined, 'normal')
      yPos += 7
      const frenchSkills = []
      if (formData.french_reading) frenchSkills.push(`Reading: ${formData.french_reading}`)
      if (formData.french_writing) frenchSkills.push(`Writing: ${formData.french_writing}`)
      if (formData.french_speaking) frenchSkills.push(`Speaking: ${formData.french_speaking}`)
      if (frenchSkills.length > 0) doc.text(frenchSkills.join(', '), 25, yPos)
    }
    
    // Other
    if (formData.other_reading || formData.other_writing || formData.other_speaking) {
      yPos += 7
      doc.setFont(undefined, 'bold')
      doc.text('Other:', 20, yPos)
      doc.setFont(undefined, 'normal')
      yPos += 7
      const otherSkills = []
      if (formData.other_reading) otherSkills.push(`Reading: ${formData.other_reading}`)
      if (formData.other_writing) otherSkills.push(`Writing: ${formData.other_writing}`)
      if (formData.other_speaking) otherSkills.push(`Speaking: ${formData.other_speaking}`)
      if (otherSkills.length > 0) doc.text(otherSkills.join(', '), 25, yPos)
    }
    
    // Referees Section
    yPos += 15
    doc.setFontSize(14)
    doc.setFont(undefined, 'bold')
    doc.text('Referees', 20, yPos)
    
    doc.setFontSize(11)
    doc.setFont(undefined, 'normal')
    yPos += 10
    if (formData.referee_name) doc.text(formData.referee_name, 20, yPos)
    yPos += 7
    const refereeContact = []
    if (formData.referee_phone) refereeContact.push(formData.referee_phone)
    if (formData.referee_email) refereeContact.push(formData.referee_email)
    if (refereeContact.length > 0) doc.text(`Contact: ${refereeContact.join(', ')}`, 20, yPos)
    
    // Save PDF
    doc.save(`${(formData.full_name || 'CV').replace(/\s+/g, '_')}_CV.pdf`)
  }

  return (
    <div className="w-screen h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">CURRICULUM VITAE (CV)</h1>
          </div>
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
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Form Section - Left Side */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
              
              <Button
                type="button"
                variant="outline"
                onClick={() => alert("Add more education coming soon!")}
                className="gap-2 mt-4"
              >
                <Plus className="h-4 w-4" />
                Add Education
              </Button>
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
              
              <Button
                type="button"
                variant="outline"
                onClick={() => alert("Add more experience coming soon!")}
                className="gap-2 mt-4"
              >
                <Plus className="h-4 w-4" />
                Add Experience
              </Button>
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
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => alert("Add more languages coming soon!")}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Language
                </Button>
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
              
              <Button
                type="button"
                variant="outline"
                onClick={() => alert("Add more referees coming soon!")}
                className="gap-2 mt-4"
              >
                <Plus className="h-4 w-4" />
                Add Referee
              </Button>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4 border-t">
              <Button
                type="submit"
                disabled={loading}
                className="text-black hover:opacity-90 px-8"
                style={{ backgroundColor: '#76c893' }}
              >
                {loading ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </form>
        </div>
        
        {/* Preview Section - Right Side */}
        <div className="flex-1 lg:border-l border-gray-200 overflow-hidden bg-white">
          <div className="h-full overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-center">Live Preview</h3>
              <p className="text-sm text-gray-600 text-center">See how your CV will look</p>
            </div>
            <div className="p-4">
              <CVPreview formData={formData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
