import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { UnderDevelopment } from "@/components/under-development"

export default function EmployersPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <UnderDevelopment pageName="Employers" />
      </main>
      <Footer />
    </div>
  )
}
