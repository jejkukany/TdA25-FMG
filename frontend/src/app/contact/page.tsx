import { ContactForm } from "@/components/custom/contact/ContactForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube } from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Contact Us | Tic-Tac-Toe",
  description: "Have questions, feedback, or need support? We would love to hear from you! Reach out to us via our contact form, email, or social media, and we will get back to you as soon as possible.",
  openGraph: {
    title: "GDPR | Tic-Tac-Toe",
    description: "Have questions, feedback, or need support? We would love to hear from you! Reach out to us via our contact form, email, or social media, and we will get back to you as soon as possible.",
    url: "https://13682ac4.app.deploy.tourde.app/contact",
    siteName: "Tic-Tac-Toe",
    type: "website",
  },
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>

      <div className="max-w-4xl mx-auto mb-12">
        <p className="text-lg mb-4 text-center">
          We are here to help and answer any question you might have. We look forward to hearing from you.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardHeader>
            <CardTitle className="text-2xl">Get in Touch</CardTitle>
            <CardDescription>We are just a message away</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 bg-background/60 p-3 rounded-lg">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <a
                    href="mailto:info@tda.cz"
                    className="text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                  >
                    info@tda.cz
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-4 bg-background/60 p-3 rounded-lg">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <a
                    href="tel:+420254456789"
                    className="text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                  >
                    +420 254 456 789
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-4 bg-background/60 p-3 rounded-lg">
                <div className="bg-primary/10 p-2 rounded-full">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-sm">Křenová 89/19, 602 00 Brno, Czech Republic</p>
                </div>
              </div>
            </div>
            <div className="flex space-x-4 mt-6 justify-center">
              <Link href="https://www.facebook.com/tourdeapp" target="_blank" rel="noopener noreferrer">
                <Facebook className="w-6 h-6 text-primary hover:text-primary/80" />
              </Link>
              <Link href="https://www.instagram.com/tourdeapp/" target="_blank" rel="noopener noreferrer">
                <Instagram className="w-6 h-6 text-primary hover:text-primary/80" />
              </Link>
              <Link href="https://www.youtube.com/studentcybergames" target="_blank" rel="noopener noreferrer">
                <Youtube className="w-6 h-6 text-primary hover:text-primary/80" />
              </Link>
            </div>
          </CardContent>
        </Card>

        <ContactForm />
      </div>

      <div className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Our Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-muted flex items-center justify-center">
              <MapPin className="w-12 h-12 text-primary" />
              <span className="ml-2 text-lg">Map Placeholder</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

