import {Injectable} from '@angular/core';
import {Item} from "../models/item.model";
import {Subject} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {LocalStorageService} from "./local-storage.service";
import {environment} from "../../enviroments/enviroment";

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  apiUrl = environment.apiUrl

  private items: Item[] = []
  private cartItems: number[] = []
  private favoriteItems: number[] = []

  itemsChanged = new Subject<Item[]>();
  cartChanged = new Subject<Item[]>();
  favoriteChanged = new Subject<Item[]>();

  constructor(private http: HttpClient, private authService: AuthService, private localStorage: LocalStorageService) {
  }
  async getItemfromDb(index: number) {
    let params = new HttpParams()
      .append('item_id', index)
    this.http.get<Item>(`${this.apiUrl}/Items`, {
      params: params
      }
    ).subscribe((data: Item) => {
      this.items[index-1] = data
      this.itemsChanged.next(this.items);

      this.loadCartFromStorage()
      this.cartChanged.next(this.getCart())

      this.loadFavoriteFromStorage()
      this.favoriteChanged.next(this.getFavorite())
    })
  }
  async getItemsFromDb() {
    this.http.get<Item[]>(`${this.apiUrl}/Items`
    ).subscribe((data: Item[]) => {
      this.items = data
      this.itemsChanged.next(this.items);

      this.loadCartFromStorage()
      this.cartChanged.next(this.getCart())

      this.loadFavoriteFromStorage()
      this.favoriteChanged.next(this.getFavorite())
    })
  }

  getItems() {
    return this.items.slice()
  }

  getItem(index: number) {
    return this.items[index];
  }

  getCart() {
    return this.cartItems.map(item_id => this.items[item_id - 1]).slice();
  }

  getFavorite() {
    return this.favoriteItems.map(item_id => this.items[item_id - 1]).slice();
  }

  loadCartFromStorage() {
    const temp = this.localStorage.getCartFromStorage()
    if (temp) {
      this.cartItems = temp

    }
  }

  loadFavoriteFromStorage() {
    const temp = this.localStorage.getFavoriteFromStorage()
    if (temp) {
      this.favoriteItems = temp
    }
  }

  isItemInCart(item_id: number): boolean {
    return this.cartItems.includes(item_id);
  }

  isItemInFav(item_id: number): boolean {
    return this.favoriteItems.includes(item_id);
  }

  toggleCart(index: number) {
    const itemIndex = this.cartItems.indexOf(index);
    if (itemIndex === -1) {
      this.cartItems.push(index);
    } else {
      this.cartItems.splice(itemIndex, 1);
    }
    this.localStorage.saveCart(this.cartItems)
    this.cartChanged.next(this.getCart())
  }

  toggleFavorite(index: number) {
    const itemIndex = this.favoriteItems.indexOf(index);
    if (itemIndex === -1) {
      this.favoriteItems.push(index);
    } else {
      this.favoriteItems.splice(itemIndex, 1);
    }
    this.localStorage.saveFavorite(this.favoriteItems)
    this.favoriteChanged.next(this.getFavorite())
  }

}
