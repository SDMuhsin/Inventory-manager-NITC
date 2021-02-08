import { Input ,Component, OnInit } from '@angular/core';
import {SessionManagementService} from '../../../services/session/sessionmanagement.service';
@Component({
  selector: 'app-links-page',
  templateUrl: './links-page.component.html',
  styleUrls: ['./links-page.component.css']
})
export class LinksPageComponent implements OnInit {
	

  
  roles:string[] = ['Student','Staff','Admin'];
  role:string = "";
  links:any = [];
  constructor( private sesh:SessionManagementService) { 
	this.role = this.sesh.getAccessLevel();
	console.log(this.role);
	if(this.role == this.roles[0]){
		this.links = [
		{url:'/restricted/profile',name:'View Profile'},
		{url:'/restricted/labs',name:'View Labs'},
		];
	}else if(this.role == this.roles[1]){
		this.links = [
		{url:'/restricted/profile',name:'View Profile'},
		{url:'/restricted/labs',name:'View Labs'},
		{url:'/restricted/component/creation',name:'Create Component'},
		{url:'/restricted/component/editor',name:'Edit Component'},
		{url:'/restricted/transactions',name:'Transactions'}
		];
	}else if(this.role == this.roles[2]){
		this.links = [
		{url:'/restricted/profile',name:'View Profile'},
		{url:'/restricted/labs',name:'View Labs'},
		{url:'/restricted/component/creation',name:'Create Component'},
		{url:'/restricted/component/editor',name:'Edit Component'},
		{url:'/restricted/template/generator',name:'Create Template'},
			{url:'/restricted/transactions',name:'Transactions'},
			{url:'/restricted/accounts',name:'Accounts manager'}
		];		
	}
  }

  ngOnInit(): void {
	  
  }

}
