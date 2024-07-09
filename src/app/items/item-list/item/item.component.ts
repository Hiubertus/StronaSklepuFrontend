import {Component, Input} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {Item} from "../../../models/item.model";
import {ItemService} from "../../../services/item.service";
import {NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";
import {FormsModule} from "@angular/forms";
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
    NgStyle
  ],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss'
})
export class ItemComponent {
  @Input() item!: Item // Wykrzyknik sygnuje, że wiem, że te dane zostaną ustawione
  @Input() index!: number // Identycznie
  constructor(private itemService: ItemService, private router: Router) {
  }

  cart(event: Event, index: number) {
    event.stopPropagation();
    this.itemService.toggleCart(index);
  }

  fav(event: Event, index: number) {
    event.stopPropagation();
    this.itemService.toggleFavorite(index);
  }

  isItemInCart(itemId: number): boolean {
    return this.itemService.isItemInCart(itemId);
  }

  isItemInFav(itemId: number): boolean {
    return this.itemService.isItemInFav(itemId);
  }

  redirectToItem(itemId: number): void {
    this.router.navigate(['/item-detail', itemId]);
  }
}
