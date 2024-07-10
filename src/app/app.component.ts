import {
  Component,
  OnInit
} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NavComponent} from "./nav/nav.component";
import {ItemService} from "./services/item.service";
import {AuthService} from "./services/auth.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'BeatkaProjekt';

  constructor(
    private itemService: ItemService,
    private authService: AuthService
  ) {
  }

  async ngOnInit() {
    await this.authService.initialize()
    await this.itemService.getItemsFromDb();
  }
}
