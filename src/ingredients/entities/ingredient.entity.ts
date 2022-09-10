import { Column, PrimaryGeneratedColumn } from "typeorm";
import { IngredientCategory } from "../constants/category.enum";
import { IngredientQuality } from "../constants/quality.enum";

export class Ingredient {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar")
  name: string;

  @Column("enum", { enum: IngredientCategory })
  category: IngredientCategory;

  @Column("enum", { enum: IngredientQuality })
  quality: IngredientQuality;
}
