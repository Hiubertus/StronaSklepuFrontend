import {Component, Input} from '@angular/core';
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {Review} from "../../../models/review.model";
import {User} from "../../../models/user.model";
import {ReviewService} from "../../../services/review.service";

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [
    DatePipe,
    MatIcon,
    NgForOf,
    NgIf,
    NgClass
  ],
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss'
})
export class ReviewComponent {
  @Input() review!: Review;
  @Input() loginStatus!: boolean;
  @Input() index! : number
  @Input() user! : User | null;

  constructor(private reviewService: ReviewService) {}

  userHasReview(id: number) {
    if (this.user == null) {
      return false
    } else {
      const userId = this.user.user_id
      return userId == id;
    }
  }
  async deleteReview(item_id: number, user_id: number) {
    await this.reviewService.deleteReview(item_id, user_id)
  }
}
