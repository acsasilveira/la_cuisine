"use client";

import { useEffect } from "react";
import { RecipeCard } from "./RecipeCard";
import { useRecipes } from "@/hooks/useRecipes";
import { Loader2 } from "lucide-react";

export function RecipeGrid() {
  const { recipes, loading, error, fetchRecipes } = useRecipes();

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-graphite/40 text-lg">{error}</p>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="text-center py-20 space-y-3">
        <p className="font-serif text-2xl text-graphite/30">Nenhuma receita ainda</p>
        <p className="text-graphite/40 text-sm">Use o Agente para criar sua primeira receita!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={{
            id: recipe.id || "",
            title: recipe.title,
            category: recipe.category,
            image: recipe.imageUrl || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=800&auto=format&fit=crop",
            cost: recipe.totalCost ? `R$ ${recipe.totalCost.toFixed(2)}` : "Não calculado",
            yield: `${recipe.yieldAmount} ${recipe.yieldUnit}`,
          }}
        />
      ))}
    </div>
  );
}
