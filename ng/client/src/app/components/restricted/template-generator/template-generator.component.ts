import { Component, OnInit } from '@angular/core';
import { TemplateProperty } from '../../../models/template-property/template-property.model';
import {DataService} from '../../../services/data/data.service';
@Component({
  selector: 'app-template-generator',
  templateUrl: './template-generator.component.html',
  styleUrls: ['./template-generator.component.css']
})


export class TemplateGeneratorComponent implements OnInit {
	
  currentTemplateName:string = "";
  currentPropertyCount:number = 0;
  
  currentProperties:TemplateProperty[] = [];
  
  currentErrorMessage:string = "";
  currentSuccessMessage:string = "";
  constructor(private dataService:DataService) { 
	
  }

  ngOnInit(): void {
  }
  
  updatePropertyCount(){
	  console.log(this.currentProperties);
	  this.currentProperties = [];
	  for(let i=0;i<this.currentPropertyCount;i++){
		  this.currentProperties.push(new TemplateProperty('',''));
	  }
	  console.log(this.currentProperties);
  }
  
  onSubmit(){
	  this.currentErrorMessage = "";
	  this.currentSuccessMessage = "";
	  var notReady= false;
	  for(let i=0;i<this.currentPropertyCount;i++){
		  if(this.currentProperties[i].propertyName.length == 0 || this.currentProperties[i].propertyValueType.length == 0){
			  notReady = true;
			  break;
		  }
	  }
	  if(notReady || this.currentTemplateName.length == 0){
		  this.currentErrorMessage = 'All properties must be filled';
	  }else{
		//Set PUT request
		this.dataService.postComponentTemplate({
			"template_name":this.currentTemplateName,
			"component_properties": this.currentProperties.map((p)=>{return {
				"property_name":p.propertyName,
				"property_value_type":p.propertyValueType
			};})
		}).subscribe(data=>{
			console.log(data);
			if(data["ok"]){
				this.currentErrorMessage = "";
				this.currentSuccessMessage = "Template created"
			}else{
				this.currentErrorMessage = "Template rejected by server";
			}
		},
	  err => {console.log(err);this.currentErrorMessage = "Template rejected by server";});
	  }
  }
}
