import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/nav/BottomNav";
import { HamburgerMenu } from "@/components/nav/HamburgerMenu";
import { Sidebar } from "@/components/nav/Sidebar";
import { QueryProvider } from "@/providers/QueryProvider";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LaCuisine",
  description: "Gerenciamento culinário inteligente para chefs autônomos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${playfair.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex font-sans bg-cream text-graphite overflow-x-hidden">
        <QueryProvider>
          <Sidebar />

          <div className="flex flex-1 flex-col md:pl-64">
            {/* Mobile Top Bar */}
            <header className="fixed top-0 left-0 right-0 z-40 flex h-16 items-center justify-between border-b border-graphite/5 bg-cream/80 px-4 backdrop-blur-md md:hidden">
              <HamburgerMenu />
              <span className="font-serif text-xl font-bold tracking-tight">LaCuisine</span>
              <div className="w-10" /> {/* Spacer */}
            </header>

            <main className="flex-1 pb-16 pt-16 md:pb-0 md:pt-0">
              {children}
            </main>

            <BottomNav />
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
