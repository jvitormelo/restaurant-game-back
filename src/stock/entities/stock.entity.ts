import { Ingredient } from "src/ingredients/entities/ingredient.entity";
import { Restaurant } from "src/restaurants/entities/restaurant.entity";
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";

@Entity()
export class Stock {
  @PrimaryColumn({ unique: true })
  id: string;

  @ManyToOne(() => Ingredient, (ingredient) => ingredient.stocks)
  @JoinColumn({
    name: "ingredientId",
  })
  ingredient: Ingredient;

  @Column({ nullable: false })
  ingredientId: string;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.stocks)
  @JoinColumn({
    name: "restaurantId",
  })
  restaurant: Restaurant;

  @Column({ nullable: false })
  restaurantId: string;

  @Column()
  quantity: number;

  constructor(partial: Partial<Stock>) {
    Object.assign(this, partial);
  }

  @BeforeInsert()
  setId() {
    this.id = this.restaurantId + this.ingredientId;
  }

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  createdAt: Date;
}
