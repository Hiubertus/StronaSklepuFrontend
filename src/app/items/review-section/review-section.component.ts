import {Component, OnDestroy, OnInit} from '@angular/core';
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";
import {Review} from "../../models/review.model";
import {Subscription} from "rxjs";
import {User} from "../../models/user.model";
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {ReviewService} from "../../services/review.service";
import {ReviewComponent} from "./review/review.component";
import {ReviewFormComponent} from "./review-form/review-form.component";

@Component({
  selector: 'app-review-section',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    MatIcon,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    NgClass,
    ReviewComponent,
    ReviewFormComponent
  ],
  templateUrl: './review-section.component.html',
  styleUrl: './review-section.component.scss'
})
export class ReviewSectionComponent implements OnInit, OnDestroy{

  reviews: Review[] = []
  loginStatusSubscription!: Subscription
  reviewSubscription!: Subscription
  index!: number;
  loginStatus!: boolean
  user!: User | null
  check: boolean = false;

  constructor(private route: ActivatedRoute,
              private authService: AuthService,
              private reviewService: ReviewService) {
  }

  async ngOnInit() {
    this.index = this.route.snapshot.params['index']

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
    this.reviewSubscription.unsubscribe()
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
