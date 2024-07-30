import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {User} from "../../../models/user.model";
import {Item} from "../../../models/item.model";
import {OrderService} from "../../../services/order.service";

@Component({
  selector: 'app-cart-form',
  standalone: true,
    imports: [
        FormsModule,
        NgIf,
        ReactiveFormsModule
    ],
  templateUrl: './cart-form.component.html',
  styleUrl: './cart-form.component.scss'
})
export class CartFormComponent implements OnInit{
  @Input() loginStatus!: Boolean
  @Input() user!: User | null
  @Input() totalCost!: number
  @Input() items!: {item: Item, quantity: number}[]
  selectedPaymentMethod: 'card' | 'blik' = 'card';
  cardForm!: FormGroup;
  blikForm!: FormGroup;
  addressForm!: FormGroup;

  errors: string[] = [];
  submitted: boolean = false;
  constructor(private orderService: OrderService) {
  }
  ngOnInit() {
    this.addressForm = new FormGroup({
      name: new FormControl(null,[
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(35),
        Validators.pattern(/^[a-zA-Z]{2,}([- ][a-zA-Z]{2,})*$/)]),
      surname: new FormControl(null,[
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(35),
        Validators.pattern(/^[a-zA-Z]{2,}([- ][a-zA-Z]{2,})*$/)]),
      street: new FormControl(this.user?.street,Validators.required),
      city: new FormControl(this.user?.city,Validators.required),
      apartment: new FormControl(this.user?.apartment)
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
  async onSubmit() {
    this.submitted = true
    this.errors = [];
    if(this.addressForm.valid) {
      if((this.selectedPaymentMethod == 'blik' && this.blikForm.valid) || (this.selectedPaymentMethod == 'card' && this.cardForm.valid)) {
        try {
          await this.orderService.postOrder(
            this.items,
            this.addressForm.value.name,
            this.addressForm.value.surname,
            this.addressForm.value.city,
            this.addressForm.value.street,
            this.addressForm.value.apartment,
            this.selectedPaymentMethod,
            this.totalCost)
        } catch(err: any) {

        }
      }
    }
  }
}
