import {Component, Input} from '@angular/core';
import {Order} from "../../../../models/order.model";
import {MatIcon} from "@angular/material/icon";
import {Router} from "@angular/router";
import {DatePipe, NgClass, SlicePipe} from "@angular/common";

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [
    MatIcon,
    DatePipe,
    NgClass,
    SlicePipe
  ],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent {
  @Input() order!: Order;
  @Input() showBorder!: boolean;
  @Input() useMargin!: boolean;
  @Input() clickable!: boolean;
  @Input() dataLength!: 'short' | 'full'
  constructor(private router: Router) {}
  redirectToOrder(order_id: number) {
    if(this.clickable) {
      this.router.navigate(['/user/orders', order_id]);
    }
  }
}
