import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {DatePipe, NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";
import {Item} from "../../models/item.model";
import {ItemService} from "../../services/item.service";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {FormsModule} from "@angular/forms";
import {ReviewSectionComponent} from "../review-section/review-section.component";
import {ItemComponent} from "../item-list/item/item.component";

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
    ReviewSectionComponent,
    ItemComponent
  ],
  templateUrl: './item-detail.component.html',
  styleUrl: './item-detail.component.scss'
})
export class ItemDetailComponent implements OnInit, OnDestroy {
  item!: Item;
  itemSubscription!: Subscription
  item_id!: number;
  constructor(private itemService: ItemService,
              private route: ActivatedRoute) {
  }

  async ngOnInit() {
    this.item_id = this.route.snapshot.params['item_id']
    this.item = this.itemService.getItem(this.item_id);
    this.itemSubscription = this.itemService.itemsChanged.subscribe(() => {
      this.item = this.itemService.getItem(this.item_id);
    })
  }

  ngOnDestroy() {
    this.itemSubscription.unsubscribe()
  }
}
