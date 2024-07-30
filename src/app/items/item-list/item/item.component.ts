import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {Item} from "../../../models/item.model";
import {ItemService} from "../../../services/item.service";
import {NgClass, NgForOf, NgIf, NgStyle, SlicePipe} from "@angular/common";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [
    MatIconModule,
    NgClass,
    FormsModule,
    NgIf,
    NgForOf,
    NgStyle,
    SlicePipe,
    ReactiveFormsModule
  ],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss'
})
export class ItemComponent implements OnInit{
  @Input() item!: Item
  @Input() itemQuantity!: number | null
  @Input() showRating!: boolean
  @Input() showButtonFavorite!: boolean
  @Input() showButtonCart!: boolean
  @Input() showDescription!: boolean
  @Input() showBorder!: boolean
  @Input() clickable!: boolean

  @Input() itemNameLength!: 'short' | 'medium' | 'big'| 'full'
  @Input() showQuantity!: 'input' | 'number' | false
  @Input() whichButtonFirst!: 'cart' | 'fav'
  @Input() itemSize!: 'small' | 'medium' | 'big'
  @Input() imageSize!: 'small' | 'medium' | 'big'
  @Input() columnAmount!: 'one' | 'two'
  @Input() buttonPlacment!: 'bottom' | 'side'

  @Output() quantityChange = new EventEmitter<{ item_id: number, quantity: number }>();
  quantityForm!: FormGroup;
  constructor(private itemService: ItemService, private router: Router) {
  }
  ngOnInit() {
    this.quantityForm = new FormGroup({
      quantity: new FormControl(this.itemQuantity || 1, [
        Validators.required,
        Validators.pattern('^[1-9][0-9]*$')
      ])
    })
  }

  onQuantityChange() {
    if (!isNaN(this.quantityForm.get('quantity')?.value) && this.quantityForm.get('quantity')?.value >= 1 && this.quantityForm.valid) {
      this.quantityChange.emit({ item_id: this.item.item_id, quantity: this.quantityForm.get('quantity')?.value });
    }
    else {
      this.quantityForm.get('quantity')?.setValue(1);
      this.quantityChange.emit({ item_id: this.item.item_id, quantity: this.quantityForm.get('quantity')?.value });
    }
  }
  cart(event: Event, item_id: number) {
    event.stopPropagation();
    this.itemService.toggleCart(item_id);
  }

  fav(event: Event, item_id: number) {
    event.stopPropagation();
    this.itemService.toggleFavorite(item_id);
  }

  isItemInCart(item_id: number): boolean {
    return this.itemService.isItemInCart(item_id);
  }

  isItemInFav(item_id: number): boolean {
    return this.itemService.isItemInFav(item_id);
  }

  redirectToItem(item_id: number): void {
    if(this.clickable) {
      this.router.navigate(['shop/item-detail', item_id]);
    }
  }
}
