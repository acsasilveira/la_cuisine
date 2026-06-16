import { api } from "../../lib/api";
import { Recipe } from "../../domain/entities/Recipe";
import { RecipeRepository } from "../../domain/repositories/RecipeRepository";
import { RecipeMapper } from "../mappers/RecipeMapper";
import { RecipeDTO } from "../dtos/RecipeDTO";

export class HttpRecipeRepository implements RecipeRepository {
  async getRecipes(): Promise<Recipe[]> {
    const response = await api.get<RecipeDTO[]>("/api/recipes");
    return response.data.map(dto => RecipeMapper.toDomain(dto));
  }

  async getRecipeById(id: string): Promise<Recipe> {
    const response = await api.get<RecipeDTO>(`/api/recipes/${id}`);
    return RecipeMapper.toDomain(response.data);
  }

  async createRecipe(recipe: Omit<Recipe, "id" | "totalCost" | "costPerServing">): Promise<Recipe> {
    const dto = RecipeMapper.toCreateDTO(recipe);
    const response = await api.post<RecipeDTO>("/api/recipes", dto);
    return RecipeMapper.toDomain(response.data);
  }

  async deleteRecipe(id: string): Promise<void> {
    await api.delete(`/api/recipes/${id}`);
  }
}
