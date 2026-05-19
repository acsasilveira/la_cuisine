import { RecipeGrid } from "@/components/recipes/RecipeGrid";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function RecipesPage() {
  return (
    <div className="flex flex-col p-4 md:p-8 max-w-6xl mx-auto w-full">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 border-b border-graphite/5 pb-6">
        <div className="space-y-1">
            <h1 className="font-serif text-3xl font-bold text-graphite">Seu Livro de Receitas</h1>
            <p className="text-graphite/40 font-medium tracking-wide uppercase text-xs">Coleção do Chef autônomo</p>
        </div>
        <Link 
            href="/recipes/new"
            className="flex items-center justify-center gap-2 rounded-full bg-graphite px-6 py-3 text-sm font-bold tracking-widest text-cream transition-all hover:bg-gold active:scale-95"
        >
            <Plus className="h-4 w-4" />
            <span>Nova Receita</span>
        </Link>
      </header>

      <RecipeGrid />
    </div>
  );
}
