import { Component, OnInit } from '@angular/core';
import {DataService} from '../../../services/data/data.service';
import { TemplateProperty } from '../../../models/template-property/template-property.model';

@Component({
  selector: 'app-component-creation',
  templateUrl: './component-creation.component.html',
  styleUrls: ['./component-creation.component.css']
})
export class ComponentCreationComponent implements OnInit {
  
  templates:any = [];
  labs:any = [];
  currentTemplateIndex:number = -1;
  currentProperties:any = [];
  
  currentPropertyDict:any = {};
  
  currentComponentName:string = "";
  
  currentErrorMessage:string = "";
  currentSuccessMessage:string = "";
  
  constructor(private dataService:DataService){
	  this.dataService.getTemplates().subscribe(data=>{
		console.log("Templates data : ", data );
		this.templates = data;
		
		
	  },err=>{console.log(err);});
	  this.dataService.getAllLabs().subscribe(data=>{this.labs = data;console.log(data);},err=>{console.log("Error",err);});
  }
	
  updateCurrentTemplate(){
	  this.currentPropertyDict["name"] == ""
	  console.log("update current template",this.currentTemplateIndex);
	  if(this.currentTemplateIndex != -1){
		  this.currentProperties = this.templates[this.currentTemplateIndex].component_properties;
	  }
	  console.log(this.currentProperties);
	  
	  //make dictionary of current properties
	  this.currentPropertyDict = {};
	  for(let i = 0; i < this.currentProperties.length; i+= 1){
		  this.currentPropertyDict[this.currentProperties[i].property_name] = "";
	  }
	  console.log(this.currentPropertyDict);
  }
  
  submitComponent(){
	  this.currentErrorMessage = "";
	  this.currentSuccessMessage = "";
	  
	  //Check if lab id template id or name are empty
	  if(this.currentTemplateIndex == -1 || this.currentPropertyDict["name"] == ""){
		  this.currentErrorMessage = "No field should be empty";
		  
	  }else{
		  /*
			TO DO :: MAKE SURE NO FIELD IS EMPTY
		  */
		  console.log(this.currentPropertyDict);
		  
		  //SOME DEFAULT STUFF
		  this.currentPropertyDict["active_indicator"] = 1;
		  this.currentPropertyDict["in_inventory_count"] = this.currentPropertyDict["total_count"];
		  
		  this.currentPropertyDict["template_id"] = this.templates[this.currentTemplateIndex]["_id"];
		  this.dataService.postComponent(this.currentPropertyDict).subscribe(data=>{console.log(data);this.currentSuccessMessage = "Success, Component Created";		},err=>{
			  console.log(err);
			  if(err.status == 400){
				  this.currentErrorMessage = "Component already exists for this lab";
			  }else{
				  this.currentErrorMessage = "Unkown error";
			  }
		  });

	  }
  }
  ngOnInit(): void {
  }

}
