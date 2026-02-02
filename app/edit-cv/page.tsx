"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Download, User, GraduationCap, Briefcase, Languages, CheckCircle } from 'lucide-react'
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
    placeOfBirth: string
    fathersName: string
    mothersName: string
    nationality: string
    gender: string
    residence: {
      district: string
      sector: string
      cell: string
      village: string
    }
  }
  education: {
    degree: string
    fieldOfStudy: string
    institution: string
    yearOfGraduation: string
    countryOfStudy: string
  }[]
  experience: {
    level: string
    years: string
    currentCompany?: string
    currentRole?: string
    employerPhone?: string
    employerEmail?: string
  }
  salary: {
    expectation: string
    currency: string
  }
  languages: {
    name: string
    proficiency: {
      reading: 'Excellent' | 'Very Good' | 'Good' | 'Basic'
      writing: 'Excellent' | 'Very Good' | 'Good' | 'Basic'
      speaking: 'Excellent' | 'Very Good' | 'Good' | 'Basic'
    }
  }[]
  referees: {
    name: string
    position: string
    organization: string
    phone: string
    email: string
  }[]
}

export default function EditCV() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
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
      placeOfBirth: '',
      fathersName: '',
      mothersName: '',
      nationality: 'Rwanda',
      gender: '',
      residence: {
        district: '',
        sector: '',
        cell: '',
        village: ''
      }
    },
    education: [{
      degree: '',
      fieldOfStudy: '',
      institution: '',
      yearOfGraduation: '',
      countryOfStudy: ''
    }],
    experience: {
      level: '',
      years: '',
      currentCompany: '',
      currentRole: '',
      employerPhone: '',
      employerEmail: ''
    },
    languages: [{
      name: 'Kinyarwanda',
      proficiency: {
        reading: 'Excellent',
        writing: 'Excellent',
        speaking: 'Excellent'
      }
    }],
    referees: []
  })

  const updatePersonalInfo = (field: keyof CVData['personalInfo'], value: string) => {
    setCVData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }))
  }

  const updateResidence = (field: keyof CVData['personalInfo']['residence'], value: string) => {
    setCVData(prev => ({
      ...prev,
      personalInfo: { 
        ...prev.personalInfo, 
        residence: { ...prev.personalInfo.residence, [field]: value }
      }
    }))
  }

  const addEducation = () => {
    setCVData(prev => ({
      ...prev,
      education: [...prev.education, { degree: '', fieldOfStudy: '', institution: '', yearOfGraduation: '', countryOfStudy: '' }]
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
      languages: [...prev.languages, { 
        name: '', 
        proficiency: {
          reading: 'Basic',
          writing: 'Basic',
          speaking: 'Basic'
        }
      }]
    }))
  }

  const updateLanguage = (index: number, field: 'name' | 'reading' | 'writing' | 'speaking', value: string) => {
    setCVData(prev => ({
      ...prev,
      languages: prev.languages.map((lang, i) => {
        if (i === index) {
          if (field === 'name') {
            return { ...lang, name: value }
          } else {
            return {
              ...lang,
              proficiency: { ...lang.proficiency, [field]: value }
            }
          }
        }
        return lang
      })
    }))
  }

  const addReferee = () => {
    setCVData(prev => ({
      ...prev,
      referees: [...prev.referees, { name: '', position: '', organization: '', phone: '', email: '' }]
    }))
  }

  const updateReferee = (index: number, field: keyof CVData['referees'][0], value: string) => {
    setCVData(prev => ({
      ...prev,
      referees: prev.referees.map((ref, i) => 
        i === index ? { ...ref, [field]: value } : ref
      )
    }))
  }

  const removeReferee = (index: number) => {
    setCVData(prev => ({
      ...prev,
      referees: prev.referees.filter((_, i) => i !== index)
    }))
  }

  const generatePDF = async () => {
    if (!cvPreviewRef.current) return

    setIsGeneratingPDF(true)
    try {
      const canvas = await html2canvas(cvPreviewRef.current, {
        scale: 1.5,
        useCORS: true,
        allowTaint: true
      })
      
      const imgData = canvas.toDataURL('image/png', 0.8)
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        compress: true
      })
      
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

  const jumpToStep = (step: number) => {
    setCurrentStep(step)
  }

  const nextStep = () => {
    if (currentStep < 6) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleSubmit = () => {
    setShowSuccessMessage(true)
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
            <Label htmlFor="placeOfBirth">Place of Birth</Label>
            <Input
              id="placeOfBirth"
              value={cvData.personalInfo.placeOfBirth}
              onChange={(e) => updatePersonalInfo('placeOfBirth', e.target.value)}
              placeholder="Kigali, Rwanda"
            />
          </div>
          <div>
            <Label htmlFor="nationality">Nationality</Label>
            <Select value={cvData.personalInfo.nationality} onValueChange={(value) => updatePersonalInfo('nationality', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-50 max-h-48 overflow-y-auto">
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
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fathersName">Father's Name</Label>
            <Input
              id="fathersName"
              value={cvData.personalInfo.fathersName}
              onChange={(e) => updatePersonalInfo('fathersName', e.target.value)}
              placeholder="Enter father's name"
            />
          </div>
          <div>
            <Label htmlFor="mothersName">Mother's Name</Label>
            <Input
              id="mothersName"
              value={cvData.personalInfo.mothersName}
              onChange={(e) => updatePersonalInfo('mothersName', e.target.value)}
              placeholder="Enter mother's name"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="gender">Gender</Label>
          <Select value={cvData.personalInfo.gender} onValueChange={(value) => updatePersonalInfo('gender', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-50 max-h-48 overflow-y-auto">
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Residence Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Residence Information</h3>
          
          <div>
            <Label htmlFor="district">District</Label>
            <Select value={cvData.personalInfo.residence.district} onValueChange={(value) => updateResidence('district', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select district" />
              </SelectTrigger>
              <SelectContent className="z-50 max-h-48 overflow-y-auto">
                {/* Kigali City */}
                <SelectItem value="Nyarugenge">Nyarugenge</SelectItem>
                <SelectItem value="Gasabo">Gasabo</SelectItem>
                <SelectItem value="Kicukiro">Kicukiro</SelectItem>
                
                {/* Northern Province */}
                <SelectItem value="Musanze">Musanze</SelectItem>
                <SelectItem value="Burera">Burera</SelectItem>
                <SelectItem value="Gicumbi">Gicumbi</SelectItem>
                <SelectItem value="Rulindo">Rulindo</SelectItem>
                <SelectItem value="Gakenke">Gakenke</SelectItem>
                
                {/* Southern Province */}
                <SelectItem value="Huye">Huye</SelectItem>
                <SelectItem value="Nyanza">Nyanza</SelectItem>
                <SelectItem value="Ruhango">Ruhango</SelectItem>
                <SelectItem value="Muhanga">Muhanga</SelectItem>
                <SelectItem value="Kamonyi">Kamonyi</SelectItem>
                <SelectItem value="Nyamagabe">Nyamagabe</SelectItem>
                <SelectItem value="Nyagatare">Nyagatare</SelectItem>
                <SelectItem value="Gisagara">Gisagara</SelectItem>
                
                {/* Eastern Province */}
                <SelectItem value="Rwamagana">Rwamagana</SelectItem>
                <SelectItem value="Kayonza">Kayonza</SelectItem>
                <SelectItem value="Gatsibo">Gatsibo</SelectItem>
                <SelectItem value="Nyagatare">Nyagatare</SelectItem>
                <SelectItem value="Kirehe">Kirehe</SelectItem>
                <SelectItem value="Ngoma">Ngoma</SelectItem>
                <SelectItem value="Bugesera">Bugesera</SelectItem>
                
                {/* Western Province */}
                <SelectItem value="Rubavu">Rubavu</SelectItem>
                <SelectItem value="Rusizi">Rusizi</SelectItem>
                <SelectItem value="Karongi">Karongi</SelectItem>
                <SelectItem value="Nyabihu">Nyabihu</SelectItem>
                <SelectItem value="Rutsiro">Rutsiro</SelectItem>
                <SelectItem value="Ngororero">Ngororero</SelectItem>
                <SelectItem value="Nyamasheke">Nyamasheke</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {cvData.personalInfo.residence.district && (
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="sector">Sector (Umurenge)</Label>
                <Input
                  id="sector"
                  value={cvData.personalInfo.residence.sector}
                  onChange={(e) => updateResidence('sector', e.target.value)}
                  placeholder="Enter sector name"
                />
              </div>
              <div>
                <Label htmlFor="cell">Cell (Akagari)</Label>
                <Input
                  id="cell"
                  value={cvData.personalInfo.residence.cell}
                  onChange={(e) => updateResidence('cell', e.target.value)}
                  placeholder="Enter cell name"
                />
              </div>
              <div>
                <Label htmlFor="village">Village (Umudugudu)</Label>
                <Input
                  id="village"
                  value={cvData.personalInfo.residence.village}
                  onChange={(e) => updateResidence('village', e.target.value)}
                  placeholder="Enter village name"
                />
              </div>
            </div>
          )}
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
                <Label>Year of Graduation</Label>
                <Input
                  value={edu.yearOfGraduation}
                  onChange={(e) => updateEducation(index, 'yearOfGraduation', e.target.value)}
                  placeholder="2020"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Country of Study</Label>
                <Input
                  value={edu.countryOfStudy}
                  onChange={(e) => updateEducation(index, 'countryOfStudy', e.target.value)}
                  placeholder="Rwanda"
                />
              </div>
            </div>
          </div>
        ))}
        <Button variant="outline" onClick={addEducation} className="w-full bg-green-600 hover:bg-green-700 text-white">
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
              <SelectContent className="z-50 max-h-48 overflow-y-auto">
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
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Employer Phone (Optional)</Label>
            <Input
              value={cvData.experience.employerPhone}
              onChange={(e) => setCVData(prev => ({
                ...prev,
                experience: { ...prev.experience, employerPhone: e.target.value }
              }))}
              placeholder="+250 788 123 456"
            />
          </div>
          <div>
            <Label>Employer Email (Optional)</Label>
            <Input
              type="email"
              value={cvData.experience.employerEmail}
              onChange={(e) => setCVData(prev => ({
                ...prev,
                experience: { ...prev.experience, employerEmail: e.target.value }
              }))}
              placeholder="employer@company.com"
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
          Language Proficiency
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {cvData.languages.map((lang, index) => (
          <div key={index} className="p-4 border rounded-lg space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Language {index + 1}</h4>
              {cvData.languages.length > 1 && (
                <Button variant="outline" size="sm" onClick={() => removeLanguage(index)}>
                  Remove
                </Button>
              )}
            </div>
            
            <div>
              <Label>Language</Label>
              <Input
                value={lang.name}
                onChange={(e) => updateLanguage(index, 'name', e.target.value)}
                placeholder="English, French, Kinyarwanda"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Reading</Label>
                <Select value={lang.proficiency.reading} onValueChange={(value) => updateLanguage(index, 'reading', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-50 max-h-48 overflow-y-auto">
                    <SelectItem value="Excellent">Excellent</SelectItem>
                    <SelectItem value="Very Good">Very Good</SelectItem>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Basic">Basic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Writing</Label>
                <Select value={lang.proficiency.writing} onValueChange={(value) => updateLanguage(index, 'writing', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-50 max-h-48 overflow-y-auto">
                    <SelectItem value="Excellent">Excellent</SelectItem>
                    <SelectItem value="Very Good">Very Good</SelectItem>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Basic">Basic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Speaking</Label>
                <Select value={lang.proficiency.speaking} onValueChange={(value) => updateLanguage(index, 'speaking', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-50 max-h-48 overflow-y-auto">
                    <SelectItem value="Excellent">Excellent</SelectItem>
                    <SelectItem value="Very Good">Very Good</SelectItem>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Basic">Basic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ))}
        <Button variant="outline" onClick={addLanguage} className="w-full bg-green-600 hover:bg-green-700 text-white">
          Add Language
        </Button>
      </CardContent>
    </Card>
  )

  const renderRefereesForm = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Referees
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {cvData.referees.map((referee, index) => (
          <div key={index} className="p-4 border rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Referee {index + 1}</h4>
              <Button variant="outline" size="sm" onClick={() => removeReferee(index)}>
                Remove
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Full Name</Label>
                <Input
                  value={referee.name}
                  onChange={(e) => updateReferee(index, 'name', e.target.value)}
                  placeholder="Enter referee's full name"
                />
              </div>
              <div>
                <Label>Position/Title</Label>
                <Input
                  value={referee.position}
                  onChange={(e) => updateReferee(index, 'position', e.target.value)}
                  placeholder="e.g., Human Resources Manager"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Organization</Label>
                <Input
                  value={referee.organization}
                  onChange={(e) => updateReferee(index, 'organization', e.target.value)}
                  placeholder="e.g., Acme Corporation"
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={referee.phone}
                  onChange={(e) => updateReferee(index, 'phone', e.target.value)}
                  placeholder="+250 788 123 456"
                />
              </div>
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={referee.email}
                onChange={(e) => updateReferee(index, 'email', e.target.value)}
                placeholder="referee@organization.com"
              />
            </div>
          </div>
        ))}
        <Button variant="outline" onClick={addReferee} className="w-full bg-green-600 hover:bg-green-700 text-white">
          Add Referee
        </Button>
      </CardContent>
    </Card>
  )

  const renderSubmitForm = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Complete Your CV
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Ready to Submit</h3>
            <p className="text-gray-600 mt-2">
              Your professional CV is ready. Click submit to complete the process and download your document.
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          <Button 
            onClick={handleSubmit} 
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3"
          >
            Submit CV
          </Button>
          
          {showSuccessMessage && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Success!</span>
              </div>
              <p className="text-green-700 mt-2 text-sm">
                Thank you for using RwandaJobHub! Your professional CV is ready. Please click the button below to download your document.
              </p>
              <Button 
                onClick={generatePDF} 
                disabled={isGeneratingPDF}
                className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Download className="mr-2 h-4 w-4" />
                {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  const renderCVPreview = () => (
    <div 
      ref={cvPreviewRef}
      className="bg-white shadow-lg"
      style={{ 
        width: '210mm', 
        minHeight: '297mm', 
        fontFamily: '"Georgia", serif',
        lineHeight: '1.6',
        wordBreak: 'break-word',
        overflowWrap: 'break-word',
        whiteSpace: 'pre-wrap',
        hyphens: 'auto',
        paddingLeft: '1cm',
        paddingRight: '1cm',
        paddingTop: '2cm',
        paddingBottom: '2cm',
        boxSizing: 'border-box'
      }}
    >
      {/* Header */}
      <div className="text-center mb-6 border-b-2 border-gray-800 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">
          {cvData.personalInfo.firstName} {cvData.personalInfo.lastName}
        </h1>
        <div className="text-sm text-gray-600 mt-2 break-all">
          {cvData.personalInfo.email && <span>{cvData.personalInfo.email} • </span>}
          {cvData.personalInfo.phone && <span>{cvData.personalInfo.phone} • </span>}
          {cvData.personalInfo.nationality && <span>{cvData.personalInfo.nationality}</span>}
        </div>
      </div>

      {/* Personal Information */}
      <div className="mb-6">
        <h2 className="text-lg font-bold italic text-gray-900 mb-3 border-b border-gray-300 pb-1">Personal Information</h2>
        <div className="grid grid-cols-2 gap-2 text-sm leading-relaxed">
          <div><strong>Birth Date:</strong> {cvData.personalInfo.birthDate || 'Not specified'}</div>
          <div><strong>Place of Birth:</strong> {cvData.personalInfo.placeOfBirth || 'Not specified'}</div>
          <div><strong>Gender:</strong> {cvData.personalInfo.gender || 'Not specified'}</div>
          <div><strong>Nationality:</strong> {cvData.personalInfo.nationality}</div>
          <div><strong>Father's Name:</strong> {cvData.personalInfo.fathersName || 'Not specified'}</div>
          <div><strong>Mother's Name:</strong> {cvData.personalInfo.mothersName || 'Not specified'}</div>
        </div>
        
        {/* Residence Information */}
        {(cvData.personalInfo.residence.district || cvData.personalInfo.residence.sector || cvData.personalInfo.residence.cell || cvData.personalInfo.residence.village) && (
          <div className="mt-3">
            <h3 className="font-semibold italic text-sm mb-2">Residence:</h3>
            <div className="text-sm text-gray-600 leading-relaxed">
              {cvData.personalInfo.residence.village && <span>{cvData.personalInfo.residence.village}, </span>}
              {cvData.personalInfo.residence.cell && <span>{cvData.personalInfo.residence.cell}, </span>}
              {cvData.personalInfo.residence.sector && <span>{cvData.personalInfo.residence.sector}, </span>}
              {cvData.personalInfo.residence.district && <span>{cvData.personalInfo.residence.district}</span>}
            </div>
          </div>
        )}
      </div>

      {/* Education */}
      <div className="mb-6">
        <h2 className="text-lg font-bold italic text-gray-900 mb-3 border-b border-gray-300 pb-1">Education</h2>
        {cvData.education.map((edu, index) => (
          <div key={index} className="mb-3 leading-relaxed">
            <div className="font-semibold">{edu.degree} in {edu.fieldOfStudy}</div>
            <div className="text-sm text-gray-600">
              {edu.institution} • Graduated {edu.yearOfGraduation}
              {edu.countryOfStudy && <span> • {edu.countryOfStudy}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Experience */}
      <div className="mb-6">
        <h2 className="text-lg font-bold italic text-gray-900 mb-3 border-b border-gray-300 pb-1">Experience</h2>
        <div className="mb-3 leading-relaxed">
          <div className="font-semibold">{cvData.experience.level}</div>
          <div className="text-sm text-gray-600">{cvData.experience.years} years of experience</div>
          {cvData.experience.currentCompany && (
            <div className="text-sm">
              <strong>Current:</strong> {cvData.experience.currentRole} at {cvData.experience.currentCompany}
            </div>
          )}
        </div>
      </div>

      {/* Languages */}
      {cvData.languages.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold italic text-gray-900 mb-3 border-b border-gray-300 pb-1">Language Proficiency</h2>
          <div className="space-y-3">
            {cvData.languages.map((lang, index) => (
              <div key={index} className="text-sm leading-relaxed">
                <div className="font-medium mb-1">{lang.name}</div>
                <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                  <div><strong>Reading:</strong> {lang.proficiency.reading}</div>
                  <div><strong>Writing:</strong> {lang.proficiency.writing}</div>
                  <div><strong>Speaking:</strong> {lang.proficiency.speaking}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Referees */}
      {cvData.referees.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold italic text-gray-900 mb-3 border-b border-gray-300 pb-1">Referees</h2>
          <div className="space-y-3">
            {cvData.referees.map((referee, index) => (
              <div key={index} className="text-sm leading-relaxed">
                <div className="font-medium">{referee.name}</div>
                <div className="text-gray-600">
                  {referee.position} at {referee.organization}
                </div>
                <div className="text-xs text-gray-500 break-all">
                  {referee.phone && <span>📞 {referee.phone}</span>}
                  {referee.phone && referee.email && <span> • </span>}
                  {referee.email && <span>✉️ {referee.email}</span>}
                </div>
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
        return renderLanguagesForm()
      case 5:
        return renderRefereesForm()
      case 6:
        return renderSubmitForm()
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'pre-wrap', hyphens: 'auto' }}>
      <div className="w-full" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'pre-wrap', hyphens: 'auto' }}>
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
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <div key={step} className="flex items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium cursor-pointer transition-colors ${
                    currentStep >= step ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                  onClick={() => jumpToStep(step)}
                >
                  {step}
                </div>
                {step < 6 && <div className={`w-16 h-1 mx-2 ${
                  currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                }`} />}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'pre-wrap', hyphens: 'auto' }}>
          {/* Form Section */}
          <div className="space-y-4" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'pre-wrap', hyphens: 'auto' }}>
            {renderStepForm()}
            
            {/* Navigation */}
            <div className="flex justify-between" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'pre-wrap', hyphens: 'auto' }}>
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button
                onClick={nextStep}
                disabled={currentStep === 6}
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:sticky lg:top-4" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'pre-wrap', hyphens: 'auto' }}>
            <div className="bg-white rounded-lg shadow-sm p-4" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'pre-wrap', hyphens: 'auto' }}>
              <h2 className="text-lg font-semibold mb-4">A4 Preview</h2>
              <div className="overflow-auto max-h-[800px] border" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'pre-wrap', hyphens: 'auto' }}>
                {renderCVPreview()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}