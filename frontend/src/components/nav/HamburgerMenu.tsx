"use client";

import { useState } from "react";
import { Menu, X, Book, MessageSquare, ChefHat, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

const menuItems = [
  { label: "O Agente", href: "/", icon: MessageSquare },
  { label: "Livro de Receitas", href: "/recipes", icon: Book },
  { label: "Menus de Época", href: "/menus", icon: ChefHat },
];

export function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-graphite hover:text-gold transition-colors"
        aria-label="Abrir Menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-[70] w-4/5 max-w-xs bg-cream p-6 shadow-2xl"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-12">
                  <span className="font-serif text-2xl font-bold text-graphite">
                    LaCuisine
                  </span>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 text-graphite hover:text-gold transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <nav className="flex flex-col gap-6">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-4 text-lg font-medium text-graphite/80 hover:text-gold transition-colors group"
                      >
                        <Icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>

                <div className="mt-auto border-t border-graphite/10 pt-6">
                  <button className="flex items-center gap-4 text-graphite/60 hover:text-red-500 transition-colors">
                    <LogOut className="h-5 w-5" />
                    Sair da Conta
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
