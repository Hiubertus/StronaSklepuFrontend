import {Injectable, Input} from '@angular/core';
import {Status} from "../models/status.model";
import {environment} from "../../enviroments/enviroment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Subject} from "rxjs";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class StatusesService {
  apiUrl = environment.apiUrl
  statuses: Status[] = []
  statusesChanged = new Subject<Status[]>();
  constructor(private http: HttpClient, private authService: AuthService) {
  }
  async getStatusesFromDb(order_id: number) {
    let params = new HttpParams()
      .append('order_id', order_id)
    this.http.get<Status[]>(`${this.apiUrl}/Statuses`, {
      params: params,
      headers: { Authorization: `Bearer ${this.authService.getToken()}` }
    }).subscribe({
      next: data => {
        this.statuses = data;
        this.statusesChanged.next(this.statuses);
      },
      error: err => {

      }
    })
  }
}
