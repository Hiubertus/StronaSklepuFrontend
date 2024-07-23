import { Item } from "./item.model";

export interface Order {
  order_id: number
  items: Item[]
  items_quantity: number[]
  cost: number;
  apartment: string;
  street: string;
  city: string;
  payment: string;
  date: string;
  status: string;
}
