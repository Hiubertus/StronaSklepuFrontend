import {Component, OnDestroy, OnInit} from '@angular/core';
import {ItemComponent} from "../../items/item-list/item/item.component";
import {ItemService} from "../../shared/services/item.service";
import {Item} from "../../shared/models/item.model";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [
    ItemComponent,
  ],
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.scss'
})
export class FavoriteComponent implements OnInit, OnDestroy {
  items!: Item[]

  favoriteSubscription!: Subscription

  constructor(private itemService: ItemService) {
  }

  async ngOnInit() {
    this.items = this.itemService.getFavorite()
    this.favoriteSubscription = this.itemService.favoriteChanged.subscribe(
      (items: Item[]) => {
        this.items = items
      }
    )
  }

  ngOnDestroy() {
    this.favoriteSubscription.unsubscribe()
  }
}
