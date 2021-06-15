import { Component, OnInit } from '@angular/core';
import {DataService} from '../../../services/data/data.service';

@Component({
  selector: 'app-accounts-manager',
  templateUrl: './accounts-manager.component.html',
  styleUrls: ['./accounts-manager.component.css']
})
export class AccountsManagerComponent implements OnInit {

  currentDisplayAccounts;
  currentStat:string = 'pending';
  currentRole:string = 'Admin';
  validRoles:string[] = ["Admin","Student","Staff"];
  constructor(private dataService:DataService) {
  this.dataService.getAccounts(this.currentStat,this.currentRole).subscribe( 
  data=>{
	  console.log("[GET ACCOUNTS]",data);
	  this.currentDisplayAccounts = data;
	},
  err => {console.log("[GET ACCOUNTS]",err)});
  }
  
  refreshData(){
	this.dataService.getAccounts(this.currentStat,this.currentRole).subscribe( 
  data=>{
	  console.log("[GET ACCOUNTS]",data);
	  this.currentDisplayAccounts = data;
	},
  err => {console.log("[GET ACCOUNTS]",err)});  
  }
  ngOnInit(): void {
  }
  
  approve(id){
	  console.log("Approve ",id);
	  let ids = [id];
	  let o = {"ids":ids};
	  console.log(o);
	  this.dataService.approveAccounts(o).subscribe( d => {console.log(d);this.refreshData();}, e => {console.log(e)});
  }
  deactivate(id){
	  console.log("Approve ",id);
	  let ids = [id];
	  let o = {"ids":ids};
	  console.log(o);
	  this.dataService.deactivateAccounts(o).subscribe( d => {console.log(d);this.refreshData();}, e => {console.log(e)});
  }
}
