import {RouterModule, Routes} from '@angular/router';
import {ItemDetailComponent} from "./items/item-detail/item-detail.component";
import {CartComponent} from "./main/cart/cart.component";
import {FavoriteComponent} from "./main/favorite/favorite.component";
import {UserComponent} from "./main/user/user.component";
import {UserDataComponent} from "./main/user/user-data/user-data.component";

import {authGuardLogged, authGuardUnlogged} from "./shared/services/auth-guard.service";
import {NgModule} from "@angular/core";
import {OrdersComponent} from "./main/user/orders/orders.component";
import {ItemListComponent} from "./items/item-list/item-list.component";
import {OrderDetailComponent} from "./main/user/orders/order/order-detail/order-detail.component";
import {AuthComponent} from "./main/user/auth/auth.component";
import {HomeComponent} from "./main/home/home.component";

export const routes: Routes = [
  { path: 'home', component: HomeComponent},
  { path: 'shop', component: ItemListComponent },
  { path: 'shop/item-detail/:item_id', component: ItemDetailComponent },
  { path: 'cart', component: CartComponent },
  { path: 'auth/:authMode' , component: AuthComponent, canActivate: [authGuardUnlogged] },
  { path: 'favorite', component: FavoriteComponent },
  { path: 'user', component: UserComponent, canActivate: [authGuardLogged] },
  { path: 'user/data', component: UserDataComponent, canActivate: [authGuardLogged] },
  { path: 'user/orders', component: OrdersComponent, canActivate: [authGuardLogged] },
  { path: 'user/orders/:order_id', component: OrderDetailComponent, canActivate: [authGuardLogged] },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
