import { Component, OnInit } from '@angular/core';
import {SessionManagementService} from './services/session/sessionmanagement.service';
import { Subscription } from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  title = 'client';
  public loggedIn:boolean;
  private accessLevel:string;
  subscription: Subscription;
  
  constructor(public sesh:SessionManagementService,private router:Router){}
  
  ngOnInit():void{
	  this.subscription = this.sesh.loggedInStatusObservable$.subscribe(v => this.loggedIn = v);
  }
  
  logOut(){
	  console.log('hello');
	  this.sesh.clearSession();
	  
	  this.updateLoggedInStatus();
	  this.router.navigate(['/']);
	  //window.location.reload();
	  
  
  }
  updateLoggedInStatus(){
	this.loggedIn = this.sesh.isLoggedIn();  
	console.log(this.loggedIn);
  }
  
  //Whenever router does something
  onActivate(componentReference) {
	console.log('Hello from nav, but not yet subscribed');
   console.log(componentReference);
   this.updateLoggedInStatus();
   try{
	    
		componentReference.tellNavToRefresh.subscribe(r=>{console.log('Hello from nav');this.updateLoggedInStatus();});}
   catch(e){
	   console.log('Catch block, subscribing to tellNavToRefresh');
   }
  }
}
