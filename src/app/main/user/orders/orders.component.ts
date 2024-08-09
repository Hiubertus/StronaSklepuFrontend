import {Component, OnDestroy, OnInit} from '@angular/core';
import {OrderComponent} from "./order/order.component";
import {Order} from "../../../shared/models/order.model";
import {OrderService} from "../../../shared/services/order.service";
import {Subscription} from "rxjs";
import {ReturnButtonComponent} from "../../../return-button/return-button.component";

@Component({
  selector: 'app-orders',
  standalone: true,
    imports: [
        OrderComponent,
        ReturnButtonComponent
    ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit, OnDestroy{
  orders: Order[] = []
  orderSubscription!: Subscription;
  error: boolean = false
 constructor(private orderService: OrderService) {}
  async ngOnInit() {
    await this.orderService.getOrdersFromDb()
    this.orders = this.orderService.getOrders()
    this.orderSubscription = this.orderService.ordersChange.subscribe({
      next: (orderData: Order[]) => {
          this.orders = orderData;
      },
      error: () => {
        this.error = true
      }
    })

  }
  ngOnDestroy() {
   this.orderSubscription.unsubscribe()
  }
}
