import type React from "react"
import Link from "next/link"

const Container = ({ children }: { children: React.ReactNode }) => (
  <div className="container mx-auto px-4 py-8 max-w-4xl">{children}</div>
)

export default function TermsOfService() {
  return (
    <Container>
      <h1 className="text-4xl font-extrabold mb-8 border-b pb-2">Terms of Service</h1>

      <p className="text-sm text-gray-600 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-primary">1. Acceptance of Terms</h2>
        <p className="mb-4 leading-relaxed">
          By accessing and using this website, you accept and agree to be bound by the terms and provision of this
          agreement.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-primary">2. Use License</h2>
        <p className="mb-4 leading-relaxed">
          Permission is granted to temporarily download one copy of the materials (information or software) on our
          website for personal, non-commercial transitory viewing only.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-primary">3. Disclaimer</h2>
        <p className="mb-4 leading-relaxed">
          The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied,
          and hereby disclaim and negate all other warranties including, without limitation, implied warranties or
          conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property
          or other violation of rights.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-primary">4. Limitations</h2>
        <p className="mb-4 leading-relaxed">
          In no event shall we or our suppliers be liable for any damages (including, without limitation, damages for
          loss of data or profit, or due to business interruption) arising out of the use or inability to use the
          materials on our website, even if we or an authorized representative has been notified orally or in writing of
          the possibility of such damage.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-primary">5. Revisions and Errata</h2>
        <p className="mb-4 leading-relaxed">
          The materials appearing on our website could include technical, typographical, or photographic errors. We do
          not warrant that any of the materials on our website are accurate, complete, or current. We may make changes
          to the materials contained on our website at any time without notice.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-primary">6. Links</h2>
        <p className="mb-4 leading-relaxed">
          We have not reviewed all of the sites linked to our website and are not responsible for the contents of any
          such linked site. The inclusion of any link does not imply endorsement by us of the site. Use of any such
          linked website is at the user's own risk.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-primary">7. Governing Law</h2>
        <p className="mb-4 leading-relaxed">
          Any claim relating to our website shall be governed by the laws of the country in which we operate without
          regard to its conflict of law provisions.
        </p>
      </section>

      <div className="mt-12 text-center">
        <Link href="/" className="text-primary hover:text-indigo-800 font-medium transition-colors">
          Back to Home
        </Link>
      </div>
    </Container>
  )
}

