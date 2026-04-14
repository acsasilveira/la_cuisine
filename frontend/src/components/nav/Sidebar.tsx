"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, Book, User, ChefHat, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";

const navItems = [
  { label: "O Agente", href: "/", icon: MessageSquare },
  { label: "Livro de Receitas", href: "/recipes", icon: Book },
  { label: "Menus de Época", href: "/menus", icon: ChefHat },
  { label: "Meu Perfil", href: "/profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 border-r border-graphite/5 bg-cream md:flex flex-col p-8">
      <div className="mb-12">
        <span className="font-serif text-3xl font-bold tracking-tight text-graphite">
          LaCuisine
        </span>
        {user && (
          <p className="text-xs text-graphite/40 mt-1 truncate">Olá, {user.full_name}</p>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-8">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 text-sm font-bold uppercase tracking-widest transition-all group",
                isActive 
                  ? "text-gold" 
                  : "text-graphite/40 hover:text-graphite"
              )}
            >
              <div className={cn(
                "p-2 rounded-xl transition-all",
                isActive ? "bg-gold/10" : "bg-transparent group-hover:bg-graphite/5"
              )}>
                <Icon className="h-5 w-5" />
              </div>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-graphite/5 pt-8">
        <button
          onClick={logout}
          className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-graphite/30 hover:text-red-500 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sair da Conta
        </button>
      </div>
    </aside>
  );
}
