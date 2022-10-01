import { IngredientCategory } from "src/ingredients/constants/category.enum";
import { IngredientQuality } from "src/ingredients/constants/quality.enum";

export interface IngredientStock {
  id: string;
  name: string;
  quantity: number;
  category: IngredientCategory;
  quality: IngredientQuality;
}
