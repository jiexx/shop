import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthGuard } from './auth.guard';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let token = AuthGuard.getToken();
        if (token) {
            //request.headers.append('Authorization','Bearer '+token);
            request = request.clone({
                setHeaders: { 
                    Authorization: `Bearer ${token}`
                },
                setParams: {
                    version: `2`
                }
            });
        }else {
            request = request.clone({
                setParams: {
                    version: `2`
                }
            });
        }
        return next.handle(request);
    }
}