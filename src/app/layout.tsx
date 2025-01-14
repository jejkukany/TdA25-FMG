import type { Metadata } from "next";
import "./globals.css";

import { Dosis } from "next/font/google";
import SideBar from "@/components/custom/Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/ui/theme-provider";
import QueryProvider from "@/components/provider/QueryClientProvider";
import { cookies } from "next/headers";

const dosis = Dosis({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-dosis",
});

export const metadata: Metadata = {
  title: "Tic-Tac-Toe",
  description:
    "Tic-Tac-Toe Game project made by three young developers for the TourDeApp competition",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dosis.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider defaultOpen={defaultOpen}>
            <SideBar />
            <QueryProvider>
              <div className="w-full min-h-screen">
                <SidebarTrigger />
                {children}
              </div>
            </QueryProvider>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
