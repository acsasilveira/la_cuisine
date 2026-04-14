"use client";

import { RecipeCard } from "./RecipeCard";

const mockRecipes = [
  {
    id: "1",
    title: "Risoto de Cogumelos Trufado",
    category: "Prato Principal",
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=800&auto=format&fit=crop",
    cost: "R$ 42,00",
    yield: "2 porções",
  },
  {
    id: "2",
    title: "Mousse de Chocolate com Flor de Sal",
    category: "Sobremesa",
    image: "https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?q=80&w=800&auto=format&fit=crop",
    cost: "R$ 15,50",
    yield: "4 porções",
  },
  {
    id: "3",
    title: "Salada Caesar Clássica",
    category: "Entrada",
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=800&auto=format&fit=crop",
    cost: "R$ 12,00",
    yield: "1 porção",
  },
  {
    id: "4",
    title: "Filé Mignon ao Poivre",
    category: "Prato Principal",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop",
    cost: "R$ 68,00",
    yield: "1 porção",
  },
];

export function RecipeGrid() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
      {mockRecipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}
