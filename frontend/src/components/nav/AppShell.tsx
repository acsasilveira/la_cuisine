"use client";

import { usePathname } from "next/navigation";
import { AuthProvider } from "@/providers/AuthProvider";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { HamburgerMenu } from "./HamburgerMenu";

const publicRoutes = ["/login", "/register"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicRoute = publicRoutes.includes(pathname);

  return (
    <AuthProvider>
      {isPublicRoute ? (
        // Páginas de login/register: layout limpo, sem navegação
        <div className="flex flex-1 flex-col">
          <main className="flex-1">{children}</main>
        </div>
      ) : (
        // Páginas autenticadas: com sidebar, header e bottom nav
        <>
          <Sidebar />
          <div className="flex flex-1 flex-col md:pl-64">
            <header className="fixed top-0 left-0 right-0 z-40 flex h-16 items-center justify-between border-b border-graphite/5 bg-cream/80 px-4 backdrop-blur-md md:hidden">
              <HamburgerMenu />
              <span className="font-serif text-xl font-bold tracking-tight">LaCuisine</span>
              <div className="w-10" />
            </header>

            <main className="flex-1 pb-16 pt-16 md:pb-0 md:pt-0">
              {children}
            </main>

            <BottomNav />
          </div>
        </>
      )}
    </AuthProvider>
  );
}
