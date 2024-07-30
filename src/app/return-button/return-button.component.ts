import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {Location} from "@angular/common";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-return-button',
  standalone: true,
  imports: [
    MatIcon
  ],
  templateUrl: './return-button.component.html',
  styleUrl: './return-button.component.scss'
})
export class ReturnButtonComponent {
  constructor(private location: Location, private router: Router) {
  }
  goBack() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      // Define a fallback route in case there is no history
      this.router.navigate(['/shop']);
    }
  }
}
