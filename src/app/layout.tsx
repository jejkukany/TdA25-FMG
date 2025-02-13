import type { Metadata } from "next"
import "./globals.css"

import { Dosis } from "next/font/google"
import SideBar from "@/components/custom/Sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeProvider } from "@/components/ui/theme-provider"
import QueryProvider from "@/components/provider/QueryClientProvider"
import { cookies } from "next/headers"
import { Footer } from "@/components/custom/Footer"


const dosis = Dosis({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-dosis",
})

export const metadata: Metadata = {
  title: "Tic-Tac-Toe",
  description: "Challenge your strategy in this ultimate Tic-Tac-Toe showdown! 🏆 Play against friends or test your skills solo—every move counts in this fast-paced battle of Xs and Os. Can you outsmart your opponent and claim victory?",
  icons: {
    icon: [
      { url: "/favicon.svg" },
      { url: "/favicon.svg", sizes: "16x16", type: "image/png" },
      { url: "/favicon.svg", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/favicon.svg" }],
  },
  openGraph: {
    title: "Tic-Tac-Toe",
    description: "Challenge your strategy in this ultimate Tic-Tac-Toe showdown! 🏆 Play against friends, ranked opponents or test your skills solo—every move counts in this fast-paced battle of Xs and Os. Can you outsmart your opponent and claim victory?",
    url: "https://13682ac4.app.deploy.tourde.app/",
    siteName: "Tic-Tac-Toe",
    type: "website",
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true"
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dosis.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SidebarProvider defaultOpen={defaultOpen}>
            <SideBar />
            <QueryProvider>
              <div className="w-full min-h-screen flex flex-col">
                <SidebarTrigger />
                <main className="flex-grow">{children}</main>
                <Footer />
              </div>
            </QueryProvider>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}