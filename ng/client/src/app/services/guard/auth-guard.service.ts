import { Injectable } from '@angular/core';
import {SessionManagementService} from '../session/sessionmanagement.service';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{
  
  constructor(private sesh:SessionManagementService) {
	  
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):boolean{
	 let roles = route.data["roles"] as Array<string>;
	 let accessRequired = route.data["accessRequired"];
	 
	 console.log("[AUTH GUARD]", roles);
	 console.log("[AUTH GUARD]", accessRequired);
	 //Check verification required
	 if(accessRequired){
		 console.log(this.sesh.getVerified());
		 if(this.sesh.getVerified() == '0' || !this.sesh.getVerified()){
			 console.log('[AUTH GUARD] ACCESS DENIED');
			 return false;
		 }
	 }
	 
	 //Check roles
	 if(roles.length == 0){
		 return true;
	 }
	 if(!roles.includes(this.sesh.getAccessLevel())){
			return false;
	 }
	 return true;
  }
}
