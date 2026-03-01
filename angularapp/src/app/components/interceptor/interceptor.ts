import { Component } from '@angular/core';

@Component({
  selector: 'app-interceptor',
  imports: [],
  templateUrl: './interceptor.html',
  styleUrl: './interceptor.css',
})
export class Interceptor {}
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if(request.url.includes('/auth/login') || request.url.includes('/auth/register')){
      return next.handle(request);
    }

    const token = localStorage.getItem('accesstoken');
    let authReq = request;

    if(token){
      authReq = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if(error.status === 401){
          if(!token){
            localStorage.clear();
            this.router.navigate(['/login']);
          }
        }

        return throwError(() => error)
      })
    )
  }
}
