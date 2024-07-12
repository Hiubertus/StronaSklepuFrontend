import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";
import {NgForOf, NgIf} from "@angular/common";
import {ReviewService} from "../../../services/review.service";

@Component({
  selector: 'app-review-form',
  standalone: true,
    imports: [
        FormsModule,
        MatIcon,
        NgForOf,
        NgIf,
        ReactiveFormsModule
    ],
  templateUrl: './review-form.component.html',
  styleUrl: './review-form.component.scss'
})
export class ReviewFormComponent {
  @Input() item_id! : number;
  @Input() check! : boolean;
  @Input() loginStatus! :boolean;
  @Input() filter!: "rate" | "date"
  @Input() sort!: "asc" | "desc"
  @Input() editMode!: boolean
  @Output() editModeChange = new EventEmitter<boolean>();
  rating = 0;
  hoverState = 0;
  reviewText = '';

  constructor(private reviewService: ReviewService) {
  }
  async submitReview() {
    if(this.editMode) {
      await this.reviewService.patchReview(this.item_id, this.reviewText, this.rating, this.filter, this.sort)
      this.cancelEditReview()
    }else {
      await this.reviewService.addReview(this.item_id, this.reviewText, this.rating, this.filter, this.sort)
    }
  }
  cancelEditReview() {
    this.editModeChange.emit(false);
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
}
