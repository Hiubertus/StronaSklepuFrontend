import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AuthService } from "../services/auth.service";
import { Subscription } from "rxjs";
@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    MatIconModule,
      RouterLink,
      RouterLinkActive,
      CommonModule
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent implements OnInit, OnDestroy{
  loginStatus!: boolean
  loginStatusSubscription!: Subscription
  constructor(private authService: AuthService) {}
  async ngOnInit() {
      this.loginStatus = await this.authService.getLoginStatus()
      this.loginStatusSubscription = this.authService.loginStatusChanged.subscribe((loginStatusData: boolean)=> {
        this.loginStatus = loginStatusData
      })
  }
  ngOnDestroy() {
    this.loginStatusSubscription.unsubscribe()
  }
}
