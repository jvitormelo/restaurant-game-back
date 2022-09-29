import { Cooker } from "src/cooks/entities/cooker.entity";
import { IStock } from "src/customers/customers.service";

export class CreateDishDto {
  id: string;

  name: string;

  description: string;

  price: number;

  experience: number;

  ingredients: IStock[];

  cooker: Cooker;
}
