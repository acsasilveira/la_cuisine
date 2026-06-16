import type { Metadata } from "next";
import { Playfair_Display, Montserrat, Geist } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { AppShell } from "@/components/nav/AppShell";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
      className={cn("h-full", "antialiased", playfair.variable, montserrat.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex font-sans bg-cream text-graphite overflow-x-hidden">
        <QueryProvider>
          <AppShell>{children}</AppShell>
        </QueryProvider>
      </body>
    </html>
  );
}
