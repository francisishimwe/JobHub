"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FileText, MessagesSquare } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ExamsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Exam Preparation Resources
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Master your technical exams and interview skills with our comprehensive preparation materials
            </p>
          </div>

          {/* 2-Column Grid with Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Card 1: Job Questions & Answers */}
            <div className="bg-white rounded-3xl border border-slate-100 p-10 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group">
              {/* Icon */}
              <div className="mb-8 p-6 bg-blue-50 rounded-2xl group-hover:bg-blue-100 transition-colors duration-300">
                <FileText className="h-16 w-16 text-blue-600" />
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-900 mb-6 leading-tight">
                Job Prep Questions & Answers
              </h2>

              {/* Description */}
              <p className="text-gray-600 text-lg leading-relaxed mb-8 flex-1">
                Master the technical exams for Rwanda's top institutions with our curated database of past paper solutions and correct answers.
              </p>

              {/* Button */}
              <Button 
                className="w-full px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-xl transform hover:scale-105 bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
                asChild
              >
                <a href="/resources?category=qa">
                  Browse Q&A
                </a>
              </Button>
            </div>

            {/* Card 2: Interview Preparation */}
            <div className="bg-white rounded-3xl border border-slate-100 p-10 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group">
              {/* Icon */}
              <div className="mb-8 p-6 bg-orange-50 rounded-2xl group-hover:bg-orange-100 transition-colors duration-300">
                <MessagesSquare className="h-16 w-16 text-orange-600" />
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-900 mb-6 leading-tight">
                Interview Questions & Answers
              </h2>

              {/* Description */}
              <p className="text-gray-600 text-lg leading-relaxed mb-8 flex-1">
                From 'Tell me about yourself' to salary negotiations, learn how to answer common interview questions used by Rwandan HR managers.
              </p>

              {/* Button */}
              <Button 
                className="w-full px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-xl transform hover:scale-105 bg-orange-600 hover:bg-orange-700 text-white"
                size="lg"
                asChild
              >
                <a href="/resources?category=interview">
                  Start Prep
                </a>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}