import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

  constructor(private _authenticationService: AuthenticationService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token= this._authenticationService.token;
    if (!token) {
      return next.handle(request);
    } else {
      // HttpRequest cloneRequest= request.clone();
      return next.handle(request.clone({
        setHeaders: {
          "authorization": "bearer"+token
        }
      }));
    }
  }
}
