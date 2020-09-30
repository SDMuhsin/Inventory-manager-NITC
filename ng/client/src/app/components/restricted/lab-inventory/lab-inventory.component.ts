import { Component, OnInit } from '@angular/core';
import {DataService} from '../../../services/data/data.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-lab-inventory',
  templateUrl: './lab-inventory.component.html',
  styleUrls: ['./lab-inventory.component.css']
})
export class LabInventoryComponent implements OnInit {
  
  labId:string;
  components:any[];
  distinctComponentNames:string[];
  constructor(private dataService:DataService,private route:ActivatedRoute) {
	//Get lab id
	this.route.params.subscribe(data=>{
		
		console.log('Welcome to lab ',data);
		this.labId = data["labid"];
		
		//Get data
		this.dataService.getLabInventory(this.labId).subscribe(data=>{
			console.log('Fetching lab data :',data);
			this.components = data;
			this.distinctComponentNames = this.components.map(data=>data.name);
		
		});
		
		
	});
  }

  ngOnInit(): void {
  }

}
