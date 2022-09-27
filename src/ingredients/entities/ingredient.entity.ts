import { Stock } from "src/stock/entities/stock.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { IngredientCategory } from "../constants/category.enum";
import { IngredientQuality } from "../constants/quality.enum";

@Entity()
export class Ingredient {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar")
  name: string;

  @Column("enum", { enum: IngredientCategory })
  category: IngredientCategory;

  @Column("enum", { enum: IngredientQuality })
  quality: IngredientQuality;

  @OneToMany(() => Stock, (stock) => stock.ingredient)
  stocks: Stock[];
}
