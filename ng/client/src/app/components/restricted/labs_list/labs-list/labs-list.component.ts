import { Component, OnInit } from '@angular/core';
import {DataService} from '../../../../services/data/data.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-labs-list',
  templateUrl: './labs-list.component.html',
  styleUrls: ['./labs-list.component.css']
})
export class LabsListComponent implements OnInit {
  
  labs:any[] = [];
  constructor(private dataService:DataService,private router:Router) { 
	this.dataService.getAllLabs().subscribe( (data)=>{
		this.labs = data;
		console.log(this.labs);
		console.log('Labs data recieved');
	});
  }
  goToLab(lab:any){
	  console.log("Go To Lab",lab);
	  this.router.navigate(['restricted/lab/inventory/',lab._id]);
  }
  
  ngOnInit(): void {
  }
  

}
