import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders,HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import ipData from "../../../assets/backend-ip.json";

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
  
  li:string = ipData["ip"] ; //"http://localhost:9876/";//li:string = "http://192.168.18.4:9876/"; // local ip
  constructor(private http:HttpClient) { 
    this.li = ipData["ip"];
	  this.registerUserUrl = this.li + 'auth/register';
	  this.loginUrl = this.li + 'auth/login';
  }
  
  registration( username:string, password:string,access_level:String):Observable<any>{
	  return this.http.post(this.registerUserUrl,{
		  "username":username,
		  "password":password,
		  "access_level":access_level
	  }, httpOptions);
	  
  }  
  login( username:string, password:string):Observable<any>{
    console.log("LOGIN URL : ", this.loginUrl);
	  return this.http.post(this.loginUrl,{
		  "username":username,
		  "password":password
	  }, httpOptions);  
  }
}
