import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders,HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
 
withCredentials: true, 
observe: 'response' as 'response'
};  

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  
  private registerUserUrl:string;
  private loginUrl:string;
  
  constructor(private http:HttpClient) { 
	this.registerUserUrl = 'http://localhost:9876/auth/register';
	this.loginUrl = 'http://localhost:9876/auth/login';
  }
  
  registration( username:string, password:string,access_level:String):Observable<any>{
	  return this.http.post(this.registerUserUrl,{
		  "username":username,
		  "password":password,
		  "access_level":access_level
	  });
	  
  }  
  login( username:string, password:string):Observable<any>{
	  return this.http.post(this.loginUrl,{
		  "username":username,
		  "password":password
	  });  
  }
}
