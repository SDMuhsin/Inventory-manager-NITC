import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable,BehaviorSubject } from 'rxjs';
import ipData from "../../../assets/backend-ip.json";

@Injectable({
  providedIn: 'root'
})
export class SessionManagementService {
	private loggedInStatus:boolean;
	private loggedInStatusObservable:BehaviorSubject<boolean> ;
   
   loggedInStatusObservable$: Observable<boolean>;
   
  constructor(private cookieService:CookieService) {
	
	  this.loggedInStatus = this.isLoggedIn();
	  this.loggedInStatusObservable = new BehaviorSubject<boolean>(this.loggedInStatus);
	  this.loggedInStatusObservable$ = this.loggedInStatusObservable.asObservable();
  }
  
  isLoggedIn():boolean{
	  var token:string = this.cookieService.get('token');
	  this.loggedInStatus = !!token;
	  //this.loggedInStatusObservable.next(this.loggedInStatus);
	  return !!token;
  }
  
  setToken(token:any){
	  this.cookieService.set('token',token);
	  this.isLoggedIn();
  }
  getToken(){
	  return this.cookieService.get('token');
  }
  setSessionDetails(access_level:string,verified:string){
	  this.cookieService.set('access_level',access_level);
	  this.cookieService.set('verified',verified);
	  this.isLoggedIn();
  }
  clearSession(){
	  console.log('Session cancelled');
	  this.cookieService.deleteAll();
	  this.isLoggedIn();
  }
  getVerified(){
	  console.log('Verified :',this.cookieService.get('verified'));
	  return this.cookieService.get('verified');
  }
  getAccessLevel(){
	  console.log('Access level :',this.cookieService.get('access_level'));
	  return this.cookieService.get('access_level');
  }
}
