import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpResponse, HttpHandler } from '@angular/common/http';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { CacheService } from '../services/cache.service';

const CACHABLE_URL = 'localhost';

@Injectable()
export class CachingInterceptor implements HttpInterceptor {
    constructor(private cache: CacheService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        // 判断当前请求是否可缓存
        if (!this.isRequestCachable(req)) {
           return next.handle(req);
        }
        // 获取请求对应的缓存对象，若存在则直接返回该请求对象对应的缓存对象
        const cachedResponse = this.cache.get(req);
        if (cachedResponse !== null) {
           return of(cachedResponse);
        }
        // 发送请求至API站点，请求成功后保存至缓存中
        return next.handle(req).pipe(
           tap(event => {
              if (event instanceof HttpResponse) {
                this.cache.put(req, event);
              }
           })
        );
    }

    // 判断当前请求是否可缓存
    private isRequestCachable(req: HttpRequest<any>) {
        return (req.method === 'GET') && (req.url.indexOf(CACHABLE_URL) > -1);
    }
}
