import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Introduction</h2>
              <p>
                Welcome to RwandaJobHub. We respect your privacy and are committed to protecting your personal data. 
                This privacy policy will inform you about how we look after your personal data when you visit our website 
                and tell you about your privacy rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Information We Collect</h2>
              <p className="mb-3">We may collect and process the following data about you:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Information you provide when using our job board services</li>
                <li>Information about your visits to our website and the resources you access</li>
                <li>Information provided when you communicate with us for any reason</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">How We Use Your Information</h2>
              <p className="mb-3">We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide and improve our job board services</li>
                <li>Connect job seekers with employers</li>
                <li>Send you relevant job opportunities and updates</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Analyze website usage to improve user experience</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal data against 
                unauthorized or unlawful processing, accidental loss, destruction, or damage.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Third-Party Links</h2>
              <p>
                Our website may contain links to third-party websites. We are not responsible for the privacy practices 
                or content of these external sites. We encourage you to read the privacy policies of any third-party sites you visit.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Your Rights</h2>
              <p className="mb-3">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Request access to your personal data</li>
                <li>Request correction of your personal data</li>
                <li>Request deletion of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Request restriction of processing your personal data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Cookies</h2>
              <p>
                Our website uses cookies to enhance your browsing experience. Cookies are small text files that are placed 
                on your device to collect standard internet log information and visitor behavior information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. Any changes will be posted on this page, and where 
                appropriate, notified to you by email.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Contact Us</h2>
              <p>
                If you have any questions about this privacy policy or our privacy practices, please contact us through 
                our contact page or via the information provided on our website.
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
