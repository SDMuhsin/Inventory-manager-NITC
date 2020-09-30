import { Component, OnInit } from '@angular/core';
import {DataService} from '../../../services/data/data.service';


export interface commonProperties {
	lab_id:string;
	name:string;
	total_count:number;
}
@Component({
  selector: 'app-comonent-editor',
  templateUrl: './comonent-editor.component.html',
  styleUrls: ['./comonent-editor.component.css'],

})
export class ComponentEditorComponent implements OnInit {
  
  labs:any = [];
  components:any = [];
  
  currentLabId:string;
  currentComponentsBeingShown:any = [];
  displayedColumns:string[] = ["name","total_count","in_inventory_count"];
  
  //Current Edits
  currentRowBeingEdited:any = {};
  currentRowBeingEditedPublicVersion:any = {};
  currentKeys:string[] = [];
  
  currentErrorMessage:string = "";
  currentSuccessMessage:string = "";
  constructor(private dataService:DataService) { 
	this.dataService.getAllLabs().subscribe(data=>{
		this.labs = data;
		console.log("Lab Data Recieved");
	},
	err => {
		console.log("error fetching labs");
	});
	this.dataService.getLabInventory("all").subscribe(data=>{
		this.components = data;
		console.log("Components" , data);
	},err=>{
		console.log("error getting components");
	});
  }
  
  reload(){
	this.currentLabId = "-1";
    this.currentComponentsBeingShown = [];
	this.components = [];
	this.labs = [];
	this.currentRowBeingEdited = {};
	this.currentRowBeingEditedPublicVersion = {};
	this.currentKeys = [];
	this.dataService.getAllLabs().subscribe(data=>{
		this.labs = data;
		console.log("Lab Data Recieved");
	},
	err => {
		console.log("error fetching labs");
	});
	this.dataService.getLabInventory("all").subscribe(data=>{
		this.components = data;
		console.log("Components" , data);
	},err=>{
		console.log("error getting components");
	});  
  }
  changeLab(){
	  console.log("changing lab to ", this.currentLabId);
	  
	  // TO clear current edit
	  this.currentRowBeingEdited = {};
	  this.currentRowBeingEditedPublicVersion = {};
	  this.currentKeys = [];
	  
	  if(this.currentLabId == "-1"){
		this.currentComponentsBeingShown = [];  
	  }else{
		this.currentComponentsBeingShown = this.components.filter(c=>c.lab_id == this.currentLabId);
		console.log(Object.values(this.currentComponentsBeingShown[0]));
	  }
	  console.log("Current Components being shown : ", this.currentComponentsBeingShown);
  }
  ngOnInit(): void {
  }
  
  editMode(row){
	  console.log("Edit mode, row",row);
	  this.currentRowBeingEdited = JSON.parse(JSON.stringify(row));
	  this.currentRowBeingEditedPublicVersion = JSON.parse(JSON.stringify(row));
	  
	  delete this.currentRowBeingEditedPublicVersion.lab_id;
	  delete this.currentRowBeingEditedPublicVersion._id;
	  delete this.currentRowBeingEditedPublicVersion._rev;
	  delete this.currentRowBeingEditedPublicVersion.template_id;
	  delete this.currentRowBeingEditedPublicVersion.active_indicator;
	  this.currentKeys = Object.keys(this.currentRowBeingEditedPublicVersion);
  }
  putComponent(){
	  console.log(this.currentRowBeingEdited);
	  if(Object.keys(this.currentRowBeingEdited).length != 0){
	  this.currentErrorMessage = "";
	  this.currentSuccessMessage = "";
	  
	  
	  //Check if anything is empty
	  let pass = true;
	  for(let i =0; i <this.currentKeys.length;i+=1){
		  if(this.currentRowBeingEditedPublicVersion[this.currentKeys[i]].length == 0 ){
			  pass = false;
			  this.currentErrorMessage = "No Field must be empty";
			  break;
		  }
	  }
	  if(pass){
		  for(let key of this.currentKeys){
			  this.currentRowBeingEdited[key] = this.currentRowBeingEditedPublicVersion[key];
		  }
		  this.dataService.putComponent(this.currentRowBeingEdited).subscribe(data=>{
			  console.log(data);
			  this.currentSuccessMessage = "Successfully updated";
			  this.reload();
			  
		  },
		  err => {
			  console.log(err);
			  this.currentErrorMessage = "Unknown error, server rejected request, " + err.status;
		  }
		  );
	  }
	}else{
		console.log("Empty");
	}
  }
  
  deleteComponent(){
	  console.log("Deleting");
	  this.currentErrorMessage = "";
	  this.currentSuccessMessage = "";
	  if(Object.keys(this.currentRowBeingEdited).length != 0){  
		  this.dataService.deleteComponent({"_id":this.currentRowBeingEdited._id,"_rev":this.currentRowBeingEdited._rev}).subscribe(data=>{
			console.log(data);
			this.currentSuccessMessage = "Successfully deleted";
			//this.reload();

			},
			err => {
			console.log(err);
			this.currentErrorMessage = "Unknown error, server rejected request, " + err.status; 
		  });
	  }else{
		  console.log("Empty");
  }
}
}
