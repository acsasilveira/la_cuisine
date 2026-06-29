"use client";

import { useEffect, useState } from "react";
import { Plus, ChevronDown, ChevronUp, Calendar, Utensils, Loader2, Sparkles, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMenus } from "@/hooks/useMenus";
import { useRecipes } from "@/hooks/useRecipes";
import { Menu } from "@/domain/entities/Menu";
import { validateMenu } from "@/domain/entities/Menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function MenuCard({ menu, onDelete }: { menu: Menu, onDelete: (id: string) => void }) {
  const { deleteMenu } = useMenus();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Deseja realmente apagar este menu?")) return;
    setIsDeleting(true);
    try {
      if (menu.id) {
        await deleteMenu(menu.id);
        onDelete(menu.id);
      }
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
                {menu.createdAt ? new Date(menu.createdAt).toLocaleDateString("pt-BR", { month: "short", year: "numeric" }) : "—"}
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
            className="absolute top-4 right-4 bg-red-50 text-red-500 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white cursor-pointer"
        >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </button>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex w-full items-center justify-between mt-4 pt-3 border-t border-graphite/5 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gold hover:text-graphite transition-colors cursor-pointer"
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
                {menu.items.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="flex items-center justify-between rounded-xl bg-cream/50 p-3"
                  >
                    <span className="font-medium text-graphite text-sm">{item.recipeName}</span>
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
  const { menus, loading, error, fetchMenus, createMenu, suggestMenu } = useMenus();
  const { recipes, fetchRecipes } = useRecipes();
  
  // Suggestion Modal State
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState("");
  const [suggestCategory, setSuggestCategory] = useState("Entrada");
  const [isSuggesting, setIsSuggesting] = useState(false);

  // Manual Menu Creation State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createTitle, setCreateTitle] = useState("");
  const [createOccasion, setCreateOccasion] = useState("");
  const [createEntrada, setCreateEntrada] = useState("");
  const [createPrincipal, setCreatePrincipal] = useState("");
  const [createSobremesa, setCreateSobremesa] = useState("");
  const [isCreatingManual, setIsCreatingManual] = useState(false);

  useEffect(() => {
    fetchMenus();
    fetchRecipes();
  }, [fetchMenus, fetchRecipes]);

  const handleOpenCreateModal = () => {
    setCreateTitle("");
    setCreateOccasion("");
    setCreateEntrada("");
    setCreatePrincipal("");
    setCreateSobremesa("");
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingManual(true);
    
    const newMenu: Omit<Menu, "id" | "createdAt"> = {
      title: createTitle,
      occasion: createOccasion.trim() || null,
      items: [
        ...(createEntrada.trim() ? [{ category: "Entrada", recipeName: createEntrada.trim(), isNew: false }] : []),
        ...(createPrincipal.trim() ? [{ category: "Prato Principal", recipeName: createPrincipal.trim(), isNew: false }] : []),
        ...(createSobremesa.trim() ? [{ category: "Sobremesa", recipeName: createSobremesa.trim(), isNew: false }] : []),
      ],
    };

    const validationErrors = validateMenu(newMenu);
    if (Object.keys(validationErrors).length > 0) {
      alert(Object.values(validationErrors)[0]);
      setIsCreatingManual(false);
      return;
    }

    try {
      await createMenu(newMenu);
      setIsCreateModalOpen(false);
      fetchMenus(); // reload list
    } catch {
      alert("Erro ao criar menu.");
    } finally {
      setIsCreatingManual(false);
    }
  };

  const handleSuggestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecipeId) return;
    
    setIsSuggesting(true);
    try {
        const suggestion = await suggestMenu(selectedRecipeId, suggestCategory);
        const mainMenu = suggestion.menus[0];

        const newMenu: Omit<Menu, "id" | "createdAt"> = {
            title: `Menu de Degustação - ${mainMenu.justificativa ? "Sugerido" : "Especial"}`,
            occasion: "Sugerido pela IA",
            items: [
                { category: "Entrada", recipeName: mainMenu.entrada.name, isNew: mainMenu.entrada.isNew },
                { category: "Prato Principal", recipeName: mainMenu.principal.name, isNew: mainMenu.principal.isNew },
                { category: "Sobremesa", recipeName: mainMenu.sobremesa.name, isNew: mainMenu.sobremesa.isNew },
            ]
        };

        const validationErrors = validateMenu(newMenu);
        if (Object.keys(validationErrors).length > 0) {
            alert(Object.values(validationErrors)[0]);
            setIsSuggesting(false);
            return;
        }

        await createMenu(newMenu);
        setIsSuggestOpenModal(false);
        fetchMenus(); // reload to show new menu
    } catch {
        alert("Erro ao sugerir menu com IA. Tem certeza que a API Key é válida?");
    } finally {
        setIsSuggesting(false);
    }
  };

  // Helper function to rename references to matches
  const setIsSuggestOpenModal = (open: boolean) => {
    setIsSuggestModalOpen(open);
  };

  // Local state update when onDelete is triggered from MenuCard
  const [localMenus, setLocalMenus] = useState<Menu[]>([]);
  useEffect(() => {
    setLocalMenus(menus);
  }, [menus]);

  // Autocomplete recipes lists grouped by categories
  const starterRecipes = recipes.filter((r) => r.category.toLowerCase().includes("entrada"));
  const mainRecipes = recipes.filter((r) => r.category.toLowerCase().includes("principal"));
  const dessertRecipes = recipes.filter((r) => r.category.toLowerCase().includes("sobremesa"));

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
                className="flex items-center justify-center gap-2 rounded-full border border-gold text-gold px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-all hover:bg-gold hover:text-cream cursor-pointer"
            >
                <Sparkles className="h-4 w-4" />
                <span>Sugerir (IA)</span>
            </button>
            <button 
                onClick={handleOpenCreateModal}
                className="flex items-center justify-center gap-2 rounded-full bg-graphite text-cream px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-all hover:bg-gold active:scale-95 cursor-pointer"
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
      ) : localMenus.length === 0 ? (
        <div className="text-center py-20 space-y-3">
          <p className="font-serif text-2xl text-graphite/30">Nenhum menu criado</p>
          <p className="text-graphite/40 text-sm">Use a Inteligência Artificial para harmonizar o seu primeiro menu!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
          {localMenus.map((menu) => (
            <MenuCard 
                key={menu.id} 
                menu={menu} 
                onDelete={(id) => setLocalMenus(localMenus.filter(m => m.id !== id))}
            />
          ))}
        </div>
      )}

      {/* Suggestion Modal IA */}
      <Dialog open={isSuggestModalOpen} onOpenChange={setIsSuggestModalOpen}>
        <DialogContent className="bg-cream rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative border border-gold/20">
          <DialogHeader className="flex items-center gap-3 mb-6 flex-row">
            <div className="bg-gold/10 p-3 rounded-full">
              <Sparkles className="h-5 w-5 text-gold" />
            </div>
            <DialogTitle className="font-serif text-2xl font-bold text-graphite">Harmonizar Menu</DialogTitle>
          </DialogHeader>

          <DialogDescription className="text-sm text-graphite/60 mb-6">
            Selecione uma receita do seu Livro. A Inteligência Artificial criará um Menu completo harmonizando novos pratos ao redor dela.
          </DialogDescription>

          <form onSubmit={handleSuggestionSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-graphite/60">Receita Pivot</label>
              <select
                required
                value={selectedRecipeId}
                onChange={(e) => setSelectedRecipeId(e.target.value)}
                className="w-full border-b border-graphite/20 bg-transparent py-2.5 text-base outline-none focus:border-gold transition-colors cursor-pointer text-graphite"
              >
                <option value="" disabled className="text-graphite">Escolha uma receita...</option>
                {recipes.map((r) => (
                  <option key={r.id} value={r.id} className="text-graphite">{r.title} ({r.category})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-graphite/60">Que papel ela tem no menu?</label>
              <select
                value={suggestCategory}
                onChange={(e) => setSuggestCategory(e.target.value)}
                className="w-full border-b border-graphite/20 bg-transparent py-2.5 text-base outline-none focus:border-gold transition-colors cursor-pointer text-graphite"
              >
                <option value="Entrada" className="text-graphite">Servida como Entrada</option>
                <option value="Principal" className="text-graphite">Servida como Prato Principal</option>
                <option value="Sobremesa" className="text-graphite">Servida como Sobremesa</option>
              </select>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSuggesting || !selectedRecipeId}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-graphite px-6 py-4 text-sm font-bold tracking-widest text-cream transition-all hover:bg-gold disabled:opacity-50 cursor-pointer"
              >
                {isSuggesting ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Harmonizando... (Pode demorar)</>
                ) : (
                  <><Sparkles className="h-4 w-4" /> Gerar Menu</>
                )}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Manual Menu Creation Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="bg-cream rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative border border-gold/20">
          <DialogHeader className="flex items-center gap-3 mb-6 flex-row">
            <div className="bg-gold/10 p-3 rounded-full">
              <Plus className="h-5 w-5 text-gold" />
            </div>
            <DialogTitle className="font-serif text-2xl font-bold text-graphite">Criar Menu Manual</DialogTitle>
          </DialogHeader>

          <DialogDescription className="text-sm text-graphite/60 mb-6">
            Preencha os detalhes do menu e defina quais pratos farão parte de cada etapa do cardápio.
          </DialogDescription>

          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-graphite/60">Nome do Menu</label>
              <input
                required
                type="text"
                placeholder="Ex: Menu Especial de Fim de Ano"
                value={createTitle}
                onChange={(e) => setCreateTitle(e.target.value)}
                className="w-full border-b border-graphite/20 bg-transparent py-2.5 text-base outline-none focus:border-gold transition-colors text-graphite"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-graphite/60">Ocasião</label>
              <input
                type="text"
                placeholder="Ex: Jantar em Família"
                value={createOccasion}
                onChange={(e) => setCreateOccasion(e.target.value)}
                className="w-full border-b border-graphite/20 bg-transparent py-2.5 text-base outline-none focus:border-gold transition-colors text-graphite"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-graphite/60">Entrada</label>
              <input
                type="text"
                list="starter-options"
                placeholder="Selecione ou digite a entrada"
                value={createEntrada}
                onChange={(e) => setCreateEntrada(e.target.value)}
                className="w-full border-b border-graphite/20 bg-transparent py-2.5 text-base outline-none focus:border-gold transition-colors text-graphite"
              />
              <datalist id="starter-options">
                {starterRecipes.map((r) => (
                  <option key={r.id} value={r.title} />
                ))}
              </datalist>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-graphite/60">Prato Principal</label>
              <input
                type="text"
                list="main-options"
                placeholder="Selecione ou digite o prato principal"
                value={createPrincipal}
                onChange={(e) => setCreatePrincipal(e.target.value)}
                className="w-full border-b border-graphite/20 bg-transparent py-2.5 text-base outline-none focus:border-gold transition-colors text-graphite"
              />
              <datalist id="main-options">
                {mainRecipes.map((r) => (
                  <option key={r.id} value={r.title} />
                ))}
              </datalist>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-graphite/60">Sobremesa</label>
              <input
                type="text"
                list="dessert-options"
                placeholder="Selecione ou digite a sobremesa"
                value={createSobremesa}
                onChange={(e) => setCreateSobremesa(e.target.value)}
                className="w-full border-b border-graphite/20 bg-transparent py-2.5 text-base outline-none focus:border-gold transition-colors text-graphite"
              />
              <datalist id="dessert-options">
                {dessertRecipes.map((r) => (
                  <option key={r.id} value={r.title} />
                ))}
              </datalist>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isCreatingManual || !createTitle.trim()}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-graphite px-6 py-4 text-sm font-bold tracking-widest text-cream transition-all hover:bg-gold disabled:opacity-50 cursor-pointer"
              >
                {isCreatingManual ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Salvando...</>
                ) : (
                  <><Plus className="h-4 w-4" /> Criar Menu</>
                )}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
