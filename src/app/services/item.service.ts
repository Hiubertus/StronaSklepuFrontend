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
  async getItemFromDb(item_id: number) {
    this.http.get<Item>(`${this.apiUrl}/Item`, { params: new HttpParams().set('item_id', item_id.toString()) })
      .subscribe((data: Item) => {
        //console.log(data)
        const index = this.items.findIndex(item => item.item_id == item_id);
        console.log(index)
        if (index !== -1) {
          this.items[index] = data;
        } else {
          this.items.push(data);
        }
        this.itemsChanged.next(this.items);
      });
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

  getItem(item_id: number) {
    return this.items.find(item => item.item_id == item_id)!;
  }

  getCart() {
    return this.cartItems.map(item_id => this.getItem(item_id)).filter(item => item != null);
  }

  getFavorite() {
    return this.favoriteItems.map(item_id => this.getItem(item_id)).filter(item => item != null);
  }

  loadCartFromStorage() {
    const temp = this.localStorage.getCartFromStorage();
    if (temp) {
      this.cartItems = temp;
    }
  }

  loadFavoriteFromStorage() {
    const temp = this.localStorage.getFavoriteFromStorage();
    if (temp) {
      this.favoriteItems = temp;
    }
  }

  isItemInCart(item_id: number): boolean {
    return this.cartItems.includes(item_id);
  }

  isItemInFav(item_id: number): boolean {
    return this.favoriteItems.includes(item_id);
  }

  toggleCart(item_id: number) {
    const itemIndex = this.cartItems.indexOf(item_id);
    if (itemIndex === -1) {
      this.cartItems.push(item_id);
    } else {
      this.cartItems.splice(itemIndex, 1);
    }
    this.localStorage.saveCart(this.cartItems);
    this.cartChanged.next(this.getCart());
  }

  toggleFavorite(item_id: number) {
    const itemIndex = this.favoriteItems.indexOf(item_id);
    if (itemIndex == -1) {
      this.favoriteItems.push(item_id);
    } else {
      this.favoriteItems.splice(itemIndex, 1);
    }
    this.localStorage.saveFavorite(this.favoriteItems);
    this.favoriteChanged.next(this.getFavorite());
  }

}
