import { Stock } from "src/stock/entities/stock.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ default: 1 })
  level: number;

  @OneToMany(() => Stock, (stock) => stock.restaurant)
  stocks: Stock[];
}
