import { HttpResponse } from '@angular/common/http';

export const MAX_CACHE_AGE = 30000; // 单位为毫秒

export interface CacheEntry {
  url: string;
  response: HttpResponse<any>;
  entryTime: number;
}
