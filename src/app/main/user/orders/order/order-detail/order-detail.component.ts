import {Component, OnDestroy, OnInit} from '@angular/core';
import {Order} from "../../../../../models/order.model";
import {ActivatedRoute} from "@angular/router";
import {OrderService} from "../../../../../services/order.service";
import {DatePipe, NgForOf, NgIf, NgStyle} from "@angular/common";
import {Subscription} from "rxjs";
import {ItemComponent} from "../../../../../items/item-list/item/item.component";
import {CarouselComponent} from "./carousel/carousel.component";
import {MatIcon} from "@angular/material/icon";
import {OrderComponent} from "../order.component";

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    NgForOf,
    NgStyle,
    NgIf,
    ItemComponent,
    CarouselComponent,
    DatePipe,
    MatIcon,
    OrderComponent
  ],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss'
})
export class OrderDetailComponent implements OnInit, OnDestroy{
  order!: Order
  orderSubscription!: Subscription
  order_id!: number
  constructor(private route: ActivatedRoute, private orderService: OrderService) {}
  async ngOnInit() {
    this.order_id = this.route.snapshot.params['order_id'];
    this.order = this.orderService.getOrder(this.order_id)
    this.orderSubscription = this.orderService.ordersChange.subscribe(() => {
      this.order = this.orderService.getOrder(this.order_id)
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
}
