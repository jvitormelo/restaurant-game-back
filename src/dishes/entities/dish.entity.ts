import { Cooker } from "src/cooks/entities/cooker.entity";
import { IngredientStock } from "src/customers/customers.service";
import { IngredientQuality } from "src/ingredients/constants/quality.enum";
import { getValueBetween } from "src/shared/getValueBetween";
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

const BONUS_FACTOR = 0.01;

@Entity()
export class Dish {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column()
  experience: number;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  createdAt: Date;

  applyCookerBonus(cooker: Cooker) {
    const { level } = cooker;

    const bonus = level * BONUS_FACTOR;

    this.addBonus(bonus);
  }

  applyIngredientsBonus(ingredients: IngredientStock[]) {
    const highestIngredient = ingredients.reduce((prev, curr) => {
      return prev.quantity > curr.quantity ? prev : curr;
    });

    const { quality } = highestIngredient;

    const qualityMapper = {
      [IngredientQuality.BAD]: 0.5,
      [IngredientQuality.AVERAGE]: 0.75,
      [IngredientQuality.GOOD]: 1,
      [IngredientQuality.EXCELLENT]: 1.5,
    };

    const bonus = qualityMapper[quality] * BONUS_FACTOR;

    this.addBonus(bonus);
  }

  addBonus(bonus: number) {
    this.price += this.price * bonus;
    this.experience += this.experience * bonus;
  }

  @BeforeInsert()
  addChaos() {
    const valueBetween9And11 = getValueBetween(9, 11) / 10;

    this.price *= valueBetween9And11;
    this.experience *= valueBetween9And11;
  }
}
