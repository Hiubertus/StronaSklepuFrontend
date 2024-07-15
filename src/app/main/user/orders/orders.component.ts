import {Component, OnInit} from '@angular/core';
import {OrderComponent} from "./order/order.component";
import {Order} from "../../../models/order.model";
import {ItemService} from "../../../services/item.service";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    OrderComponent,
    NgForOf
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit{
  orders: Order[] = [
  ]
  order1!: Order;
  order2!: Order;
 constructor(private itemService: ItemService) {}
  ngOnInit() {
    this.order1 = {
      order_id: 1,
      items: [this.itemService.getItem(1)],
      cost: 59.98,
      apartment: '',
      street: 'Kurska 5',
      city: 'Lublin',
      payment: 'Karta',
      date: '2024-07-07',
      status: 'W toku'
    };
    this.order2 = {
      order_id: 2,
      items: [this.itemService.getItem(1)],
      cost: 59.98,
      apartment: '32',
      street: 'Sezamkowa 69',
      city: 'Warszawa',
      payment: 'Blik',
      date: '2024-07-10',
      status: 'Wysłane'
    };
    this.orders = [this.order1,this.order2]
  }
}
