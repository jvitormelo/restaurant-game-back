import { Restaurant } from "src/restaurants/entities/restaurant.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CookStatus } from "../types/cooksStatus";

@Entity()
export class Cooker {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({
    default: 0,
  })
  level: number;

  @Column({
    default: 0,
  })
  experience: number;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.cooks)
  restaurant: Restaurant;

  @Column({
    default: "available",
  })
  status: CookStatus;
}
