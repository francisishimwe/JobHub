import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Construction } from "lucide-react"

export default function EditCVPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="max-w-2xl w-full text-center">
          <div className="mb-8">
            <Construction className="h-24 w-24 text-orange-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              CV Editor - Under Development
            </h1>
            <p className="text-lg text-gray-600">
              This feature is currently being developed and will be available soon.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}