import {Component, Input, Output} from '@angular/core';
import { EventEmitter} from "@angular/core";
import {NgForOf, NgIf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [
    NgForOf,
    MatIcon,
    NgIf
  ],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
  @Input() totalReviews: number = 0;
  @Input() reviewsPerPage: number = 4;
  @Input() currentPage: number = 0;
  @Input() check!: boolean;
  @Output() pageChanged = new EventEmitter<number>();
  filter: "rate" | "date" = "date"
  sort: "asc" | "desc" = "desc"
  @Output() filterChanged = new EventEmitter<"rate" | "date">();
  @Output() sortChanged = new EventEmitter<"asc" | "desc">();

  onFilterChange() {
    this.filter = this.filter === 'rate' ? 'date' : 'rate';
    this.filterChanged.emit(this.filter);
  }
  onSortChange() {
    this.sort = this.sort === 'asc' ? 'desc' : 'asc';
    this.sortChanged.emit(this.sort);
  }


  get totalPages(): number {
    console.log(this.check)
    const adjustedReviews = this.check ? this.totalReviews - 1 : this.totalReviews;
    return Math.ceil(adjustedReviews / this.reviewsPerPage);
  }

  get pages() {
    const totalPages = this.totalPages
    const currentPage = this.currentPage;
    const delta = 2;
    const range = [];

    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
      return range;
    }

    for (let i = Math.max(2, currentPage - delta+2); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 0) {
      range.unshift('...');
    }
    if (currentPage + delta < totalPages - 1) {
      range.push('...');
    }

    range.unshift(1);
    if (totalPages > 1) {
      range.push(totalPages);
    }
    return range;
  }

  onPageChange(page: number | string): void {
    if (typeof page === 'string') {
      return;
    }
    this.pageChanged.emit(page - 1);
  }
}
