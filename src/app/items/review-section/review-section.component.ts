import {Component, Input, OnDestroy, OnInit} from '@angular/core';
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
import {PaginationComponent} from "./pagination/pagination.component";

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
    ReviewFormComponent,
    PaginationComponent
  ],
  templateUrl: './review-section.component.html',
  styleUrl: './review-section.component.scss'
})
export class ReviewSectionComponent implements OnInit, OnDestroy{
  reviews: Review[] = []
  loginStatusSubscription!: Subscription
  reviewSubscription!: Subscription

  item_id!: number;
  loginStatus!: boolean
  user!: User | null;
  userHasReview!: boolean;

  filter: "rate" | "date" = "date"
  sort: "asc" | "desc" = "desc"

  @Input() totalReviews!: number;
  reviewsPerPage: number = 4;
  currentPage: number = 0;
  editMode: boolean = false;

  reviewText: string = '';
  rating: number = 0;

  constructor(private route: ActivatedRoute,
              private authService: AuthService,
              private reviewService: ReviewService) {
  }

  async ngOnInit() {
    this.item_id = this.route.snapshot.params['item_id']
    this.user = this.authService.getUser()
    this.loginStatus = await this.authService.getLoginStatus()
    this.loginStatusSubscription = this.authService.loginStatusChanged.subscribe((loginStatusData: boolean) => {
      this.user = this.authService.getUser()
      this.loginStatus = loginStatusData;
    });

    await this.reviewService.getReviewsFromDB(this.item_id, this.currentPage, this.filter, this.sort);
    this.reviewSubscription = this.reviewService.reviewsChanged.subscribe((reviews: Review[]) => {
      this.reviews = []
      this.reviews = reviews
      if(reviews.length > 0) {
        this.userHasReview = this.reviews[0].user_id == this.user?.user_id
      }
      else {
        this.userHasReview = false;
      }
    })


  }
  async handleFilterChange(filter: "date" | "rate") {
    this.filter = filter
    await this.reviewService.getReviewsFromDB(this.item_id, this.currentPage, this.filter, this.sort);
  }

  async handleSortChange(sort: "asc" | "desc") {
    this.sort = sort
    await this.reviewService.getReviewsFromDB(this.item_id, this.currentPage, this.filter, this.sort);
  }
  handleEditMode(event: any) {
    this.editMode = event.editMode
    this.reviewText = event.reviewText
    this.rating = event.rating
  }
  ngOnDestroy() {
    this.loginStatusSubscription.unsubscribe()
    this.reviewSubscription.unsubscribe()
  }

  async onPageChange(page: number){
    this.currentPage = page;
    await this.reviewService.getReviewsFromDB(this.item_id, this.currentPage, this.filter, this.sort);
  }
}
