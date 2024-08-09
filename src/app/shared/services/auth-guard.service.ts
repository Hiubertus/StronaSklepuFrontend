import {inject, Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {CanActivateFn, Router} from '@angular/router';
import {from, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  constructor(private authService: AuthService, private router: Router) {
  }

  canActivateLogged(): Observable<boolean> {
    return from(this.authService.getLoginStatus()).pipe(
      map(loginStatus => {
        if (loginStatus) {
          return true;
        } else {
          this.router.navigate(['/home']);
          return false;
        }
      })
    );
  }

  canActivateUnlogged(): Observable<boolean> {
    return from(this.authService.getLoginStatus()).pipe(
      map(loginStatus => {
        if (!loginStatus) {
          return true;
        } else {
          this.router.navigate(['/home']);
          return false;
        }
      })
    );
  }

}

export const authGuardLogged: CanActivateFn = (route, state) => {
  return inject(AuthGuardService).canActivateLogged();
}

export const authGuardUnlogged: CanActivateFn = (route, state) => {
  return inject(AuthGuardService).canActivateUnlogged();
}
