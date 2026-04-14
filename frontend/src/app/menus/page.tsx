"use client";

import { useState } from "react";
import { Plus, ChevronDown, ChevronUp, Calendar, Utensils } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MenuItem {
  name: string;
  category: string;
}

interface Menu {
  id: string;
  title: string;
  occasion: string;
  date: string;
  items: MenuItem[];
}

const mockMenus: Menu[] = [
  {
    id: "1",
    title: "Menu Junino Especial",
    occasion: "Festa Junina",
    date: "Jun 2026",
    items: [
      { name: "Canjica Cremosa", category: "Sobremesa" },
      { name: "Escondidinho de Charque", category: "Prato Principal" },
      { name: "Bolo de Milho", category: "Sobremesa" },
      { name: "Quentão Artesanal", category: "Bebida" },
    ],
  },
  {
    id: "2",
    title: "Cardápio Primavera",
    occasion: "Época / Temporada",
    date: "Set 2026",
    items: [
      { name: "Salada de Flores Comestíveis", category: "Entrada" },
      { name: "Risoto de Aspargos", category: "Prato Principal" },
      { name: "Pavlova de Maracujá", category: "Sobremesa" },
    ],
  },
  {
    id: "3",
    title: "Ceia de Natal Gourmet",
    occasion: "Natal",
    date: "Dez 2026",
    items: [
      { name: "Terrine de Foie Gras", category: "Entrada" },
      { name: "Peru ao Molho de Champagne", category: "Prato Principal" },
      { name: "Rabanada Trufada", category: "Sobremesa" },
      { name: "Chester com Ervas Finas", category: "Prato Principal" },
    ],
  },
];

function MenuCard({ menu }: { menu: Menu }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-2xl border border-graphite/5 bg-card overflow-hidden transition-all hover:shadow-md">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-serif text-xl font-bold text-graphite leading-tight">
              {menu.title}
            </h3>
            <div className="flex items-center gap-3 mt-2">
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-gold">
                <Calendar className="h-3 w-3" />
                {menu.date}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-graphite/30">
                {menu.occasion}
              </span>
            </div>
          </div>
          <div className="rounded-xl bg-gold/10 p-2">
            <Utensils className="h-5 w-5 text-gold" />
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex w-full items-center justify-between mt-4 pt-3 border-t border-graphite/5 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gold hover:text-graphite transition-colors"
        >
          <span>{menu.items.length} Pratos no Menu</span>
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="pt-4 space-y-3">
                {menu.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-xl bg-cream/50 p-3"
                  >
                    <span className="font-medium text-graphite text-sm">{item.name}</span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-graphite/30 bg-graphite/5 px-2 py-1 rounded-lg">
                      {item.category}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function MenusPage() {
  return (
    <div className="flex flex-col p-4 md:p-8 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-graphite">Menus de Época</h1>
          <p className="text-graphite/40 font-medium tracking-wide uppercase text-xs mt-1">
            Cardápios sazonais e temáticos
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-xs font-bold uppercase tracking-widest text-cream transition-all hover:bg-graphite active:scale-95">
          <Plus className="h-4 w-4" />
          Novo Menu
        </button>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockMenus.map((menu) => (
          <MenuCard key={menu.id} menu={menu} />
        ))}
      </div>
    </div>
  );
}
