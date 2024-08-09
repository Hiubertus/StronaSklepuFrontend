import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {DatePipe, NgClass, NgStyle} from "@angular/common";
import {Item} from "../../shared/models/item.model";
import {ItemService} from "../../shared/services/item.service";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {FormsModule} from "@angular/forms";
import {ReviewSectionComponent} from "../review-section/review-section.component";
import {ItemComponent} from "../item-list/item/item.component";
import {ReturnButtonComponent} from "../../return-button/return-button.component";

@Component({
  selector: 'app-item-detail',
  standalone: true,
  imports: [
    MatIcon,
    NgClass,
    NgStyle,
    FormsModule,
    DatePipe,
    ReviewSectionComponent,
    ItemComponent,
    ReturnButtonComponent
  ],
  templateUrl: './item-detail.component.html',
  styleUrl: './item-detail.component.scss'
})
export class ItemDetailComponent implements OnInit, OnDestroy {
  item!: Item;
  itemSubscription!: Subscription
  item_id!: number;
  errorItem: boolean = false
  errorReview: boolean = false
  constructor(private itemService: ItemService,
              private route: ActivatedRoute) {
  }

  async ngOnInit() {
    this.item_id = this.route.snapshot.params['item_id']
    this.item = this.itemService.getItem(this.item_id);
    this.itemSubscription = this.itemService.itemsChanged.subscribe({
      next: () => {
        this.item = this.itemService.getItem(this.item_id);
      }, error: (err: any) => {
        this.errorItem = true;
      }
    })
  }

  ngOnDestroy() {
    this.itemSubscription.unsubscribe()
  }

  handleReviewError() {
    this.errorReview = true
  }
}
