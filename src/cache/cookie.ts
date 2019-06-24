import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CookieUtil {
  constructor(
    private cookie: CookieService
  ) {}

  saveLoginData(accountInfo: Map<string, any>): void {
    this.cookie.set('account_info', encodeURIComponent(JSON.stringify(accountInfo)));
  }

  getAccount(): Map<string, any> | boolean {
    if (this.cookie.get('account_info')) {
      const accountInfo: Map<string, any> = JSON.parse(decodeURIComponent(this.cookie.get('account_info')));
      return accountInfo;
    }
    return false;
  }
}
