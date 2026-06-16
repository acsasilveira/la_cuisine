import { Recipe } from "../entities/Recipe";

export interface RecipeRepository {
  getRecipes(): Promise<Recipe[]>;
  getRecipeById(id: string): Promise<Recipe>;
  createRecipe(recipe: Omit<Recipe, "id" | "totalCost" | "costPerServing">): Promise<Recipe>;
  deleteRecipe(id: string): Promise<void>;
}
