import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';

import { Store } from '@ngrx/store';
import { CookieUtil } from 'src/cache/cookie';
import { login, logout } from '../store/actions/user.action';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  constructor(
    private cookieService: CookieUtil,
    private router: Router,
    private store: Store<{
      account: Map<string, any>,
      isLogin: boolean
    }>,
    private message: NzMessageService
  ) {
    if (this.cookieService.getAccount()) {
      this.login();
    } else {
      this.logout();
      if (this.router.url !== '/login') {
        this.router.navigateByUrl('/login');
      }
    }
  }

  login() {
    this.store.dispatch(login());
  }

  logout() {
    this.store.dispatch(logout());
  }
}
