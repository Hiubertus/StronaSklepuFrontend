import {Component, Input} from '@angular/core';
import {Order} from "../../../../models/order.model";
import {MatIcon} from "@angular/material/icon";
import {Router} from "@angular/router";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [
    MatIcon,
    DatePipe
  ],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent {
  @Input() order!: Order;
  constructor(private router: Router) {
  }
  redirectToOrder(order_id: number) {
    this.router.navigate(['/user/orders', order_id]);
  }
}
