export interface IngredientResponseDTO {
  amount: number;
  unit: string;
  notes?: string | null;
  ingredient: {
    name: string;
  };
}

export interface IngredientRequestDTO {
  name: string;
  amount: number;
  unit: string;
}

export interface RecipeStepDTO {
  step_number: number;
  instruction: string;
}

export interface RecipeDTO {
  id: string;
  title: string;
  category: string;
  image_url?: string | null;
  cost_per_serving?: number | null;
  total_cost?: number | null;
  yield_amount: number;
  yield_unit: string;
  prep_time_minutes: number;
  style: string;
  ingredients: IngredientResponseDTO[];
  steps: RecipeStepDTO[];
}

export interface RecipeCreateDTO {
  title: string;
  category: string;
  yield_amount: number;
  yield_unit: string;
  prep_time_minutes: number;
  style: string;
  ingredients: IngredientRequestDTO[];
  steps: RecipeStepDTO[];
}
