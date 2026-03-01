import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Disclaimer</h1>

          <div className="space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">General Information</h2>
              <p>
                The information provided by RwandaJobHub is for general informational purposes only. All information on
                the site is provided in good faith, however we make no representation or warranty of any kind, express
                or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any
                information on the site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">No Employment Guarantee</h2>
              <p>
                RwandaJobHub is a job listing platform that connects job seekers with potential employers. We do not
                guarantee employment, interviews, or any specific outcomes from using our service. The decision to apply
                for a job and any subsequent employment relationship is solely between the job seeker and the employer.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Third-Party Job Postings</h2>
              <p>
                Job postings on RwandaJobHub are provided by third-party employers and organizations. We do not verify
                the accuracy of descriptions, salary information, or company details. Users should conduct their own
                due diligence and research before applying to any job posting or engaging with any employer.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">No Professional Advice</h2>
              <p>
                The content on RwandaJobHub does not constitute professional career advice, legal advice, or employment
                counseling. Users should seek independent professional advice before making any employment decisions or
                taking any action based on information found on our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">External Links</h2>
              <p>
                RwandaJobHub contains links to external websites and application portals that are not provided or
                maintained by us. We do not guarantee the accuracy, relevance, timeliness, or completeness of any
                information on these external websites. Visiting these sites is at your own risk.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Limitation of Liability</h2>
              <p>
                Under no circumstance shall RwandaJobHub have any liability to you for any loss or damage of any kind
                incurred as a result of the use of the site or reliance on any information provided on the site. Your
                use of the site and your reliance on any information on the site is solely at your own risk.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Fraud Prevention</h2>
              <p>
                While we strive to maintain a safe and legitimate job board, we cannot guarantee that all job postings
                are authentic or free from fraudulent activity. Users should be cautious of job offers that seem too good
                to be true, request payment for applications, or ask for sensitive personal information upfront.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Information Accuracy</h2>
              <p>
                Job postings, company information, and other content on RwandaJobHub may become outdated or may contain
                inaccuracies. We are not obligated to update any information on our site, and we make no commitment to
                update such information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">No Endorsement</h2>
              <p>
                The appearance of companies, job postings, or advertisements on RwandaJobHub does not constitute an
                endorsement, recommendation, or approval by us of these employers or their business practices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">User Responsibility</h2>
              <p>
                Users are solely responsible for evaluating the accuracy, completeness, and usefulness of all information
                provided on RwandaJobHub. Users must conduct their own investigation and exercise their own judgment
                before applying to jobs or engaging with employers through our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Changes to Disclaimer</h2>
              <p>
                We reserve the right to modify this disclaimer at any time without prior notice. Changes will be effective
                immediately upon posting. Your continued use of the site after any changes indicates your acceptance of
                the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Contact Information</h2>
              <p>
                If you have any questions or concerns about this disclaimer, please contact us through our contact page
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
