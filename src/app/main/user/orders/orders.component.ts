import {Component, OnDestroy, OnInit} from '@angular/core';
import {OrderComponent} from "./order/order.component";
import {Order} from "../../../models/order.model";
import {NgForOf, NgIf} from "@angular/common";
import {OrderService} from "../../../services/order.service";
import {Subscription} from "rxjs";
import {ReturnButtonComponent} from "../../../return-button/return-button.component";

@Component({
  selector: 'app-orders',
  standalone: true,
    imports: [
        OrderComponent,
        NgForOf,
        NgIf,
        ReturnButtonComponent
    ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit, OnDestroy{
  orders: Order[] = []
  orderSubscription!: Subscription;

 constructor(private orderService: OrderService) {}
  async ngOnInit() {
    await this.orderService.getOrdersFromDb()
    this.orders = this.orderService.getOrders()
    this.orderSubscription = this.orderService.ordersChange.subscribe((orderData) => {
      this.orders = orderData;
      console.log(this.orders)
    })

  }
  ngOnDestroy() {
   this.orderSubscription.unsubscribe()
  }
}
