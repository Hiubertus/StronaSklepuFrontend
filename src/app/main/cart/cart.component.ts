import {Component, OnDestroy, OnInit} from '@angular/core';
import {ItemComponent} from "../../items/item-list/item/item.component";
import {NgForOf, NgIf} from "@angular/common";
import {Item} from "../../models/item.model";
import {ItemService} from "../../services/item.service";
import {Subscription} from "rxjs";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";

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

  cartSubscription!: Subscription
  loginStatusSubscription!: Subscription


  totalCost: number = 0;
  selectedPaymentMethod: string = 'card';

  cardForm!: FormGroup;
  blikForm!: FormGroup;

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
    this.loginStatusSubscription = this.authService.loginStatusChanged.subscribe((loginStatusData: boolean) => {
      this.loginStatus = loginStatusData;
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
    this.totalCost = this.items.reduce((sum, item) => sum + item.cost, 0);
  }

  buyProducts(formGroup: FormGroup) {
    if (formGroup == this.cardForm) {
      this.errors = [];
      this.submitted = true;
      const CardNumberControl = this.cardForm.get('cardNumber');
      if (CardNumberControl && CardNumberControl.hasError('pattern')) {
        this.errors.push('invalidCardNumber');
      }
      const CCVControl = this.cardForm.get('ccv')
      if (CCVControl && CCVControl.hasError('pattern')) {
        this.errors.push('invalidCCV');
      }
      const ExpirationDateControl = this.cardForm.get('expirationDate');
      if (ExpirationDateControl && ExpirationDateControl.hasError('pattern')) {
        this.errors.push('invalidDate')
      }
      if (formGroup.valid) {
        console.log("Zakupiono produkt za pomoca kart!!!!")
      }
    } else {
      this.errors = [];
      this.submitted = true;
      const BlikControl = this.blikForm.get('blikCode');
      if (BlikControl && BlikControl.hasError('pattern')) {
        this.errors.push('invalidBlik');
      }
      if (formGroup.valid) {
        console.log("Zakupiono produkt za pomoca blika!!!!")
      }
    }
  }

}
