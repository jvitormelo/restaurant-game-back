import { IngredientCategory } from "../constants/category.enum";
import { IngredientQuality } from "../constants/quality.enum";

export class CreateIngredientDto {
  name: string;
  category: IngredientCategory;
  quality: IngredientQuality;
}
