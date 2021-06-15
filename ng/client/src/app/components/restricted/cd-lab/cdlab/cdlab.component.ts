import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../../services/data/data.service';
@Component({
  selector: 'app-cdlab',
  templateUrl: './cdlab.component.html',
  styleUrls: ['./cdlab.component.css']
})
export class CDLabComponent implements OnInit {

  newLabName:string = "";
  newLabDesc:string = "";
  msg:string = "";
  labs:any = [];
  constructor(private ds:DataService) { 
    this.getLabs();

  }
  getLabs(){
    this.ds.getAllLabs().subscribe(
      data=>{
        console.log("Labs data", data);
        this.labs = data;
      },
      err=>{

    });
  }

  createNewLab(){
    this.msg = "Creating lab...";
    if( this.newLabName != "" && this.newLabDesc != ""){
      var o = {
        "lab_name":this.newLabName,
        "lab_description" : this.newLabDesc,
        "active_indicator" : 1
      };
      this.ds.postLab(o).subscribe( data=>{
        console.log("Success");
        this.msg = "Lab created";
        
        this.getLabs();
      },
      err =>{
        console.log("ERROR", err);
        if(err.status == 200){
          this.msg = "Lab created";
          this.getLabs();
        }
        else{
          this.msg = "Failed to create lab,try again";
        }
      }
      );
      
    }else{
      this.msg = "Name/description should not be blank";
    }
  }
  deleteLab(id,rev){
    console.log(id,rev);
    var b = {
      "_id":id,
      "_rev":rev
    };
    this.msg = "Deleting....";
    this.ds.deleteLab(b).subscribe(
      
      data =>{
        this.msg = "Deleted succesfully";
        this.getLabs();
      },
      err =>{
        if(err.status == 200 || err.status == 200){
          this.msg = "Deleted succesfully";
          this.getLabs();         
        }
        else{
          this.msg = "Failed to delete, try again";
        }
      }
    )
  }
  ngOnInit(): void {
  }

}
