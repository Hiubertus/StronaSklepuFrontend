import {Injectable, OnInit} from '@angular/core';
import {Order} from "../models/order.model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../enviroments/enviroment";
import {AuthService} from "./auth.service";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class OrderService implements OnInit{
  apiUrl = environment.apiUrl
  orders: Order[] = []
  ordersChange = new Subject<Order[]>()
  constructor(private http: HttpClient,private authService: AuthService) { }
  ngOnInit() {
  }
  async getOrderdFromDb() {
    this.http.get<Order[]>(`${this.apiUrl}/Orders`, {
      headers: {Authorization: `Bearer ${this.authService.getToken()}`}
    }).subscribe((data) => {
      this.orders = data
      this.ordersChange.next(this.orders);
    })
  }

}
