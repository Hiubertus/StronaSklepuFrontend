import {Component, OnDestroy, OnInit} from '@angular/core';
import {Item} from "../../models/item.model";
import {ItemService} from "../../services/item.service";
import {MatIconModule} from "@angular/material/icon";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {ItemComponent} from "./item/item.component";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [MatIconModule, NgClass, NgForOf, NgIf, ItemComponent],
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.scss'
})
export class ItemListComponent implements OnInit, OnDestroy {
  items!: Item[];
  itemSubscription!: Subscription

  constructor(private itemService: ItemService) {
  }

  async ngOnInit() {
    this.items = this.itemService.getItems()
    this.itemSubscription = this.itemService.itemsChanged.subscribe((data: Item[]) => {
      this.items = data
    })
  }
  ngOnDestroy() {
    this.itemSubscription.unsubscribe()
  }
}
