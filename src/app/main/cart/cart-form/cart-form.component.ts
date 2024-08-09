import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {User} from "../../../shared/models/user.model";
import {Item} from "../../../shared/models/item.model";
import {OrderService} from "../../../shared/services/order.service";
import {InputWrapperComponent} from "../../../shared/components/input-wrapper/input-wrapper.component";
import {LocalStorageService} from "../../../shared/services/local-storage.service";
import {ItemService} from "../../../shared/services/item.service";

@Component({
  selector: 'app-cart-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    InputWrapperComponent
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
  radioForm!: FormGroup;

  submitted: boolean = false;
  constructor(private orderService: OrderService,
              private localStorage: LocalStorageService,
              private itemService: ItemService) {
  }
  ngOnInit() {
    this.radioForm = new FormGroup({
      paymentMethod: new FormControl('card') // domyślna wartość
    });
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

    this.radioForm.get('paymentMethod')?.valueChanges.subscribe(value => {
      this.selectedPaymentMethod = value;
    });
  }
  async onSubmit() {
    this.submitted = true
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
          this.submitted = false
          this.addressForm.disable()

          if (this.selectedPaymentMethod=='blik') {
            this.blikForm.reset()
            this.blikForm.disable()
            this.blikForm.get('blikCode')?.setErrors({ success: true } )
          }
          if (this.selectedPaymentMethod=='card') {
            this.cardForm.reset()
            this.cardForm.disable()
            this.cardForm.get('ccv')?.setErrors({ success: true } )
          }
        } catch(err: any) {

        }
      }
    }
  }
  get nameInput():FormControl {
    return this.addressForm.controls['name'] as FormControl;
  }
  get surnameInput():FormControl {
    return this.addressForm.controls['surname'] as FormControl;
  }
  get cityInput():FormControl {
    return this.addressForm.controls['city'] as FormControl;
  }
  get streetInput():FormControl {
    return this.addressForm.controls['street'] as FormControl;
  }
  get apartmentInput(): FormControl {
    return this.addressForm.controls['apartment'] as FormControl;
  }
  get blikInput(): FormControl {
    return this.blikForm.controls['blikCode'] as FormControl;
  }
  get cardNumberInput(): FormControl {
    return this.cardForm.controls['cardNumber'] as FormControl;
  }
  get expirationDateInput(): FormControl {
    return this.cardForm.controls['expirationDate'] as FormControl;
  }
  get ccvInput(): FormControl {
    return this.cardForm.controls['ccv'] as FormControl;
  }
}
