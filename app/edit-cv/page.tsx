"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Download, User, GraduationCap, Briefcase, DollarSign, Languages } from 'lucide-react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

// Add Google Fonts for Georgia
const addGoogleFonts = () => {
  const link = document.createElement('link')
  link.href = 'https://fonts.googleapis.com/css2?family=Georgia:wght@400;700&display=swap'
  link.rel = 'stylesheet'
  document.head.appendChild(link)
}

interface CVData {
  personalInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    birthDate: string
    nationality: string
    gender: string
  }
  education: {
    degree: string
    fieldOfStudy: string
    institution: string
    year: string
  }[]
  experience: {
    level: string
    years: string
    currentCompany?: string
    currentRole?: string
  }
  salary: {
    expectation: string
    currency: string
  }
  languages: {
    name: string
    level: 'Basic' | 'Intermediate' | 'Advanced' | 'Fluent'
  }[]
}

export default function EditCV() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const cvPreviewRef = useRef<HTMLDivElement>(null)

  // Load Google Fonts on component mount
  useEffect(() => {
    addGoogleFonts()
  }, [])

  const [cvData, setCVData] = useState<CVData>({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      birthDate: '',
      nationality: 'Rwanda',
      gender: ''
    },
    education: [{
      degree: '',
      fieldOfStudy: '',
      institution: '',
      year: ''
    }],
    experience: {
      level: '',
      years: '',
      currentCompany: '',
      currentRole: ''
    },
    salary: {
      expectation: '',
      currency: 'RWF'
    },
    languages: []
  })

  const updatePersonalInfo = (field: keyof CVData['personalInfo'], value: string) => {
    setCVData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }))
  }

  const addEducation = () => {
    setCVData(prev => ({
      ...prev,
      education: [...prev.education, { degree: '', fieldOfStudy: '', institution: '', year: '' }]
    }))
  }

  const updateEducation = (index: number, field: string, value: string) => {
    setCVData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }))
  }

  const removeEducation = (index: number) => {
    setCVData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }))
  }

  const addLanguage = () => {
    setCVData(prev => ({
      ...prev,
      languages: [...prev.languages, { name: '', level: 'Basic' }]
    }))
  }

  const updateLanguage = (index: number, field: 'name' | 'level', value: string) => {
    setCVData(prev => ({
      ...prev,
      languages: prev.languages.map((lang, i) => 
        i === index ? { ...lang, [field]: value } : lang
      )
    }))
  }

  const removeLanguage = (index: number) => {
    setCVData(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }))
  }

  const generatePDF = async () => {
    if (!cvPreviewRef.current) return

    setIsGeneratingPDF(true)
    try {
      const canvas = await html2canvas(cvPreviewRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      })
      
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      
      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`${cvData.personalInfo.firstName}_${cvData.personalInfo.lastName}_CV.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const renderPersonalInfoForm = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={cvData.personalInfo.firstName}
              onChange={(e) => updatePersonalInfo('firstName', e.target.value)}
              placeholder="Enter first name"
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={cvData.personalInfo.lastName}
              onChange={(e) => updatePersonalInfo('lastName', e.target.value)}
              placeholder="Enter last name"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={cvData.personalInfo.email}
              onChange={(e) => updatePersonalInfo('email', e.target.value)}
              placeholder="email@example.com"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={cvData.personalInfo.phone}
              onChange={(e) => updatePersonalInfo('phone', e.target.value)}
              placeholder="+250 788 123 456"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="birthDate">Birth Date</Label>
            <Input
              id="birthDate"
              type="date"
              value={cvData.personalInfo.birthDate}
              onChange={(e) => updatePersonalInfo('birthDate', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="nationality">Nationality</Label>
            <Select value={cvData.personalInfo.nationality} onValueChange={(value) => updatePersonalInfo('nationality', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Rwanda">Rwanda</SelectItem>
                <SelectItem value="Kenya">Kenya</SelectItem>
                <SelectItem value="Uganda">Uganda</SelectItem>
                <SelectItem value="Tanzania">Tanzania</SelectItem>
                <SelectItem value="Burundi">Burundi</SelectItem>
                <SelectItem value="DRC">DRC</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="gender">Gender</Label>
            <Select value={cvData.personalInfo.gender} onValueChange={(value) => updatePersonalInfo('gender', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderEducationForm = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Education
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {cvData.education.map((edu, index) => (
          <div key={index} className="p-4 border rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Education {index + 1}</h4>
              {cvData.education.length > 1 && (
                <Button variant="outline" size="sm" onClick={() => removeEducation(index)}>
                  Remove
                </Button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Degree</Label>
                <Input
                  value={edu.degree}
                  onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                  placeholder="Bachelor's, Master's, PhD"
                />
              </div>
              <div>
                <Label>Field of Study</Label>
                <Input
                  value={edu.fieldOfStudy}
                  onChange={(e) => updateEducation(index, 'fieldOfStudy', e.target.value)}
                  placeholder="Computer Science, Business"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Institution</Label>
                <Input
                  value={edu.institution}
                  onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                  placeholder="University of Rwanda"
                />
              </div>
              <div>
                <Label>Year</Label>
                <Input
                  value={edu.year}
                  onChange={(e) => updateEducation(index, 'year', e.target.value)}
                  placeholder="2020"
                />
              </div>
            </div>
          </div>
        ))}
        <Button variant="outline" onClick={addEducation} className="w-full">
          Add Education
        </Button>
      </CardContent>
    </Card>
  )

  const renderExperienceForm = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Experience
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Experience Level</Label>
            <Select value={cvData.experience.level} onValueChange={(value) => setCVData(prev => ({
              ...prev,
              experience: { ...prev.experience, level: value }
            }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Entry Level">Entry Level</SelectItem>
                <SelectItem value="Junior">Junior</SelectItem>
                <SelectItem value="Mid-Level">Mid-Level</SelectItem>
                <SelectItem value="Senior">Senior</SelectItem>
                <SelectItem value="Lead">Lead</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
                <SelectItem value="Director">Director</SelectItem>
                <SelectItem value="Executive">Executive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Years of Experience</Label>
            <Input
              value={cvData.experience.years}
              onChange={(e) => setCVData(prev => ({
                ...prev,
                experience: { ...prev.experience, years: e.target.value }
              }))}
              placeholder="3"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Current Company (Optional)</Label>
            <Input
              value={cvData.experience.currentCompany}
              onChange={(e) => setCVData(prev => ({
                ...prev,
                experience: { ...prev.experience, currentCompany: e.target.value }
              }))}
              placeholder="Acme Corporation"
            />
          </div>
          <div>
            <Label>Current Role (Optional)</Label>
            <Input
              value={cvData.experience.currentRole}
              onChange={(e) => setCVData(prev => ({
                ...prev,
                experience: { ...prev.experience, currentRole: e.target.value }
              }))}
              placeholder="Software Developer"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderSalaryForm = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Salary Expectations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Currency</Label>
            <Select value={cvData.salary.currency} onValueChange={(value) => setCVData(prev => ({
              ...prev,
              salary: { ...prev.salary, currency: value }
            }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RWF">RWF</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Monthly Expectation</Label>
            <Input
              value={cvData.salary.expectation}
              onChange={(e) => setCVData(prev => ({
                ...prev,
                salary: { ...prev.salary, expectation: e.target.value }
              }))}
              placeholder="500,000"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderLanguagesForm = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Languages className="h-5 w-5" />
          Spoken Languages
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {cvData.languages.map((lang, index) => (
          <div key={index} className="flex gap-3 items-end">
            <div className="flex-1">
              <Label>Language</Label>
              <Input
                value={lang.name}
                onChange={(e) => updateLanguage(index, 'name', e.target.value)}
                placeholder="English, French, Kinyarwanda"
              />
            </div>
            <div>
              <Label>Level</Label>
              <Select value={lang.level} onValueChange={(value) => updateLanguage(index, 'level', value as any)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Basic">Basic</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                  <SelectItem value="Fluent">Fluent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {cvData.languages.length > 1 && (
              <Button variant="outline" size="sm" onClick={() => removeLanguage(index)}>
                Remove
              </Button>
            )}
          </div>
        ))}
        <Button variant="outline" onClick={addLanguage} className="w-full">
          Add Language
        </Button>
      </CardContent>
    </Card>
  )

  const renderCVPreview = () => (
    <div 
      ref={cvPreviewRef}
      className="bg-white p-8 shadow-lg"
      style={{ 
        width: '210mm', 
        minHeight: '297mm', 
        fontFamily: '"Georgia", serif',
        fontDisplay: 'swap' // Fix TypeScript error by using correct CSS property syntax for fontDisplay
      }}
    >
      {/* Header */}
      <div className="text-center mb-6 border-b-2 border-gray-800 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">
          {cvData.personalInfo.firstName} {cvData.personalInfo.lastName}
        </h1>
        <div className="text-sm text-gray-600 mt-2">
          {cvData.personalInfo.email && <span>{cvData.personalInfo.email} • </span>}
          {cvData.personalInfo.phone && <span>{cvData.personalInfo.phone} • </span>}
          {cvData.personalInfo.nationality && <span>{cvData.personalInfo.nationality}</span>}
        </div>
      </div>

      {/* Personal Information */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">Personal Information</h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><strong>Birth Date:</strong> {cvData.personalInfo.birthDate || 'Not specified'}</div>
          <div><strong>Gender:</strong> {cvData.personalInfo.gender || 'Not specified'}</div>
          <div><strong>Nationality:</strong> {cvData.personalInfo.nationality}</div>
        </div>
      </div>

      {/* Education */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">Education</h2>
        {cvData.education.map((edu, index) => (
          <div key={index} className="mb-3">
            <div className="font-semibold">{edu.degree} in {edu.fieldOfStudy}</div>
            <div className="text-sm text-gray-600">{edu.institution} • {edu.year}</div>
          </div>
        ))}
      </div>

      {/* Experience */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">Experience</h2>
        <div className="mb-3">
          <div className="font-semibold">{cvData.experience.level}</div>
          <div className="text-sm text-gray-600">{cvData.experience.years} years of experience</div>
          {cvData.experience.currentCompany && (
            <div className="text-sm">
              <strong>Current:</strong> {cvData.experience.currentRole} at {cvData.experience.currentCompany}
            </div>
          )}
        </div>
      </div>

      {/* Salary Expectations */}
      {cvData.salary.expectation && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">Salary Expectations</h2>
          <div className="text-sm">
            {cvData.salary.currency} {cvData.salary.expectation} per month
          </div>
        </div>
      )}

      {/* Languages */}
      {cvData.languages.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">Spoken Languages</h2>
          <div className="grid grid-cols-2 gap-3">
            {cvData.languages.map((lang, index) => (
              <div key={index} className="text-sm">
                <div className="font-medium">{lang.name}</div>
                <div className="text-gray-600">{lang.level}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderStepForm = () => {
    switch (currentStep) {
      case 1:
        return renderPersonalInfoForm()
      case 2:
        return renderEducationForm()
      case 3:
        return renderExperienceForm()
      case 4:
        return renderSalaryForm()
      case 5:
        return renderLanguagesForm()
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">CV Builder</h1>
              <p className="text-gray-600">Create your professional CV in minutes</p>
            </div>
            <Button
              onClick={generatePDF}
              disabled={isGeneratingPDF}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
            >
              <Download className="mr-2 h-4 w-4" />
              {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
            </Button>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-between mt-6">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 5 && <div className={`w-16 h-1 mx-2 ${
                  currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                }`} />}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className="space-y-4">
            {renderStepForm()}
            
            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button
                onClick={nextStep}
                disabled={currentStep === 5}
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:sticky lg:top-4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-semibold mb-4">A4 Preview</h2>
              <div className="overflow-auto max-h-[800px] border">
                {renderCVPreview()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}