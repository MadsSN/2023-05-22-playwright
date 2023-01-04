import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Configuration } from '@eternal/shared/config';
import { Observable, of } from 'rxjs';
import { holidays } from './holidays.data';

@Injectable()
export class HolidaysInterceptor implements HttpInterceptor {
  constructor(private configuration: Configuration) {
  }

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (!this.configuration.mockHolidays) {
      return next.handle(req);
    }

    if (
      req.method === 'GET' &&
      req.url.startsWith(`${this.configuration.baseUrl}/holidays`)
    ) {
      return of(new HttpResponse({body: holidays}));
    }

    return next.handle(req);
  }
}
