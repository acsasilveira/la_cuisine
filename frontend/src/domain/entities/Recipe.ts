export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

export interface RecipeStep {
  stepNumber: number;
  instruction: string;
}

export interface Recipe {
  id?: string;
  title: string;
  category: string;
  yieldAmount: number;
  yieldUnit: string;
  prepTimeMinutes: number;
  style: string;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  imageUrl?: string;
  totalCost?: number;
  costPerServing?: number;
}

export interface RecipeValidationError {
  title?: string;
  category?: string;
  yieldAmount?: string;
  yieldUnit?: string;
  prepTimeMinutes?: string;
  style?: string;
  ingredients?: string;
  steps?: string;
}

export function validateRecipe(recipe: Partial<Recipe>): RecipeValidationError {
  const errors: RecipeValidationError = {};

  if (!recipe.title || recipe.title.trim().length < 3) {
    errors.title = "O título da receita deve ter pelo menos 3 caracteres.";
  }

  if (!recipe.category || recipe.category.trim() === "") {
    errors.category = "A categoria é obrigatória.";
  }

  if (recipe.yieldAmount === undefined || recipe.yieldAmount <= 0) {
    errors.yieldAmount = "O rendimento deve ser maior que zero.";
  }

  if (!recipe.yieldUnit || recipe.yieldUnit.trim() === "") {
    errors.yieldUnit = "A unidade de rendimento é obrigatória.";
  }

  if (recipe.prepTimeMinutes === undefined || recipe.prepTimeMinutes <= 0) {
    errors.prepTimeMinutes = "O tempo de preparo deve ser maior que zero.";
  }

  const validIngredients = recipe.ingredients?.filter(i => i.name && i.name.trim() !== "") || [];
  if (validIngredients.length === 0) {
    errors.ingredients = "Adicione pelo menos um ingrediente com nome preenchido.";
  } else {
    const hasInvalidAmount = validIngredients.some(i => i.amount <= 0);
    if (hasInvalidAmount) {
      errors.ingredients = "A quantidade de todos os ingredientes válidos deve ser maior que zero.";
    }
  }

  const validSteps = recipe.steps?.filter(s => s.instruction && s.instruction.trim() !== "") || [];
  if (validSteps.length === 0) {
    errors.steps = "Adicione pelo menos um passo de preparo.";
  }

  return errors;
}
