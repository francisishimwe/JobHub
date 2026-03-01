import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">About RwandaJobHub</h1>
          
          <div className="space-y-8">
            <section className="text-center">
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                RwandaJobHub is Rwanda's premier job board platform, connecting talented professionals 
                with innovative companies across the country. We are committed to building a stronger 
                Rwandan workforce by facilitating meaningful employment opportunities.
              </p>
            </section>

            <div className="grid md:grid-cols-2 gap-8">
              <section className="bg-card p-6 rounded-lg border">
                <h3 className="text-xl font-semibold mb-4">For Job Seekers</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Access to thousands of job opportunities</li>
                  <li>• Easy application process</li>
                  <li>• Job exam preparation resources</li>
                  <li>• CV editing and optimization tools</li>
                  <li>• Career guidance and tips</li>
                </ul>
              </section>

              <section className="bg-card p-6 rounded-lg border">
                <h3 className="text-xl font-semibold mb-4">For Employers</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Post jobs to reach qualified candidates</li>
                  <li>• Advanced filtering and search capabilities</li>
                  <li>• Company profile management</li>
                  <li>• Applicant tracking system</li>
                  <li>• Verified payment and premium listings</li>
                </ul>
              </section>
            </div>

            <section className="text-center">
              <h2 className="text-2xl font-semibold mb-4">Why Choose RwandaJobHub?</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-4">
                  <h4 className="font-semibold mb-2">Local Focus</h4>
                  <p className="text-sm text-muted-foreground">
                    Dedicated exclusively to the Rwandan job market, understanding local needs and culture.
                  </p>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold mb-2">Quality Opportunities</h4>
                  <p className="text-sm text-muted-foreground">
                    Curated job listings from verified companies ensuring legitimate opportunities.
                  </p>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold mb-2">Easy to Use</h4>
                  <p className="text-sm text-muted-foreground">
                    Simple, intuitive platform designed for both job seekers and employers.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-primary/5 p-8 rounded-lg text-center">
              <h2 className="text-2xl font-semibold mb-4">Join Our Community</h2>
              <p className="text-muted-foreground mb-6">
                Be part of Rwanda's growing professional network. Whether you're looking for your next opportunity 
                or searching for talented individuals to join your team, RwandaJobHub is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                  Browse Jobs
                </button>
                <button className="px-6 py-2 border border-primary text-primary rounded-md hover:bg-primary/5">
                  Post a Job
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}