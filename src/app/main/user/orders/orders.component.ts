import {Component, OnInit} from '@angular/core';
import {OrderComponent} from "./order/order.component";
import {Order} from "../../../models/order.model";
import {NgForOf} from "@angular/common";
import {OrderService} from "../../../services/order.service";

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

 constructor(private orderService: OrderService) {}
  ngOnInit() {
    this.orders = this.orderService.getOrders()
  }
}
