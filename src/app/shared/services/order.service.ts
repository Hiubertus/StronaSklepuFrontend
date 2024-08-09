import {Injectable, OnInit} from '@angular/core';
import {Order} from "../models/order.model";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../enviroments/enviroment";
import {AuthService} from "./auth.service";
import {Subject} from "rxjs";
import {ItemService} from "./item.service";
import {Item} from "../models/item.model";
import {LocalStorageService} from "./local-storage.service";

@Injectable({
  providedIn: 'root'
})
export class OrderService implements OnInit{
  apiUrl = environment.apiUrl
  orders: Order[] = [];


  ordersChange = new Subject<Order[]>()
  constructor(private http: HttpClient,private authService: AuthService, private itemService: ItemService, private localStorage: LocalStorageService) { }
  ngOnInit() {
  }
  async getOrdersFromDb() {
    this.http.get<Order[]>(`${this.apiUrl}/Orders`, {
      headers: {Authorization: `Bearer ${this.authService.getToken()}`}
    }).subscribe({
      next: (data: Order[]) => {
          this.orders = data
          this.ordersChange.next(this.orders);
      },
      error: (err: any) => {
        this.ordersChange.error(err)
      }
    })
  }
  async getOrderFromDb(order_id: number) {
    let params = new HttpParams()
      .append('order_id',order_id)
    this.http.get<Order>(`${this.apiUrl}/Order`, {
      headers: {Authorization: `Bearer ${this.authService.getToken()}`},
      params: params
    }).subscribe({
      next: (data: Order) => {
          const index = this.orders.findIndex(order => order.order_id == order_id);
          if (index !== -1) {
            this.orders[index] = data;
          } else {
            this.orders.push(data);
          }
          this.ordersChange.next(this.orders);
      },
      error: (err: any) => {
        this.ordersChange.error(err)
      }
    })
  }
  async postOrder(items: {item: Item, quantity: number}[], name: string, surname: string, city: string ,street: string, apartment: string, payment: string, cost: number) {
    const order = {items, name, surname, city, street, apartment, payment, cost}
    this.http.post<any>(`${this.apiUrl}/Order`, order, {
      headers: {Authorization: `Bearer ${this.authService.getToken()}`}
    }).subscribe( {
      next: () =>{
        setTimeout(async () => {
          this.localStorage.saveCart([]);
          this.itemService.cartChanged.next([]);
        }, 3000)
      },
      error: err =>{
        console.error(err)
      }
    })
  }
  getOrders() {
    return this.orders.slice()
  }
  getOrder(order_id: number) {
    return this.orders.find(order => order.order_id == order_id)!;
  }
}
