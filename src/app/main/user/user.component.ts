import {Component} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router, RouterLink, RouterLinkActive} from "@angular/router";

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
  constructor(private router: Router, private authService: AuthService) {
  }

  async logoutUser() {
    if(confirm("Czy napewno chcesz się wylogować?")) {
      await this.authService.logout()
      await this.router.navigate(['/home']);
    }
  }

  async deleteUser() {
    if(confirm("Czy napewno chcesz usunąć swoje konto?")) {
      await this.router.navigate(['/home']);
      await this.authService.deleteUser()
    }
  }
}
