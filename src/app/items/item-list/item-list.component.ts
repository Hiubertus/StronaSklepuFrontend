import {Component, OnDestroy, OnInit} from '@angular/core';
import {Item} from "../../shared/models/item.model";
import {ItemService} from "../../shared/services/item.service";
import {MatIconModule} from "@angular/material/icon";
import {NgClass} from "@angular/common";
import {ItemComponent} from "./item/item.component";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [MatIconModule, NgClass, ItemComponent],
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.scss'
})
export class ItemListComponent implements OnInit, OnDestroy {
  items!: Item[];
  itemSubscription!: Subscription
  error: boolean = false

  constructor(private itemService: ItemService) {
  }

  async ngOnInit() {
    this.items = this.itemService.getItems()
    this.itemSubscription = this.itemService.itemsChanged.subscribe({
      next: (data : Item[]) => {
        this.items = data
      },
      error: () => {
        this.error = true;
      }
    })
  }
  ngOnDestroy() {
    this.itemSubscription.unsubscribe()
  }
}
