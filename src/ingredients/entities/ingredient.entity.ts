import { IngredientCategory } from '../constants/category.enum';
import { IngredientQuality } from './quality.entity';

export class Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  quality: IngredientQuality;
}
