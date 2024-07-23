import {Component, Input, OnInit} from '@angular/core';
import {Order} from "../../../../../models/order.model";
import {ActivatedRoute} from "@angular/router";
import {OrderService} from "../../../../../services/order.service";
import {NgForOf, NgIf, NgStyle} from "@angular/common";

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    NgForOf,
    NgStyle,
    NgIf
  ],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss'
})
export class OrderDetailComponent implements OnInit{
  order!: Order
  order_id!: number
  constructor(private route: ActivatedRoute, private orderService: OrderService) {}
  ngOnInit() {
    this.order_id = this.route.snapshot.params['order_id'];
    this.order = this.orderService.getOrder(this.order_id)
    // this.route.params.subscribe((params) => {
    //   this.order_id = params['order_id'];
    //   this.order = this.orderService.getOrder(this.order_id)
    //   }
    // )
    console.log(this.order)
  }
}
