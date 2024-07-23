import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators
} from "@angular/forms";
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
export class ReviewFormComponent implements OnInit, OnChanges{
  @Input() item_id! : number;
  @Input() userHasReview! : boolean;
  @Input() loginStatus! :boolean;
  @Input() filter!: "rate" | "date"
  @Input() sort!: "asc" | "desc"
  @Input() editMode!: boolean
  @Output() editModeChange = new EventEmitter<boolean>();
  @Output() formSubmitted = new EventEmitter<void>();

  @Input() reviewText!: string;
  @Input() rating!: number;

  hoverState = 0;
  myForm!: FormGroup
  submitted: boolean = false;
  constructor(private reviewService: ReviewService) {}
  ngOnInit() {
    this.myForm = new FormGroup({
      reviewText : new FormControl('', Validators.maxLength(1500)),
      rating: new FormControl(0, this.ratingValidator())
    })
  }
  ngOnChanges(changes: SimpleChanges) {
    if ((changes['editMode'] || changes['reviewText'] || changes['rating']) && this.editMode) {
      this.myForm.patchValue({
        reviewText: this.reviewText,
        rating: this.rating
      });
      this.hoverState = this.rating
    }
  }

  ratingValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const rating = control.value;
      return rating > 0 ? null : { invalidRating: true };
    };
  }

  async submitReview() {
    this.submitted = true
    if(this.myForm.valid) {
      if(this.editMode) {
        try {
          await this.reviewService.patchReview(this.item_id, this.myForm.value.reviewText, this.myForm.value.rating, this.filter, this.sort)
          this.submitted = false
          this.cancelEditReview()
        } catch(err: any) {}
      }else {
        try {
          await this.reviewService.postReview(this.item_id, this.myForm.value.reviewText, this.myForm.value.rating, this.filter, this.sort)
          this.submitted = false
          this.myForm.reset()
          this.myForm.get('rating')?.setValue(0);
          this.myForm.get('reviewText')?.setValue('');
          this.hoverState = this.myForm.get('rating')?.value || 0;
        } catch(err: any) {}
      }
    }
  }
  cancelEditReview() {
    this.submitted = false;
    this.editModeChange.emit(false);
    this.myForm.get('rating')?.setValue(0);
    this.myForm.get('reviewText')?.setValue('');
    this.hoverState = this.myForm.get('rating')?.value || 0;
  }
  setRating(star: number) {
    this.myForm.get('rating')?.setValue(star);
  }

  enter(star: number): void {
    this.hoverState = star;
  }

  leave() {
    this.hoverState = this.myForm.get('rating')?.value || 0;
  }
}
