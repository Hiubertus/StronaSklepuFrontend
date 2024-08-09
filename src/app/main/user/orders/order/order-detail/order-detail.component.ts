import {Component, OnDestroy, OnInit} from '@angular/core';
import {Order} from "../../../../../shared/models/order.model";
import {ActivatedRoute} from "@angular/router";
import {OrderService} from "../../../../../shared/services/order.service";
import {DatePipe, NgStyle} from "@angular/common";
import {Subscription} from "rxjs";
import {ItemComponent} from "../../../../../items/item-list/item/item.component";
import {CarouselComponent} from "./carousel/carousel.component";
import {MatIcon} from "@angular/material/icon";
import {OrderComponent} from "../order.component";
import {ReturnButtonComponent} from "../../../../../return-button/return-button.component";
import {StatusesComponent} from "./statuses/statuses.component";

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    NgStyle,
    ItemComponent,
    CarouselComponent,
    DatePipe,
    MatIcon,
    OrderComponent,
    ReturnButtonComponent,
    StatusesComponent
  ],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss'
})
export class OrderDetailComponent implements OnInit, OnDestroy{
  order!: Order
  orderSubscription!: Subscription
  order_id!: number
  errorStatuses: boolean = false
  errorOrder: boolean = false
  constructor(private route: ActivatedRoute, private orderService: OrderService) {}
  async ngOnInit() {
    this.order_id = this.route.snapshot.params['order_id'];
    this.order = this.orderService.getOrder(this.order_id)
    this.orderSubscription = this.orderService.ordersChange.subscribe({
      next: () => {
          this.order = this.orderService.getOrder(this.order_id)
      },
      error: () => {
        this.errorOrder = true
      }
    })
    if(!this.order) {
      await this.orderService.getOrderFromDb(this.order_id)
    }
    this.route.params.subscribe((params) => {
      this.order_id = params['order_id'];
      this.order = this.orderService.getOrder(this.order_id)
      }
    )
  }
  ngOnDestroy() {
    this.orderSubscription.unsubscribe()
  }
  handleStatusesError() {
    this.errorStatuses = true
  }
}
