import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpResponse, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpsInterceptorService implements HttpInterceptor {

  constructor() { }
  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("INTERCEPTOR, URL  :", httpRequest.url);
    //const secureReq = httpRequest.clone({
    //  url: httpRequest.url.replace('http://', 'https://')
    //});
    // send the cloned, "secure" request to the next handler.
    return next.handle(httpRequest);
    
  }
}
