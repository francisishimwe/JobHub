"use client"

import type React from "react"
import { User, Mail, Phone, MapPin, Calendar, Globe, BookOpen, Briefcase, Users } from "lucide-react"

interface CVPreviewProps {
  formData: {
    full_name: string
    email: string
    phone: string
    residence: string
    birth_date: string
    gender: string
    fathers_name: string
    mothers_name: string
    place_of_birth: string
    nationality: string
    additional_education: Array<{ degree: string; graduation_year: string; institution: string }>
    additional_experience: Array<{ position: string; company: string; start_date: string; end_date: string; description: string }>
    additional_languages: Array<{ name: string; reading: string; writing: string; speaking: string }>
    additional_referees: Array<{ name: string; phone: string; email: string; relationship: string }>
  }
}

export function CVPreview({ formData }: CVPreviewProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const getAge = (birthDate: string) => {
    if (!birthDate) return ""
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  return (
    <div className="bg-white text-gray-900 min-h-full">
      {/* Header with Name and Contact */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-6">
        <h1 className="text-3xl font-bold mb-3 text-center">
          {formData.full_name.toUpperCase() || "YOUR NAME"}
        </h1>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          {formData.email && (
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              <span>{formData.email}</span>
            </div>
          )}
          {formData.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              <span>{formData.phone}</span>
            </div>
          )}
          {formData.residence && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{formData.residence}</span>
            </div>
          )}
          {formData.nationality && (
            <div className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              <span>{formData.nationality}</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Personal Information */}
        <div className="border-l-4 border-blue-600 pl-4">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            PERSONAL INFORMATION
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {formData.birth_date && (
              <div>
                <span className="font-medium">Date of Birth:</span> {formatDate(formData.birth_date)} 
                {getAge(formData.birth_date) && ` (${getAge(formData.birth_date)} years)`}
              </div>
            )}
            {formData.gender && (
              <div>
                <span className="font-medium">Gender:</span> {formData.gender}
              </div>
            )}
            {formData.place_of_birth && (
              <div>
                <span className="font-medium">Place of Birth:</span> {formData.place_of_birth}
              </div>
            )}
            {formData.nationality && (
              <div>
                <span className="font-medium">Nationality:</span> {formData.nationality}
              </div>
            )}
            {formData.fathers_name && (
              <div>
                <span className="font-medium">Father's Name:</span> {formData.fathers_name}
              </div>
            )}
            {formData.mothers_name && (
              <div>
                <span className="font-medium">Mother's Name:</span> {formData.mothers_name}
              </div>
            )}
          </div>
        </div>

        {/* Education */}
        <div className="border-l-4 border-green-600 pl-4">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-green-600" />
            EDUCATION
          </h2>
          <div className="space-y-3">
            {formData.additional_education.map((edu, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded">
                <div className="font-medium">{edu.degree || "Degree"}</div>
                {edu.graduation_year && (
                  <div className="text-sm text-gray-600">Graduated: {edu.graduation_year}</div>
                )}
                {edu.institution && (
                  <div className="text-sm text-gray-600">Institution: {edu.institution}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Professional Experience */}
        <div className="border-l-4 border-purple-600 pl-4">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-purple-600" />
            PROFESSIONAL EXPERIENCE
          </h2>
          <div className="space-y-3">
            {formData.additional_experience.map((exp, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded">
                <div className="font-medium">{exp.position || "Position"}</div>
                {exp.company && (
                  <div className="text-sm text-gray-600">Company: {exp.company}</div>
                )}
                {(exp.start_date || exp.end_date) && (
                  <div className="text-sm text-gray-600">
                    {exp.start_date && <span>From: {formatDate(exp.start_date)}</span>}
                    {exp.start_date && exp.end_date && <span> - </span>}
                    {exp.end_date && <span>To: {formatDate(exp.end_date)}</span>}
                  </div>
                )}
                {exp.description && (
                  <div className="text-sm text-gray-600 mt-2">{exp.description}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Language Proficiency */}
        <div className="border-l-4 border-orange-600 pl-4">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <Globe className="h-5 w-5 text-orange-600" />
            LANGUAGE PROFICIENCY
          </h2>
          <div className="space-y-3">
            {formData.additional_languages.map((lang, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded">
                <div className="font-medium mb-2">{lang.name || "Language"}</div>
                <div className="text-sm grid grid-cols-3 gap-2">
                  {lang.reading && <div>Reading: {lang.reading}</div>}
                  {lang.writing && <div>Writing: {lang.writing}</div>}
                  {lang.speaking && <div>Speaking: {lang.speaking}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Referees */}
        <div className="border-l-4 border-red-600 pl-4">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <Users className="h-5 w-5 text-red-600" />
            REFEREES
          </h2>
          {formData.additional_referees.map((referee, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded mb-3">
              <div className="font-medium">{referee.name || "Referee Name"}</div>
              <div className="text-sm text-gray-600">
                {referee.phone && <span>Phone: {referee.phone}</span>}
                {referee.phone && referee.email && <span> | </span>}
                {referee.email && <span>Email: {referee.email}</span>}
                {referee.relationship && (
                  <div className="mt-1">Relationship: {referee.relationship}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
