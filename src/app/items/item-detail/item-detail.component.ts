import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {DatePipe, NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";
import {Item} from "../../models/item.model";
import {ItemService} from "../../services/item.service";
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {Subscription} from "rxjs";
import {FormsModule} from "@angular/forms";
import {ReviewService} from "../../services/review.service";
import {ReviewSectionComponent} from "../review-section/review-section.component";

@Component({
  selector: 'app-item-detail',
  standalone: true,
  imports: [
    MatIcon,
    NgForOf,
    NgIf,
    NgClass,
    NgStyle,
    FormsModule,
    DatePipe,
    ReviewSectionComponent
  ],
  templateUrl: './item-detail.component.html',
  styleUrl: './item-detail.component.scss'
})
export class ItemDetailComponent implements OnInit, OnDestroy {
  item!: Item;
  itemSubscription!: Subscription
  index!: number;
  constructor(private itemService: ItemService,
              private route: ActivatedRoute) {
  }

  async ngOnInit() {
    this.index = this.route.snapshot.params['index']

    this.item = this.itemService.getItem(this.index);
    this.itemSubscription = this.itemService.itemsChanged.subscribe(() => {
      this.item = this.itemService.getItem(this.index);
    })
  }

  ngOnDestroy() {
    this.itemSubscription.unsubscribe()
  }

  isItemInCart(itemId: number): boolean {
    return this.itemService.isItemInCart(itemId);
  }

  isItemInFav(itemId: number): boolean {
    return this.itemService.isItemInFav(itemId);
  }

  toggleCart(itemId: number) {
    this.itemService.toggleCart(itemId);
  }

  toggleFavorite(itemId: number) {
    this.itemService.toggleFavorite(itemId);
  }
}
