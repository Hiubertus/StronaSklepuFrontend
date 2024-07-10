import {Injectable} from '@angular/core';
import {User} from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor() {
  }

  saveCart(items: number[]) {
    localStorage.setItem('cart', JSON.stringify(items))
  }

  saveFavorite(items: number[]) {
    localStorage.setItem('favorite', JSON.stringify(items))
  }

  getCartFromStorage() {
    const items = localStorage.getItem('cart')
    return items ? JSON.parse(items) : null;
  }

  getFavoriteFromStorage() {
    const items = localStorage.getItem('favorite')
    return items ? JSON.parse(items) : null;
  }

  saveUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token')
  }

  clearUserData() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
}
