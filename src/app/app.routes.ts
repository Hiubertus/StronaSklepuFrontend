import {RouterModule, Routes} from '@angular/router';
import {ItemDetailComponent} from "./items/item-detail/item-detail.component";
import {CartComponent} from "./main/cart/cart.component";
import {FavoriteComponent} from "./main/favorite/favorite.component";
import {LoginComponent} from "./main/user/auth/login/login.component";
import {RegisterComponent} from "./main/user/auth/register/register.component";
import {UserComponent} from "./main/user/user.component";
import {UserDataComponent} from "./main/user/user-data/user-data.component";

import {authGuardLogged, authGuardUnlogged} from "./services/auth-guard.service";
import {NgModule} from "@angular/core";
import {OrdersComponent} from "./main/user/orders/orders.component";
import {ItemListComponent} from "./items/item-list/item-list.component";

export const routes: Routes = [
  { path: 'home', component: ItemListComponent },
  { path: 'item-detail/:index', component: ItemDetailComponent },
  { path: 'cart', component: CartComponent },
  { path: 'favorite', component: FavoriteComponent },
  { path: 'login', component: LoginComponent, canActivate: [authGuardUnlogged] },
  { path: 'register', component: RegisterComponent, canActivate: [authGuardUnlogged] },
  { path: 'user', component: UserComponent, canActivate: [authGuardLogged] },
  { path: 'user/data', component: UserDataComponent, canActivate: [authGuardLogged] },

  // { path: 'user/orders', component: OrdersComponent, canActivate: [authGuardLogged] },
  // { path: 'user/orders/:order', component: OrdersComponent, canActivate: [authGuardLogged] },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
