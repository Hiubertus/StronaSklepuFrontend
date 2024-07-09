import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";
import {Item} from "../../models/item.model";
import {ItemService} from "../../services/item.service";
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {Subscription} from "rxjs";
import {FormsModule} from "@angular/forms";
import {User} from "../../models/user.model";
import {Review} from "../../models/review.model";
import {ReviewService} from "../../services/review.service";

@Component({
  selector: 'app-item-detail',
  standalone: true,
  imports: [
    MatIcon,
    NgForOf,
    NgIf,
    NgClass,
    NgStyle,
    FormsModule
  ],
  templateUrl: './item-detail.component.html',
  styleUrl: './item-detail.component.scss'
})
export class ItemDetailComponent implements OnInit, OnDestroy {
  item!: Item;
  index!: number;
  reviews: Review[] = []
  loginStatus!: boolean
  user!: User | null

  loginStatusSubscription!: Subscription
  itemSubscription!: Subscription
  reviewSubscription!: Subscription

  rating = 0;
  hoverState = 0;
  reviewText = '';
  check: boolean = false;

  constructor(private itemService: ItemService,
              private route: ActivatedRoute,
              private authService: AuthService,
              private reviewService: ReviewService) {
  }

  async ngOnInit() {
    this.index = this.route.snapshot.params['index']

    this.item = this.itemService.getItem(this.index);
    this.itemSubscription = this.itemService.itemsChanged.subscribe(() => {
      this.item = this.itemService.getItem(this.index);
    })

    await this.reviewService.getReviewsFromDB(this.index + 1)
    this.reviewSubscription = this.reviewService.reviewsChanged.subscribe((reviews: Review[]) => {
      this.reviews = reviews
      this.userCanWriteReview()
    })

    this.user = this.authService.getUser()
    this.loginStatus = await this.authService.getLoginStatus()
    this.loginStatusSubscription = this.authService.loginStatusChanged.subscribe((loginStatusData: boolean) => {
      this.user = this.authService.getUser()
      this.loginStatus = loginStatusData;
    });



  }

  ngOnDestroy() {
    this.loginStatusSubscription.unsubscribe()
    this.itemSubscription.unsubscribe()
    this.reviewSubscription.unsubscribe()
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

  async submitReview() {
    await this.reviewService.addReview(this.item.item_id, this.reviewText, this.rating)
  }

  async deleteReview(item_id: number, user_id: number) {
    await this.reviewService.deleteReview(item_id, user_id)
  }

  setRating(star: number): void {
    this.rating = star;
  }

  enter(star: number): void {
    this.hoverState = star;
  }

  leave(): void {
    if (this.rating == 0) {
      this.hoverState = 0;
    } else {
      this.hoverState = this.rating;
    }
  }

  userHasReview(id: number) {
    if (this.user == null) {
      return false
    } else {
      const userId = this.user.user_id
      return userId == id;
    }
  }

  userCanWriteReview() {
    let found = false;
    for (const j of this.reviews) {
      if (j.user_id == this.user?.user_id) {
        found = true;
        break;
      }
    }
    this.check = !found;
  }

}
