import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../../services/authentication/authentication.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  
})
export class RegisterComponent implements OnInit {
  
  registrationUrl:String = 'http://localhost:9876/auth/registration';
  
  currentUsername:string;
  currentPassword:string;
  currentPassword2:string;
  currentAccessLevel:string;
  
  currentErrorMessage:string;
  currentSuccessMessage:string;
  
  roles:String[];
  constructor(private auth:AuthenticationService) { 
	this.currentErrorMessage = "";
	
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
	  if(this.currentPassword != this.currentPassword2){
		  this.currentErrorMessage = "Passwords Dont match";
	  }
	  //Check if passwords are long
	  else if(this.currentPassword.length < 5){
		  this.currentErrorMessage = "Password must be atleast 6 characters long";
	  }else{
		  //Begin Registration
		  this.auth.registration(this.currentUsername,this.currentPassword,this.currentAccessLevel).subscribe( r => {
			  if(r.status){
				  this.currentSuccessMessage = 'Succesful, please log in';
			  }else if(r.status == 0){
				  this.currentErrorMessage = 'User name already exists, try logging in';
			  }
		  },
		  err => {
			  console.log(err);
			  if(err.status == 406 && err.error.error.error_code == 0){
				   this.currentErrorMessage = 'User name already exists, try logging in';
			  }
		  }
		  );
	  }
  }

}
