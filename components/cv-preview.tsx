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
    university_degree: string
    university_graduation: string
    secondary_degree: string
    secondary_graduation: string
    experience_level: string
    current_position: string
    years_experience: string
    current_employer: string
    kinyarwanda_reading: string
    kinyarwanda_writing: string
    kinyarwanda_speaking: string
    english_reading: string
    english_writing: string
    english_speaking: string
    french_reading: string
    french_writing: string
    french_speaking: string
    other_reading: string
    other_writing: string
    other_speaking: string
    referee_name: string
    referee_phone: string
    referee_email: string
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
            {(formData.university_degree || formData.university_graduation) && (
              <div className="bg-gray-50 p-3 rounded">
                <div className="font-medium">{formData.university_degree || "University Degree"}</div>
                {formData.university_graduation && (
                  <div className="text-sm text-gray-600">Graduated: {formData.university_graduation}</div>
                )}
              </div>
            )}
            {(formData.secondary_degree || formData.secondary_graduation) && (
              <div className="bg-gray-50 p-3 rounded">
                <div className="font-medium">{formData.secondary_degree || "Secondary Education"}</div>
                {formData.secondary_graduation && (
                  <div className="text-sm text-gray-600">Graduated: {formData.secondary_graduation}</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Professional Experience */}
        <div className="border-l-4 border-purple-600 pl-4">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-purple-600" />
            PROFESSIONAL EXPERIENCE
          </h2>
          <div className="space-y-3">
            {(formData.experience_level || formData.years_experience) && (
              <div className="bg-gray-50 p-3 rounded">
                <div className="font-medium">
                  {formData.experience_level || "Experience Level"} 
                  {formData.years_experience && ` - ${formData.years_experience} years`}
                </div>
              </div>
            )}
            {formData.current_position && (
              <div className="bg-gray-50 p-3 rounded">
                <div className="font-medium">{formData.current_position}</div>
                {formData.current_employer && (
                  <div className="text-sm text-gray-600">Employer: {formData.current_employer}</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Language Proficiency */}
        <div className="border-l-4 border-orange-600 pl-4">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <Globe className="h-5 w-5 text-orange-600" />
            LANGUAGE PROFICIENCY
          </h2>
          <div className="space-y-3">
            {(formData.kinyarwanda_reading || formData.kinyarwanda_writing || formData.kinyarwanda_speaking) && (
              <div className="bg-gray-50 p-3 rounded">
                <div className="font-medium mb-2">Kinyarwanda</div>
                <div className="text-sm grid grid-cols-3 gap-2">
                  {formData.kinyarwanda_reading && <div>Reading: {formData.kinyarwanda_reading}</div>}
                  {formData.kinyarwanda_writing && <div>Writing: {formData.kinyarwanda_writing}</div>}
                  {formData.kinyarwanda_speaking && <div>Speaking: {formData.kinyarwanda_speaking}</div>}
                </div>
              </div>
            )}
            {(formData.english_reading || formData.english_writing || formData.english_speaking) && (
              <div className="bg-gray-50 p-3 rounded">
                <div className="font-medium mb-2">English</div>
                <div className="text-sm grid grid-cols-3 gap-2">
                  {formData.english_reading && <div>Reading: {formData.english_reading}</div>}
                  {formData.english_writing && <div>Writing: {formData.english_writing}</div>}
                  {formData.english_speaking && <div>Speaking: {formData.english_speaking}</div>}
                </div>
              </div>
            )}
            {(formData.french_reading || formData.french_writing || formData.french_speaking) && (
              <div className="bg-gray-50 p-3 rounded">
                <div className="font-medium mb-2">French</div>
                <div className="text-sm grid grid-cols-3 gap-2">
                  {formData.french_reading && <div>Reading: {formData.french_reading}</div>}
                  {formData.french_writing && <div>Writing: {formData.french_writing}</div>}
                  {formData.french_speaking && <div>Speaking: {formData.french_speaking}</div>}
                </div>
              </div>
            )}
            {(formData.other_reading || formData.other_writing || formData.other_speaking) && (
              <div className="bg-gray-50 p-3 rounded">
                <div className="font-medium mb-2">Other Languages</div>
                <div className="text-sm grid grid-cols-3 gap-2">
                  {formData.other_reading && <div>Reading: {formData.other_reading}</div>}
                  {formData.other_writing && <div>Writing: {formData.other_writing}</div>}
                  {formData.other_speaking && <div>Speaking: {formData.other_speaking}</div>}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Referees */}
        <div className="border-l-4 border-red-600 pl-4">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <Users className="h-5 w-5 text-red-600" />
            REFERENCES
          </h2>
          <div className="bg-gray-50 p-3 rounded">
            {formData.referee_name && <div className="font-medium">{formData.referee_name}</div>}
            <div className="text-sm text-gray-600">
              {formData.referee_phone && <span>Phone: {formData.referee_phone}</span>}
              {formData.referee_phone && formData.referee_email && <span> | </span>}
              {formData.referee_email && <span>Email: {formData.referee_email}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
