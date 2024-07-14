import {Component, EventEmitter, Input, Output} from '@angular/core';
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
  @Input() item_id! : number
  @Input() user! : User | null;
  @Input() filter!: "rate" | "date"
  @Input() sort!: "asc" | "desc"
  @Output() editStart = new EventEmitter<{ editMode: boolean, reviewText: string, rating: number} >();
  constructor(private reviewService: ReviewService) {}
  startEdit() {
    this.editStart.emit({ editMode: true, reviewText: this.review.text, rating: this.review.rate} )
  }
  userHasReview(id: number) {
    if (this.user == null) {
      return false
    } else {
      const userId = this.user.user_id
      return userId == id;
    }
  }
  async deleteReview(item_id: number, user_id: number) {
    if(confirm("Czy napewno chcesz usunąć recenzje?")) {
      await this.reviewService.deleteReview(item_id, user_id, this.filter, this.sort)
      this.editStart.emit({ editMode: false, reviewText: '', rating: 0})
    }
  }
}
