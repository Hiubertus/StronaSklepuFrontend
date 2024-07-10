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
  async getUserReviewForItem(item_id: number) {
    let params = new HttpParams()
      .append('item_id', item_id.toString())
    this.http.get<Review>(`${this.apiUrl}/UserReview`, {
      params: params,
      headers: {Authorization: `Bearer ${this.authService.getToken()}`}
    }).subscribe({
      next: (userReview) => {
        if (userReview) {
          this.reviews.unshift(userReview);
          this.reviewsChanged.next(this.reviews);
        }
      },
      error: (err) => {
        this.reviewsChanged.next(this.reviews);
        //console.error('Błąd podczas pobierania recenzji użytkownika:', err);
      }
    });
  }
  async getReviewsFromDB(item_id: number) {
    const user = this.authService.getUser();
    let params = new HttpParams()
      .append('item_id', item_id.toString())
      .append('filter', 'date')
      .append('sort', 'desc')
      .append('offset', '0');

    if (user) {
      const user_id = user.user_id;
      params = params.append('user_id', user_id.toString());
    }

    this.http.get<Review[]>(`${this.apiUrl}/ItemReviews`,
      { params: params }).subscribe({
      next: (data) => {
        this.reviews = data;
        if (user) {
          this.getUserReviewForItem(item_id);
        } else {
          this.reviewsChanged.next(this.reviews);
        }
      },
      error: (err) => {
        console.error('Błąd podczas pobierania recenzji:', err);
      }
    });
  }

  async addReview(item_id: number, text: string, rate: number) {
    const date = new Date(); // Pobierz aktualną datę
    const review = {item_id, text, rate, date}; // Dodaj datę do obiektu review
    this.http.post<Review[]>(`${this.apiUrl}/Review`, review, {
      headers: {Authorization: `Bearer ${this.authService.getToken()}`}
    }).subscribe(() => {
      this.getReviewsFromDB(item_id);
      this.itemService.getItemsFromDb();
    });
  }

  async deleteReview(item_id: number, user_id: number) {
    let params = new HttpParams()
    params = params.append("user_id", user_id)
    params = params.append("item_id", item_id)
    this.http.delete(`${this.apiUrl}/Review`, {
      headers: {Authorization: `Bearer ${this.authService.getToken()}`},
      params: params
    }).subscribe(() => {
      this.getReviewsFromDB(item_id)
      this.itemService.getItemsFromDb()
    })
  }
}
