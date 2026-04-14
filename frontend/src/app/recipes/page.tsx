import { RecipeGrid } from "@/components/recipes/RecipeGrid";

export default function RecipesPage() {
  return (
    <div className="flex flex-col p-4 md:p-8 max-w-6xl mx-auto w-full">
      <header className="mb-8 space-y-1">
        <h1 className="font-serif text-3xl font-bold text-graphite">Seu Livro de Receitas</h1>
        <p className="text-graphite/40 font-medium tracking-wide uppercase text-xs">Coleção do Chef autônomo</p>
      </header>

      <RecipeGrid />
    </div>
  );
}
