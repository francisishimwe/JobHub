import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Terms & Conditions</h1>
          
          <div className="space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Agreement to Terms</h2>
              <p>
                By accessing and using RwandaJobHub, you accept and agree to be bound by the terms and provisions of 
                this agreement. If you do not agree to these terms, please do not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Use of Service</h2>
              <p className="mb-3">You agree to use RwandaJobHub only for lawful purposes. You must not use our service:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>In any way that violates any applicable local, national, or international law or regulation</li>
                <li>To transmit any unsolicited or unauthorized advertising or promotional material</li>
                <li>To impersonate or attempt to impersonate the company, an employee, another user, or any other person</li>
                <li>To engage in any conduct that restricts or inhibits anyone's use or enjoyment of the service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Job Postings</h2>
              <p className="mb-3">Employers posting jobs on RwandaJobHub agree to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate and truthful information about job opportunities</li>
                <li>Not post fraudulent, misleading, or discriminatory job listings</li>
                <li>Comply with all applicable employment laws and regulations</li>
                <li>Take full responsibility for the recruitment process and hiring decisions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">User Responsibilities</h2>
              <p className="mb-3">As a user of RwandaJobHub, you are responsible for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Maintaining the confidentiality of your account information</li>
                <li>Ensuring all information you provide is accurate and up-to-date</li>
                <li>Your own job application decisions and employment agreements</li>
                <li>Conducting your own due diligence before applying to any job posting</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Intellectual Property</h2>
              <p>
                The content, features, and functionality of RwandaJobHub are owned by us and are protected by 
                international copyright, trademark, and other intellectual property laws. You may not copy, modify, 
                distribute, sell, or lease any part of our service without our express written permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Limitation of Liability</h2>
              <p>
                RwandaJobHub acts as a platform connecting job seekers with employers. We do not guarantee job placements, 
                interviews, or employment outcomes. We are not responsible for the accuracy of job postings or the actions 
                of employers or job seekers using our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Third-Party Services</h2>
              <p>
                Our service may contain links to third-party websites or services that are not owned or controlled by 
                RwandaJobHub. We have no control over and assume no responsibility for the content, privacy policies, 
                or practices of any third-party websites or services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Termination</h2>
              <p>
                We reserve the right to terminate or suspend access to our service immediately, without prior notice or 
                liability, for any reason, including if you breach these terms and conditions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Changes to Terms</h2>
              <p>
                We reserve the right to modify or replace these terms at any time. If a revision is material, we will 
                provide at least 30 days' notice prior to any new terms taking effect. Continued use of the service after 
                changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Governing Law</h2>
              <p>
                These terms shall be governed and construed in accordance with the laws of Rwanda, without regard to its 
                conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Contact Us</h2>
              <p>
                If you have any questions about these terms and conditions, please contact us through our contact page 
                or via the information provided on our website.
              </p>
            </section>

            <p className="text-sm mt-8 pt-6 border-t">
              Last updated: November 11, 2025
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
