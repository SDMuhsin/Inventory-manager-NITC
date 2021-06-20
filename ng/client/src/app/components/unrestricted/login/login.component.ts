import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import {AuthenticationService} from '../../../services/authentication/authentication.service';
import {SessionManagementService} from '../../../services/session/sessionmanagement.service';
import {HttpClient,HttpHeaders,HttpResponse} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @Output() tellHomeToRefreshNav = new EventEmitter<void>();
  
  currentUsername:string;
  currentPassword:string;
  
  currentErrorMessage:string;
  currentSuccessMessage:string;
  
  roles:String[];
  
  loggedIn:boolean;
  constructor(private router:Router,private auth:AuthenticationService, private sesh:SessionManagementService) { 
	
	this.currentErrorMessage = "";
	this.currentSuccessMessage = "";
	this.currentUsername = "";
	this.currentPassword = "";
	this.loggedIn = this.sesh.isLoggedIn();
	
	// TO DO : De-hardcode this
  this.roles = [
		'Student',
		'Staff',
		'Admin'
	];
  }

  ngOnInit(): void {
  }
  
  onSubmit(){
	  //Check if passwords match
	  this.currentErrorMessage = "";
	  this.currentSuccessMessage = "";
	  if(this.currentPassword.length < 5){
		  this.currentErrorMessage = "Password must be atleast 6 characters long";
	  }else{
		  //Begin Log in
		  this.auth.login(this.currentUsername,this.currentPassword).subscribe( (re:HttpResponse<any>) => {
			  console.log(re);
			  console.log("re[body]",re["body"]);
			  console.log("re.body[cookies]",re.body["cookies"]);
			  
			  if(re.status){
				  this.currentSuccessMessage = 'Succesful';
				  
				  console.log("Did server set the cookie? ", this.sesh.isLoggedIn());
				  console.log("The response :", re);
				  if(!this.sesh.isLoggedIn()){
				  	this.sesh.setToken(re["cookies"]["token"]);
				  	this.sesh.setSessionDetails(re["cookies"]["access_level"],re["cookies"]["verified"]);

				  	this.loggedIn = this.sesh.isLoggedIn();
				  	this.callParent();
				  	//Route to profile page
				  	this.router.navigate(['/restricted/profile']);
				  }else{
					//console.log("Setting access_level and verified");
					console.log("Access level (re.body[cookies][access_level]: ", re.body["cookies"]["access_level"]);
					this.sesh.setSessionDetails(re.body["cookies"]["access_level"],re.body["cookies"]["verified"]);
					this.loggedIn = this.sesh.isLoggedIn();
					this.callParent();
					//Route to profile page
					this.router.navigate(['/restricted/profile']);
				  }
			  }else if(!re.status){
				  this.currentErrorMessage = 'Failed to log in, known error';
			  }
		  },
		  err => {
			  console.log(err);
			  if(err.status == 406 && err.error.error.error_code == 3){
				   this.currentErrorMessage = 'Incorrect password';
			  }else{
				  this.currentErrorMessage = 'Failed to log in 406';
			  }
		  }
		  );
	  }
  }
  
  callParent(){
	  console.log('Hello from login');
	  this.tellHomeToRefreshNav.emit();
  }
}
