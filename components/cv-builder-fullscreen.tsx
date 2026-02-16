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
    
    // Dynamic arrays only
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
        additional_education: [{ degree: "", graduation_year: "", institution: "" }],
        additional_experience: [{ position: "", company: "", start_date: "", end_date: "", description: "" }],
        additional_languages: [{ name: "", reading: "", writing: "", speaking: "" }],
        additional_referees: [{ name: "", phone: "", email: "", relationship: "" }],
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
                    placeholder="Enter your full name"
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
                    placeholder="Enter your email address"
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
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality *</Label>
                  <Input
                    id="nationality"
                    required
                    value={formData.nationality}
                    onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                    placeholder="Enter your nationality"
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
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Input
                    id="gender"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    placeholder="Enter your gender"
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
                    placeholder="Enter father's name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mothers_name">Mother's Name</Label>
                  <Input
                    id="mothers_name"
                    value={formData.mothers_name}
                    onChange={(e) => setFormData({ ...formData, mothers_name: e.target.value })}
                    placeholder="Enter mother's name"
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
                    placeholder="Enter your residence"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="place_of_birth">Place of Birth</Label>
                  <Input
                    id="place_of_birth"
                    value={formData.place_of_birth}
                    onChange={(e) => setFormData({ ...formData, place_of_birth: e.target.value })}
                    placeholder="Enter place of birth"
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
              
              {/* Additional Education */}
              {formData.additional_education.map((edu, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Education {index + 1}</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeEducation(index)}
                      className="gap-1"
                    >
                      <X className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`edu-degree-${index}`}>Degree</Label>
                      <Input
                        id={`edu-degree-${index}`}
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                        placeholder="Enter degree"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`edu-year-${index}`}>Graduation Year</Label>
                      <Input
                        id={`edu-year-${index}`}
                        value={edu.graduation_year}
                        onChange={(e) => updateEducation(index, 'graduation_year', e.target.value)}
                        placeholder="Enter graduation year"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`edu-institution-${index}`}>Institution</Label>
                      <Input
                        id={`edu-institution-${index}`}
                        value={edu.institution}
                        onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                        placeholder="Enter institution"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={addEducation}
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
              
              {/* Additional Experience */}
              {formData.additional_experience.map((exp, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Experience {index + 1}</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeExperience(index)}
                      className="gap-1"
                    >
                      <X className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`exp-position-${index}`}>Position</Label>
                      <Input
                        id={`exp-position-${index}`}
                        value={exp.position}
                        onChange={(e) => updateExperience(index, 'position', e.target.value)}
                        placeholder="Enter position"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`exp-company-${index}`}>Company</Label>
                      <Input
                        id={`exp-company-${index}`}
                        value={exp.company}
                        onChange={(e) => updateExperience(index, 'company', e.target.value)}
                        placeholder="Enter company"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`exp-start-${index}`}>Start Date</Label>
                      <Input
                        id={`exp-start-${index}`}
                        type="date"
                        value={exp.start_date}
                        onChange={(e) => updateExperience(index, 'start_date', e.target.value)}
                        placeholder="Enter start date"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`exp-end-${index}`}>End Date</Label>
                      <Input
                        id={`exp-end-${index}`}
                        type="date"
                        value={exp.end_date}
                        onChange={(e) => updateExperience(index, 'end_date', e.target.value)}
                        placeholder="Enter end date"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`exp-description-${index}`}>Description</Label>
                    <Textarea
                      id={`exp-description-${index}`}
                      value={exp.description}
                      onChange={(e) => updateExperience(index, 'description', e.target.value)}
                      placeholder="Enter job description"
                      rows={3}
                    />
                  </div>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={addExperience}
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
              
              {/* Additional Languages */}
              {formData.additional_languages.map((lang, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Language {index + 1}</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeLanguage(index)}
                      className="gap-1"
                    >
                      <X className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`lang-name-${index}`}>Language Name</Label>
                    <Input
                      id={`lang-name-${index}`}
                      value={lang.name}
                      onChange={(e) => updateLanguage(index, 'name', e.target.value)}
                      placeholder="Enter language name"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`lang-reading-${index}`}>Reading</Label>
                      <select 
                        id={`lang-reading-${index}`}
                        value={lang.reading}
                        onChange={(e) => updateLanguage(index, 'reading', e.target.value)}
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
                      <Label htmlFor={`lang-writing-${index}`}>Writing</Label>
                      <select 
                        id={`lang-writing-${index}`}
                        value={lang.writing}
                        onChange={(e) => updateLanguage(index, 'writing', e.target.value)}
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
                      <Label htmlFor={`lang-speaking-${index}`}>Speaking</Label>
                      <select 
                        id={`lang-speaking-${index}`}
                        value={lang.speaking}
                        onChange={(e) => updateLanguage(index, 'speaking', e.target.value)}
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
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={addLanguage}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Language
              </Button>
            </div>

            {/* Referees */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-5 w-5" />
                Referees
              </h3>
              
              {/* Additional Referees */}
              {formData.additional_referees.map((referee, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Referee {index + 1}</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeReferee(index)}
                      className="gap-1"
                    >
                      <X className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`referee-name-${index}`}>Name</Label>
                    <Input
                      id={`referee-name-${index}`}
                      value={referee.name}
                      onChange={(e) => updateReferee(index, 'name', e.target.value)}
                      placeholder="Enter referee name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`referee-relationship-${index}`}>Relationship</Label>
                    <Input
                      id={`referee-relationship-${index}`}
                      value={referee.relationship}
                      onChange={(e) => updateReferee(index, 'relationship', e.target.value)}
                      placeholder="Enter relationship (e.g., Manager, Professor, Colleague)"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`referee-phone-${index}`}>Phone</Label>
                      <Input
                        id={`referee-phone-${index}`}
                        value={referee.phone}
                        onChange={(e) => updateReferee(index, 'phone', e.target.value)}
                        placeholder="Enter referee phone"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`referee-email-${index}`}>Email</Label>
                      <Input
                        id={`referee-email-${index}`}
                        type="email"
                        value={referee.email}
                        onChange={(e) => updateReferee(index, 'email', e.target.value)}
                        placeholder="Enter referee email"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={addReferee}
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
