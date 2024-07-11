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
  constructor(private itemService: ItemService, private router: Router) {
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
    this.router.navigate(['/item-detail', item_id]);
  }
}
