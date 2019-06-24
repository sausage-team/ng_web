import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd';
import { Observable, ObservableInput, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private message: NzMessageService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    const clonedRequest = req.clone({
      headers: req.headers.set('X-CustomAuthHeader', 'cbjcl')
    });

    return next.handle(clonedRequest).pipe(
      catchError((err: any): ObservableInput<any> => {
        if (err) {
          switch (err.status) {
            case 401:
            case 403:
              this.message.error('无权操作，请重新登录');
              this.router.navigateByUrl('/login');
              break;
          }
        }
        return throwError(err);
      })
    );
  }
}
