import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import {SessionManagementService} from '../../../services/session/sessionmanagement.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @Output() tellNavToRefresh = new EventEmitter<void>(); 
  
  loggedInStatus:boolean;
  constructor(private sesh:SessionManagementService){}

  ngOnInit(): void {
	  
	  this.loggedInStatus = this.sesh.isLoggedIn();
	  console.log("Logged In Status :",this.loggedInStatus);
  }
  
  updateLoggedInStatus(){
	  this.loggedInStatus = this.sesh.isLoggedIn();
  }
  
  refreshNavBar(){
	  console.log('Hello from Home');
	  this.loggedInStatus = this.sesh.isLoggedIn();
	  this.tellNavToRefresh.emit();
  }
  
}
