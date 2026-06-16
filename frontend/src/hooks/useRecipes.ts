import { useState, useCallback } from "react";
import { Recipe } from "../domain/entities/Recipe";
import { HttpRecipeRepository } from "../data/repositories/HttpRecipeRepository";

const recipeRepository = new HttpRecipeRepository();

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await recipeRepository.getRecipes();
      setRecipes(data);
    } catch (err: unknown) {
      const apiError = err as { response?: { status?: number } };
      if (apiError.response?.status === 401) {
        setError("Faça login para ver suas receitas.");
      } else {
        setError("Erro ao carregar receitas.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRecipe = useCallback(async (id: string) => {
    setLoading(true);
    setError("");
    try {
      const data = await recipeRepository.getRecipeById(id);
      setRecipe(data);
    } catch (err: unknown) {
      const apiError = err as { response?: { status?: number } };
      if (apiError.response?.status === 404) {
        setError("Receita não encontrada.");
      } else {
        setError("Erro ao carregar receita.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const createRecipe = useCallback(async (newRecipe: Omit<Recipe, "id" | "totalCost" | "costPerServing">) => {
    setLoading(true);
    setError("");
    try {
      const created = await recipeRepository.createRecipe(newRecipe);
      return created;
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { detail?: string } } };
      const msg = apiError.response?.data?.detail || "Erro ao salvar receita.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteRecipe = useCallback(async (id: string) => {
    setLoading(true);
    setError("");
    try {
      await recipeRepository.deleteRecipe(id);
      setRecipes(prev => prev.filter(r => r.id !== id));
    } catch {
      const msg = "Erro ao excluir a receita.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    recipes,
    recipe,
    loading,
    error,
    setError,
    fetchRecipes,
    fetchRecipe,
    createRecipe,
    deleteRecipe,
  };
}
