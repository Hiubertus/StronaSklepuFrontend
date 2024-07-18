import {Component, OnDestroy, OnInit} from '@angular/core';
import {ItemComponent} from "../../items/item-list/item/item.component";
import {NgForOf, NgIf} from "@angular/common";
import {Item} from "../../models/item.model";
import {ItemService} from "../../services/item.service";
import {Subscription} from "rxjs";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {User} from "../../models/user.model";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    ItemComponent,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit, OnDestroy {
  items!: Item[];
  loginStatus!: boolean;
  user!: User | null;

  cartSubscription!: Subscription
  loginStatusSubscription!: Subscription


  totalCost: number = 0;
  selectedPaymentMethod: 'card' | 'blik' = 'card';

  cardForm!: FormGroup;
  blikForm!: FormGroup;
  addressForm!: FormGroup;

  errors: string[] = [];
  submitted: boolean = false;

  constructor(private itemService: ItemService, private authService: AuthService) {
  }

  async ngOnInit() {
    this.items = this.itemService.getCart()
    this.cartSubscription = this.itemService.cartChanged.subscribe(
      (items: Item[]) => {
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

    this.addressForm = new FormGroup({
      apartment: new FormControl(this.user?.apartment,Validators.required),
      street: new FormControl(this.user?.street,Validators.required),
      city: new FormControl(this.user?.city,Validators.required)
    })

    this.blikForm = new FormGroup({
      blikCode: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]{6}$')
      ])
    });

    this.cardForm = new FormGroup({
      cardNumber: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]{12}$')
      ]),
      expirationDate: new FormControl('', [
        Validators.required,
        Validators.pattern('^(0[1-9]|1[0-2])\\/\\d{2}$')
      ]),
      ccv: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]{3}$')
      ])
    });
  }

  ngOnDestroy() {
    this.cartSubscription.unsubscribe()
    this.loginStatusSubscription.unsubscribe()
  }

  calculateTotalCost() {
    this.totalCost = this.items.reduce((sum, item) => sum + Number(item.cost), 0);
  }
  onSubmit() {
    this.submitted = true
    this.errors = [];
    if(this.addressForm.valid) {
      if(this.selectedPaymentMethod == 'blik' && this.blikForm.valid) {
        try {

        } catch(err: any) {

        }
      }
      if(this.selectedPaymentMethod == 'card' && this.cardForm.valid) {
        try {

        } catch(err: any) {

        }
      }
    }
  }
}
