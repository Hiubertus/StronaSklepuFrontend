import {Injectable, OnInit} from '@angular/core';
import {Order} from "../models/order.model";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../enviroments/enviroment";
import {AuthService} from "./auth.service";
import {Subject} from "rxjs";
import {ItemService} from "./item.service";
import {Item} from "../models/item.model";

@Injectable({
  providedIn: 'root'
})
export class OrderService implements OnInit{
  apiUrl = environment.apiUrl
  order1!: Order;
  order2!: Order;
  orders: Order[] = [this.order1 = {
    order_id: 1,
    items: this.itemService.getItems(),
    items_quantity: [1],
    cost: 59.98,
    apartment: '',
    street: 'Kurska 5',
    city: 'Lublin',
    payment: 'Karta',
    date: '2024-07-07',
    status: 'W toku'
  },
  this.order2 = {
    order_id: 2,
    items: this.itemService.getItems(),
    items_quantity: [1],
    cost: 59.98,
    apartment: '32',
    street: 'Sezamkowa 69',
    city: 'Warszawa',
    payment: 'Blik',
    date: '2024-07-10',
    status: 'Wysłane'
  }]

  ordersChange = new Subject<Order[]>()
  constructor(private http: HttpClient,private authService: AuthService, private itemService: ItemService) { }
  ngOnInit() {
  }
  async getOrdersFromDb() {
    this.http.get<Order[]>(`${this.apiUrl}/Orders`, {
      headers: {Authorization: `Bearer ${this.authService.getToken()}`}
    }).subscribe((data) => {
      this.orders = data
      this.ordersChange.next(this.orders);
    })
  }
  async getOrderFromDb(order_id: number) {
    let params = new HttpParams()
      .append('order_id',order_id)
    this.http.get<Order>(`${this.apiUrl}/Order`, {
      headers: {Authorization: `Bearer ${this.authService.getToken()}`},
      params: params
    }).subscribe((data) => {
      const index = this.orders.findIndex(order => order.order_id == order_id);
      if (index !== -1) {
        this.orders[index] = data;
      } else {
        this.orders.push(data);
      }
      this.ordersChange.next(this.orders);
    })
  }
  async postOrder(items: {item: Item, quantity: number}[], name: string, surname: string, city: string ,street: string, apartment: string, payment: string, cost: number) {
    const date = new Date()
    const order = {items, date , name, surname, city, street, apartment, payment, cost}
    this.http.post<any>(`${this.apiUrl}/Order`, order, {
      headers: {Authorization: `Bearer ${this.authService.getToken()}`}
    }).subscribe( {
      next: data =>{
      },
      error: err =>{

      }
    })
  }
  getOrders() {
    return this.orders.slice()
  }
  getOrder(order_id: number) {
    console.log(this.orders[1].items)
    return this.orders.find(order => order.order_id == order_id)!;
  }
}
