"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, Book, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Agente",
    href: "/",
    icon: MessageSquare,
  },
  {
    label: "Livro",
    href: "/recipes",
    icon: Book,
  },
  {
    label: "Perfil",
    href: "/profile",
    icon: User,
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-graphite/10 bg-cream pb-safe pt-2 md:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 p-2 transition-colors",
              isActive ? "text-gold" : "text-graphite/60 hover:text-graphite"
            )}
          >
            <Icon className="h-6 w-6" />
            <span className="text-[10px] uppercase font-medium tracking-wider">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
