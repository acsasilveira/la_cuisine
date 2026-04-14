"use client";

import { useEffect, useState } from "react";
import { Plus, ChevronDown, ChevronUp, Calendar, Utensils, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";

interface MenuItemData {
  id: string;
  category: string;
  recipe_name: string;
  is_new: boolean;
}

interface MenuData {
  id: string;
  title: string;
  occasion: string | null;
  created_at: string;
  items: MenuItemData[];
}

function MenuCard({ menu }: { menu: MenuData }) {
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
                {new Date(menu.created_at).toLocaleDateString("pt-BR", { month: "short", year: "numeric" })}
              </span>
              {menu.occasion && (
                <span className="text-[10px] font-bold uppercase tracking-widest text-graphite/30">
                  {menu.occasion}
                </span>
              )}
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
                {menu.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl bg-cream/50 p-3"
                  >
                    <span className="font-medium text-graphite text-sm">{item.recipe_name}</span>
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
  const [menus, setMenus] = useState<MenuData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await api.get("/api/menus");
        setMenus(response.data);
      } catch (err: any) {
        if (err.response?.status === 401) {
          setError("Faça login para ver seus menus.");
        } else {
          setError("Erro ao carregar menus.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

  return (
    <div className="flex flex-col p-4 md:p-8 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-graphite">Menus de Época</h1>
          <p className="text-graphite/40 font-medium tracking-wide uppercase text-xs mt-1">
            Cardápios sazonais e temáticos
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-graphite/40 text-lg">{error}</p>
        </div>
      ) : menus.length === 0 ? (
        <div className="text-center py-20 space-y-3">
          <p className="font-serif text-2xl text-graphite/30">Nenhum menu criado</p>
          <p className="text-graphite/40 text-sm">Use o Agente para montar seu primeiro menu de época!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menus.map((menu) => (
            <MenuCard key={menu.id} menu={menu} />
          ))}
        </div>
      )}
    </div>
  );
}
