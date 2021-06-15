import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../services/data/data.service';
@Component({
  selector: 'app-dbmanager',
  templateUrl: './dbmanager.component.html',
  styleUrls: ['./dbmanager.component.css']
})
export class DBManagerComponent implements OnInit {
  
  dbs:any = [];
  dbStatus:any = {};
  msg:string = "";

  constructor(private ds:DataService) { 
    this.getDbs();
  }
  getDbs(){
    this.ds.getDBs().subscribe( data=>{
      console.log("DB data : ",data);
      this.dbs = Object.keys(data);
      this.dbStatus = data;
    },
    err => {
      this.msg = "Failed to get data";
    });
  }
  putDb(dbname:string){
    this.msg = "Failed to initilize db "
    console.log("Putting db name", dbname);
    this.ds.putDb(dbname).subscribe(
      data =>{
        console.log(data);
        this.getDbs();
      },
      err => {
        this.msg = "Failed to initilize db "
      }
    );
  }
  ngOnInit(): void {
  }



}
