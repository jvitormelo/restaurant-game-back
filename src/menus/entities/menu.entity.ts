import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class MenuDish {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ default: "" })
  description: string;

  @Column({ default: 0 })
  price: number;

  @Column({ default: 5 })
  experience: number;

  @Column({ default: 5000 })
  timeToCook: number;

  @Column({ default: 1 })
  restaurantLevel: number;

  @Column({ default: 0 })
  vegetableQuantity: number;

  @Column({ default: 0 })
  fruitQuantity: number;

  @Column({ default: 0 })
  dairyQuantity: number;

  @Column({ default: 0 })
  meatQuantity: number;

  @Column({ default: 0 })
  fishQuantity: number;

  @Column()
  imageUrl: string;
}
