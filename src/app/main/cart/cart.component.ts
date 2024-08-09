import {Component, OnDestroy, OnInit} from '@angular/core';
import {ItemComponent} from "../../items/item-list/item/item.component";
import {Item} from "../../shared/models/item.model";
import {ItemService} from "../../shared/services/item.service";
import {Subscription} from "rxjs";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AuthService} from "../../shared/services/auth.service";
import {User} from "../../shared/models/user.model";
import {CartFormComponent} from "./cart-form/cart-form.component";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    ItemComponent,
    ReactiveFormsModule,
    FormsModule,
    CartFormComponent
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit, OnDestroy {
  items: {item: Item, quantity: number}[] = []
  loginStatus!: boolean;
  user!: User | null;

  cartSubscription!: Subscription
  loginStatusSubscription!: Subscription

  totalCost: number = 0;
  constructor(private itemService: ItemService, private authService: AuthService) {}

  async ngOnInit() {
    this.items = this.itemService.getCart()
    this.calculateTotalCost();
    this.cartSubscription = this.itemService.cartChanged.subscribe(
      (items: {item: Item, quantity: number}[]) => {
        this.items = items
        this.calculateTotalCost();
      }
    )

    this.loginStatus = await this.authService.getLoginStatus()
    this.user = this.authService.getUser()
    this.loginStatusSubscription = this.authService.loginStatusChanged.subscribe((loginStatusData: boolean) => {
      this.loginStatus = loginStatusData;
      this.user = this.authService.getUser()
    })
  }

  ngOnDestroy() {
    this.cartSubscription.unsubscribe()
    this.loginStatusSubscription.unsubscribe()
  }
  handleQuantityChange(item: {item_id: number, quantity: number}) {
    this.itemService.setItemQuantity(item);
  }

  calculateTotalCost() {
    this.totalCost = this.items.reduce((sum, item) => sum + Number(item.item.cost * item.quantity), 0);
  }
}
