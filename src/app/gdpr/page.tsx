import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, UserCheck, FileText, Mail, Phone } from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "GDPR | Tic-Tac-Toe",
  description: "Learn how we protect your personal data and respect your privacy under the GDPR. This page explains your rights, how we collect and process your data, and how you can manage your privacy settings",
  openGraph: {
    title: "GDPR | Tic-Tac-Toe",
    description: "Learn how we protect your personal data and respect your privacy under the GDPR. This page explains your rights, how we collect and process your data, and how you can manage your privacy settings",
    url: "https://13682ac4.app.deploy.tourde.app/gdpr",
    siteName: "Tic-Tac-Toe",
    type: "website",
  },
}

export default function GDPRPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">GDPR Compliance</h1>

      <div className="max-w-3xl mx-auto mb-12">
        <p className="text-lg mb-4">
          Your privacy is important to us and we are committed to handling your personal data responsibly and in
          accordance with Regulation (EU) 2016/679 of the European Parliament and of the Council, known as the General
          Data Protection Regulation (GDPR).
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12">
        <Card>
          <CardHeader>
            <Shield className="w-8 h-8 mb-2 text-primary" />
            <CardTitle>Data Protection</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>We ensure the security and privacy of your personal data.</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <UserCheck className="w-8 h-8 mb-2 text-primary" />
            <CardTitle>User Rights</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>You have the right to access, rectify, and erase your personal data.</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <FileText className="w-8 h-8 mb-2 text-primary" />
            <CardTitle>Transparency</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>We provide clear information about how we process your data.</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Mail className="w-8 h-8 mb-2 text-primary" />
            <CardTitle>Consent</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>We obtain explicit consent for processing your personal data.</CardDescription>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-3xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="what-data-we-process">
            <AccordionTrigger>What data do we process?</AccordionTrigger>
            <AccordionContent>
              We only process data that is necessary to provide our services, comply with legal obligations or based on
              your consent. This data may include:
              <ul className="list-disc pl-5 mt-2">
                <li>Data collected when using our platform (e.g. IP address, cookies)</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="purpose-of-processing">
            <AccordionTrigger>For what purpose do we process the data?</AccordionTrigger>
            <AccordionContent>
              We use your data for:
              <ul className="list-disc pl-5 mt-2">
                <li>Providing our services and products</li>
                <li>Communicating with you (answering queries, sending you information)</li>
                <li>Improving our services through usage analysis</li>
                <li>Complying with legal obligations</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="data-protection">
            <AccordionTrigger>How do we protect your data?</AccordionTrigger>
            <AccordionContent>
              Your personal data is safe with us. We use modern technical and organisational measures to minimise the
              risk of unauthorised access, loss or misuse of your data.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="max-w-3xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
        <p className="mb-4">
          Under the GDPR, you have the following rights in relation to the processing of personal data:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Right of access:</strong> You can request a copy of the data we hold about you.
          </li>
          <li>
            <strong>Right to rectification:</strong> If your data is inaccurate, you have the right to have it
            corrected.
          </li>
          <li>
            <strong>Right to erasure:</strong> Under certain conditions, you can ask for your data to be deleted.
          </li>
          <li>
            <strong>Right to restriction of processing:</strong> You have the right to request restriction of the
            processing of your data.
          </li>
          <li>
            <strong>Right to portability:</strong> You can request your data in a machine-readable format.
          </li>
          <li>
            <strong>Right to object:</strong> You can object to the processing of your data for marketing purposes at
            any time.
          </li>
        </ul>
      </div>

      <div className="max-w-3xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold mb-4">Contact</h2>
        <p className="mb-4">
          If you have any questions about the processing of your personal data or wish to exercise your rights, please
          contact us at:
        </p>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center">
            <Mail className="w-5 h-5 mr-2 flex-shrink-0" />
            <Link
              href="mailto:info@tda.cz"
              className="hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
              aria-label="Send email to info@tda.cz"
            >
              Email: info@tda.cz
            </Link>
          </div>
          <div className="flex items-center">
            <Phone className="w-5 h-5 mr-2 flex-shrink-0" />
            <Link
              href="tel:+420254456789"
              className="hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
              aria-label="Call 254 456 789"
            >
              Phone: +420 254 456 789
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <Button asChild>
          <Link href="/contact">Contact Us!</Link>
        </Button>
      </div>
    </div>
  )
}

