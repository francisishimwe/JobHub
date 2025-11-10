import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MapPinned, Mail, Phone, Clock, SendHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-muted-foreground">
              We're here to help you succeed in your career journey
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
                <p className="text-muted-foreground mb-8">
                  Have questions about our platform, need help with your job search, or want to post a job? 
                  We're here to assist you every step of the way.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <MapPinned className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Office Location</h3>
                    <p className="text-muted-foreground">
                      KG 11 Ave, Kigali<br />
                      Kigali, Rwanda
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email Address</h3>
                    <p className="text-muted-foreground">contact@rwandajobhub.com</p>
                    <p className="text-muted-foreground">support@rwandajobhub.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Phone Number</h3>
                    <p className="text-muted-foreground">+250 788 123 456</p>
                    <p className="text-muted-foreground">+250 722 987 654</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Business Hours</h3>
                    <p className="text-muted-foreground">
                      Monday - Friday: 8:00 AM - 6:00 PM<br />
                      Saturday: 9:00 AM - 4:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 p-6 rounded-lg">
                <h3 className="font-semibold mb-3">Quick Support</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  For immediate assistance, check our frequently asked questions or reach out through our support channels.
                </p>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    FAQ & Help Center
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Live Chat Support
                  </Button>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-card border rounded-lg p-8">
              <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" placeholder="John" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input id="lastName" placeholder="Doe" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" type="email" placeholder="john@example.com" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+250 788 123 456" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input id="subject" placeholder="How can we help you?" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Please describe your inquiry in detail..."
                    className="min-h-[120px]"
                    required 
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <input type="checkbox" id="privacy" className="mt-1" required />
                    <label htmlFor="privacy" className="text-sm text-muted-foreground">
                      I agree to the privacy policy and terms of service *
                    </label>
                  </div>

                  <Button type="submit" className="w-full gap-2">
                    <SendHorizontal className="h-4 w-4" />
                    Send Message
                  </Button>
                </div>
              </form>

              <div className="mt-6 pt-6 border-t text-center">
                <p className="text-sm text-muted-foreground">
                  We typically respond within 24 hours during business days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}