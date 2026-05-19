"use client";

import { useEffect, useState } from "react";
import { Plus, ChevronDown, ChevronUp, Calendar, Utensils, Loader2, Sparkles, Trash2, X } from "lucide-react";
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

interface Recipe {
  id: string;
  title: string;
  category: string;
}

function MenuCard({ menu, onDelete }: { menu: MenuData, onDelete: (id: string) => void }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if(!window.confirm("Deseja realmente apagar este menu?")) return;
    setIsDeleting(true);
    try {
        await api.delete(`/api/menus/${menu.id}`);
        onDelete(menu.id);
    } catch {
        alert("Falha ao deletar menu.");
    } finally {
        setIsDeleting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-graphite/5 bg-card overflow-hidden transition-all hover:shadow-md relative group">
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
          <div className="rounded-xl bg-gold/10 p-2 flex gap-2">
            <Utensils className="h-5 w-5 text-gold" />
          </div>
        </div>

        {/* Delete button absolutely positioned on top right */}
        <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="absolute top-4 right-4 bg-red-50 text-red-500 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
        >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </button>

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
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Suggestion Modal State
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState("");
  const [suggestCategory, setSuggestCategory] = useState("Entrada");
  const [isSuggesting, setIsSuggesting] = useState(false);

  const fetchMenus = async () => {
    try {
      const ms = await api.get("/api/menus");
      setMenus(ms.data);
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

  const fetchRecipes = async () => {
      try {
          const rs = await api.get("/api/recipes");
          setRecipes(rs.data);
      } catch (err) { }
  }

  useEffect(() => {
    fetchMenus();
    fetchRecipes();
  }, []);

  const handleSuggestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!selectedRecipeId) return;
    
    setIsSuggesting(true);
    try {
        const response = await api.post("/api/menus/suggest", {
            recipe_id: selectedRecipeId,
            category: suggestCategory,
        });
        
        const suggestedMenus = response.data.menus;
        const mainMenu = suggestedMenus[0];

        // Format and create real menu using suggestion
        await api.post("/api/menus", {
            title: `Menu de Degustação - ${mainMenu.justificativa ? "Sugerido" : "Especial"}`,
            occasion: "Sugerido pela IA",
            items: [
                { category: "Entrada", recipe_name: mainMenu.entrada.name, is_new: mainMenu.entrada.is_new },
                { category: "Prato Principal", recipe_name: mainMenu.principal.name, is_new: mainMenu.principal.is_new },
                { category: "Sobremesa", recipe_name: mainMenu.sobremesa.name, is_new: mainMenu.sobremesa.is_new },
            ]
        });

        setIsSuggestModalOpen(false);
        fetchMenus(); // reload to show new menu
    } catch (err) {
        alert("Erro ao sugar menu com IA. Tem certeza que a API Key é válida?");
    } finally {
        setIsSuggesting(false);
    }
  }

  return (
    <div className="flex flex-col p-4 md:p-8 max-w-4xl mx-auto w-full relative">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 border-b border-graphite/5 pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-graphite">Menus de Época</h1>
          <p className="text-graphite/40 font-medium tracking-wide uppercase text-xs mt-1">
            Cardápios sazonais e temáticos
          </p>
        </div>
        
        <div className="flex items-center gap-2">
            <button 
                onClick={() => setIsSuggestModalOpen(true)}
                className="flex items-center justify-center gap-2 rounded-full border border-gold text-gold px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-all hover:bg-gold hover:text-cream"
            >
                <Sparkles className="h-4 w-4" />
                <span>Sugerir (IA)</span>
            </button>
            <button 
                className="flex items-center justify-center gap-2 rounded-full bg-graphite text-cream px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-all hover:bg-gold active:scale-95"
            >
                <Plus className="h-4 w-4" />
                <span>Criar Vazio</span>
            </button>
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
          <p className="text-graphite/40 text-sm">Use a Inteligência Artificial para harmonizar o seu primeiro menu!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
          {menus.map((menu) => (
            <MenuCard 
                key={menu.id} 
                menu={menu} 
                onDelete={(id) => setMenus(menus.filter(m => m.id !== id))}
            />
          ))}
        </div>
      )}

      {/* Suggestion Modal IA */}
      <AnimatePresence>
        {isSuggestModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-graphite/20 backdrop-blur-sm p-4">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-cream rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative border border-gold/20"
                >
                    <button 
                        onClick={() => !isSuggesting && setIsSuggestModalOpen(false)}
                        className="absolute right-4 top-4 p-2 rounded-full hover:bg-graphite/5 text-graphite/40"
                    >
                        <X className="h-5 w-5" />
                    </button>
                    
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-gold/10 p-3 rounded-full">
                            <Sparkles className="h-5 w-5 text-gold" />
                        </div>
                        <h2 className="font-serif text-2xl font-bold text-graphite">Harmonizar Menu</h2>
                    </div>

                    <p className="text-sm text-graphite/60 mb-6">
                        Selecione uma receita do seu Livro. A Inteligência Artificial criará um Menu completo harmonizando novos pratos ao redor dela.
                    </p>

                    <form onSubmit={handleSuggestionSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-graphite/60">Receita Pivot</label>
                            <select 
                                required
                                value={selectedRecipeId}
                                onChange={(e) => setSelectedRecipeId(e.target.value)}
                                className="w-full border-b border-graphite/20 bg-transparent py-2.5 text-base outline-none focus:border-gold transition-colors cursor-pointer"
                            >
                                <option value="" disabled>Escolha uma receita...</option>
                                {recipes.map((r) => (
                                    <option key={r.id} value={r.id}>{r.title} ({r.category})</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-graphite/60">Que papel ela tem no menu?</label>
                            <select 
                                value={suggestCategory}
                                onChange={(e) => setSuggestCategory(e.target.value)}
                                className="w-full border-b border-graphite/20 bg-transparent py-2.5 text-base outline-none focus:border-gold transition-colors cursor-pointer"
                            >
                                <option value="Entrada">Servida como Entrada</option>
                                <option value="Principal">Servida como Prato Principal</option>
                                <option value="Sobremesa">Servida como Sobremesa</option>
                            </select>
                        </div>
                        
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isSuggesting || !selectedRecipeId}
                                className="flex w-full items-center justify-center gap-2 rounded-full bg-graphite px-6 py-4 text-sm font-bold tracking-widest text-cream transition-all hover:bg-gold disabled:opacity-50"
                            >
                                {isSuggesting ? (
                                    <><Loader2 className="h-4 w-4 animate-spin" /> Harmonizando... (Pode demorar)</>
                                ) : (
                                    <><Sparkles className="h-4 w-4" /> Gerar Menu</>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
}
