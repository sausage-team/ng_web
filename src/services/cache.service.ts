import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse } from '@angular/common/http';

import { Cache } from '../cache/cache';
import { CacheEntry, MAX_CACHE_AGE } from '../cache/cache.entry';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class CacheService implements Cache {
  cacheMap = new Map<string, CacheEntry>();

  constructor(private logger: LoggerService) {}

  get(req: HttpRequest<any>): HttpResponse<any> | null {
    // 判断当前请求是否已被缓存，若未缓存则返回null
    const entry = this.cacheMap.get(req.urlWithParams);
    if (!entry) { return null; }
    const isExpired = Date.now() - entry.entryTime > MAX_CACHE_AGE;
    this.logger.log(`req.urlWithParams is Expired: ${isExpired} `);
    return isExpired ? null : entry.response;
  }

  put(req: HttpRequest<any>, res: HttpResponse<any>): void {
     // 创建CacheEntry对象
    const entry: CacheEntry = {
      url: req.urlWithParams,
      response: res,
      entryTime: Date.now()
    };

    this.logger.log(`Save entry.url response into cache`);
    // 以请求url作为键，CacheEntry对象为值，保存到cacheMap中。并执行
    // 清理操作，即清理已过期的缓存。
    this.cacheMap.set(req.urlWithParams, entry);
    this.deleteExpiredCache();
  }

   private deleteExpiredCache() {
    this.cacheMap.forEach(entry => {
      if (Date.now() - entry.entryTime > MAX_CACHE_AGE) {
        this.cacheMap.delete(entry.url);
      }
    });
  }
}
