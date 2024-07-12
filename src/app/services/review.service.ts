import {Injectable} from '@angular/core';
import {Review} from "../models/review.model";
import {Subject} from "rxjs";
import {HttpParams, HttpClient} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {ItemService} from "./item.service";
import {environment} from "../../enviroments/enviroment";

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  apiUrl = environment.apiUrl

  reviews!: Review[]
  reviewsChanged = new Subject<Review[]>()

  constructor(private http: HttpClient, private authService: AuthService, private itemService: ItemService) {
  }
  async getReviewsFromDB(item_id: number, page: number, filter: "rate" | "date", sort: "asc" | "desc") {
    const offset = page * 4;
    const user = this.authService.getUser();
    let params = new HttpParams()
      .append('item_id', item_id.toString())
      .append('filter', filter)
      .append('sort', sort)
      .append('offset', offset.toString());

    this.http.get<{ userReview: Review | null, itemReviews: Review[] }>(`${this.apiUrl}/ItemReviews`, {
      params: params,
      headers: user ? { Authorization: `Bearer ${this.authService.getToken()}` } : {}
    }).subscribe({
      next: (data) => {
        const { userReview, itemReviews } = data;
        if (userReview) {
          this.reviews = [userReview, ...itemReviews];
        } else {
          this.reviews = itemReviews;
        }
        this.reviewsChanged.next(this.reviews);
      },
      error: (err) => {
        console.error('Błąd podczas pobierania recenzji:', err);
      }
    });
  }

  async addReview(item_id: number, text: string, rate: number, filter: "rate" | "date", sort: "asc" | "desc") {
    const date = new Date(); // Pobierz aktualną datę
    const review = {item_id, text, rate, date}; // Dodaj datę do obiektu review
    this.http.post(`${this.apiUrl}/Review`, review, {
      headers: {Authorization: `Bearer ${this.authService.getToken()}`}
    }).subscribe(() => {
      this.getReviewsFromDB(item_id,0, filter, sort);
      this.itemService.getItemFromDb(item_id)
    });
  }
  async patchReview(item_id: number, text: string, rate: number, filter: "rate" | "date", sort: "asc" | "desc") {
    const date = new Date(); // Pobierz aktualną datę
    const review = {item_id, text, rate, date}; // Dodaj datę do obiektu review
    this.http.patch(`${this.apiUrl}/Review`, review, {
      headers: {Authorization: `Bearer ${this.authService.getToken()}`}
    }).subscribe(() => {
      this.getReviewsFromDB(item_id,0, filter, sort);
      this.itemService.getItemFromDb(item_id)
    });
  }
  async deleteReview(item_id: number, user_id: number, filter: "rate" | "date", sort: "asc" | "desc") {
    let params = new HttpParams()
    params = params.append("user_id", user_id)
    params = params.append("item_id", item_id)
    this.http.delete(`${this.apiUrl}/Review`, {
      headers: {Authorization: `Bearer ${this.authService.getToken()}`},
      params: params
    }).subscribe(() => {
      this.getReviewsFromDB(item_id,0, filter, sort)
      this.itemService.getItemFromDb(item_id)
    })
  }
}
