import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs";
import {User} from "../models/user.model";
import {LocalStorageService} from "./local-storage.service";
import {environment} from "../../../enviroments/enviroment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = environment.apiUrl
  loginStatusChanged = new Subject<boolean>();

  private loginStatus!: boolean;
  private user!: User | null;
  private token!: string | null;

  constructor(private http: HttpClient, private localStorage: LocalStorageService) {
  }

  async initialize() {
    this.user = this.localStorage.getUser();
    this.token = this.localStorage.getToken();
    this.loginStatus = !!this.user;
    if(this.loginStatus) {
      try {
        await this.getUserFromDb()
      } catch(err: any) {
        //console.error(err)
        await this.logout()
      }
    }
    this.loginStatusChanged.next(this.loginStatus);
  }
  async getUserFromDb() {
    return new Promise<{ token: string, user: User}>((resolve, reject) => {
      this.http.get<{ token: string, user: User}>(`${this.apiUrl}/User`, {
        headers: {Authorization: `Bearer ` + this.token}
      }).subscribe({
        next: data => {
          this.token = data.token
          this.user = data.user
          this.localStorage.saveUser(data.user)
          this.localStorage.saveToken(data.token)
          resolve(data)
        },
        error: err => {
          reject(err)
        }
      })
    })
  }

  async getLoginStatus() {
    return this.loginStatus
  }

  getUser() {
    return this.user
  }

  getToken() {
    return this.token
  }

  async registerUser
  (username: string, email: string, password: string):
    Promise<{

    message: string
  }> {
    const user = { username, email, password}
    return new Promise<{message: string }>((resolve, reject) => {
      this.http.post<{ message: string }>(`${this.apiUrl}/registerUser`, user).subscribe({
        next: data => {
          resolve(data);
        },
        error: err => {
          console.error(err);
          if (err.error && err.error.message) {
            reject({ message: err.error.message });
          } else {
            reject({ message: 'Wystąpił nieznany błąd'});
          }
        }
      });
    });
  }

  async loginUser(email: string, password: string) {
    const user = {email, password}
    return new Promise<any>((resolve, reject) => {
      this.http.post<{
        message: string,
        token: string,
        user: User
      }>(`${this.apiUrl}/loginUser`, user).subscribe({
        next: data => {
          this.loginStatus = true;
          this.localStorage.saveUser(data.user)
          this.user = data.user
          this.localStorage.saveToken(data.token)
          this.token = data.token
          this.loginStatusChanged.next(this.loginStatus);
          resolve(data);
        },
        error: err => {
          console.error(err);
          if (err.error && err.error.message) {
            reject({ message: err.error.message});
          } else {
            reject({ message: 'Wystąpił nieznany błąd'});
          }
        }
      })
    })
  }

  async deleteUser() {
    return new Promise<any>((resolve) => {
      this.http.delete(`${this.apiUrl}/User`, {
        headers: {Authorization: `Bearer ` + this.token}
      }).subscribe(() => {
        this.logout()
      })
    })
  }

  async logout(): Promise<void> {
    this.loginStatus = false
    this.user = null
    this.token = null
    this.localStorage.clearUserData()
    this.loginStatusChanged.next(this.loginStatus);
  }

  async patchUserData(street: string, apartment: string, city: string) {
    return new Promise<{ message: string}>((resolve, reject) => {
      const userData = {street, apartment, city}
      this.http.patch<{ message: string}>(`${this.apiUrl}/UserData`, userData, {
        headers: {Authorization: `Bearer ` + this.token}
      }).subscribe({
        next: data => {
          resolve(data)
          this.getUserFromDb()
        },
        error: err => {
          if (err.error && err.error.message) {
            reject({ message: err.error.message});
          } else {
            reject({ message: 'Wystąpił nieznany błąd'});
          }
        }
      })
    })
  }

  async patchUserPassword(oldPassword: string, newPassword: string) {
    return new Promise<{ message: string }>((resolve, reject) => {
      const passwordData = {oldPassword, newPassword}
      this.http.patch<{ message: string }>(`${this.apiUrl}/UserPassword`, passwordData, {
        headers: {Authorization: `Bearer ` + this.token}
      }).subscribe({
        next: data => {

          resolve(data)
        },
        error: err => {
          console.error(err);
          if (err.error && err.error.message) {
            reject({ message: err.error.message});
          } else {
            reject({ message: 'Wystąpił nieznany błąd'});
          }
        }
      })
    })
  }
}
