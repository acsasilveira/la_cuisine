import { Recipe, Ingredient, RecipeStep } from "../../domain/entities/Recipe";
import { RecipeDTO, RecipeCreateDTO, RecipeStepDTO } from "../dtos/RecipeDTO";

export class RecipeMapper {
  static toDomain(dto: RecipeDTO): Recipe {
    const ingredients: Ingredient[] = dto.ingredients.map(ing => ({
      name: ing.ingredient?.name || "",
      amount: ing.amount,
      unit: ing.unit,
    }));

    const steps: RecipeStep[] = dto.steps.map(step => ({
      stepNumber: step.step_number,
      instruction: step.instruction,
    }));

    const categoryMap: Record<string, string> = {
      appetizer: "Entrada",
      main: "Prato Principal",
      dessert: "Sobremesa",
      other: "Outro"
    };
    const translatedCategory = categoryMap[dto.category.toLowerCase()] || dto.category;

    return {
      id: dto.id,
      title: dto.title,
      category: translatedCategory,
      yieldAmount: dto.yield_amount,
      yieldUnit: dto.yield_unit,
      prepTimeMinutes: dto.prep_time_minutes,
      style: dto.style,
      ingredients,
      steps,
      imageUrl: dto.image_url || undefined,
      totalCost: dto.total_cost || undefined,
      costPerServing: dto.cost_per_serving || undefined,
    };
  }

  static toCreateDTO(domain: Omit<Recipe, "id" | "totalCost" | "costPerServing">): RecipeCreateDTO {
    const ingredients = domain.ingredients.map(ing => ({
      name: ing.name,
      amount: ing.amount,
      unit: ing.unit,
    }));

    const steps: RecipeStepDTO[] = domain.steps.map(step => ({
      step_number: step.stepNumber,
      instruction: step.instruction,
    }));

    const categoryMap: Record<string, string> = {
      "entrada": "appetizer",
      "prato principal": "main",
      "sobremesa": "dessert",
      "acompanhamento": "other",
      "bebida": "other",
      "outro": "other"
    };
    const backendCategory = categoryMap[domain.category.toLowerCase()] || "other";

    return {
      title: domain.title,
      category: backendCategory,
      yield_amount: domain.yieldAmount,
      yield_unit: domain.yieldUnit,
      prep_time_minutes: domain.prepTimeMinutes,
      style: domain.style,
      ingredients,
      steps,
    };
  }
}
