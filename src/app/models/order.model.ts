import { Item } from "./item.model";

export interface Order {
  order_id: number
  items: {item: Item , quantity: number}[]
  name: string;
  surname: string
  cost: number;
  apartment: string;
  street: string;
  city: string;
  payment: string;
  date: string;
}
