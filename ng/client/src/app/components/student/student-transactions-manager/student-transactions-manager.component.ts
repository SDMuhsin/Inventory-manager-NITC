import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-student-transactions-manager',
  templateUrl: './student-transactions-manager.component.html',
  styleUrls: ['./student-transactions-manager.component.css']
})
export class StudentTransactionsManagerComponent implements OnInit {
  loggedInStatus:boolean = true;
  userName:string = "";
  password:string = "";
  
  msg:string = "";
  dMsg:string = "";
  lMsg:string = "";

  history:any;
  components:any;
  hSelected:boolean = false;
  currentlySelectedHistoryIndex:any = "None";
  csh:any = {};

  currentlySelectedLabIndex:any = "None";

  labs:any;
  constructor(private ds:DataService) { 

  }

  getTransactionsHistory(){
    this.msg = "Getting transaction history";
    // Check if username isnt blank
    if(this.userName == "" || this.password == ""){
      this.msg = "Username and password should not be empty";
    }else{
      //Make username password body
      var b = {"user_registration_number":this.userName, "password":this.password};
      this.ds.getPublicTransactions(b).subscribe(
        data =>{
          this.history = data["docs"];
          console.log(this.history);
          this.msg = "Transaction history loaded";
        },
        err =>{
          if(err.status == 401){
            this.msg = "Username/password error";
          }else{
            this.msg = "ERROR" + err.error;
          }
        }
      );
    }
  }
    dateToString(a){
	  var d = new Date(a).toLocaleDateString();
	  return d;
   }

  ngOnInit(): void {
  }
  selectedHistoryChanged(){
    if(this.currentlySelectedHistoryIndex != "None"){
      this.csh = this.history[this.currentlySelectedHistoryIndex];
      this.hSelected = true;
    }else{
      this.csh = {};
      this.hSelected = false;
    }
  }

  getComponents(){
    this.dMsg = "Loading data..";
    var b = {"user_registration_number":this.userName, "password":this.password};
    this.ds.getPublicAllComponents(b).subscribe( 
        data =>{

          this.components = data;
          console.log("components" , data);
          this.dMsg = "Components data loaded";
        },
        err =>{
          if(err.status == 401){
            this.dMsg = "Username/password error";
          }else{
            this.dMsg = "ERROR" + err.error;
          }
        }
    );
  }
  getLabs(){
    this.lMsg = "Getting lab data...";
    var b = {"user_registration_number":this.userName, "password":this.password};
    this.ds.getPublicAllLabs(b).subscribe(
      data => {
        this.labs = data;
        this.lMsg = "Labs data loaded";
      },
      err =>{
        if(err.status == 401){
          this.lMsg = "Username/password error";
        }else{
          this.lMsg = "Failed to load labs data, try again";
        }
      }
    );
  }
  loadAllData(){
    this.getComponents();
    this.getTransactionsHistory();
    this.getLabs();
  }
  
  

  getCnameById(id){
    var c = "NAME NOT FOUND";
    console.log(id);
    console.log(this.components);
    for(let i = 0; i < this.components.length; i += 1){
      if(id == this.components[i]["_id"]){
        return  this.components[i].name;
      }
    }
    return c;
  }

  // CREATE TRANSACTION STUFF
  componentsFilteredByLab:any;

  currentlySelectedComponentIndex:any = "None";
  cSC:any = {};

  cProp2Disp:string[] = [];
  cart:any = [];
  onSelectedLabChange(){
    if(this.currentlySelectedLabIndex != "None"){
      console.log("Currently selected lab", this.labs[this.currentlySelectedLabIndex]);
      this.componentsFilteredByLab = this.components.filter( e => {return e.lab_id == this.labs[this.currentlySelectedLabIndex]._id});
      console.log(this.componentsFilteredByLab);
    }
  }
  onSelectedComponentChange(){
    if(this.currentlySelectedComponentIndex != "None"){
      this.cSC = this.componentsFilteredByLab[this.currentlySelectedComponentIndex];
      console.log(this.cSC);
      this.cProp2Disp = Object.keys(this.cSC).filter(e => {

        return e != "_id" && e != "_rev" && e != "active_indicator" && e != "lab_id" && e != "template_id";
      });
    }
  }

  addC2Cart(){
     // Check if id of cSC is in cart
     console.log("Cart ids : ",  this.cart.map(a => {return a["_id"];}));
     console.log(this.cSC["_id"] );
     if( ! this.cart.map(a => a["_id"]).includes( this.cSC["_id"] ) ){
       var toCart = JSON.parse(JSON.stringify( this.cSC ));
       toCart.quantity = 0;
       this.cart.push(toCart);
     }
  }

  changeCartItemCount( i, s){
    if(s == '+' && this.cart[i].quantity < this.cart[i].in_inventory_count){
      this.cart[i].quantity += 1;
    }
    else if(s == '-' && this.cart[i].quantity > 0){
      this.cart[i].quantity -= 1;
    }else if( s == 'x'){
      this.cart.splice(i,1);
    }
  }

  tMsg:string = "";
  submitTransaction(){
    // Format cart
    var flag = 1;

    for(let i = 0; i < this.cart.length; i++){
      if(this.cart[i].quantity <= 0){
        flag = 0;
        this.tMsg = "Invalid quantity on a cart item";
      }
    }

    if(this.cart.length == 0){
      flag = 0;
      this.tMsg = "Empty cart";
    }
    if(flag){
      this.tMsg =  "Submitting order...";
      var cartToGo = this.cart.map( a => {
        return {
          "component_id":a["_id"],
          "quantity":a["quantity"]
      };

      });
      var b = {
        "user_registration_number": this.userName,
        "password":this.password,
        "transaction": {
          "type":"lend",
          "cart": cartToGo
        }
      };
      this.ds.postPublicTransactions(b).subscribe(
        data =>{
          console.log("SUccess", data);
          if(!data["status"]){
            this.tMsg = "Transaction unsuccesful " + data["msg"];
          }else{
            this.tMsg = "Transaction Succesfull";
            this.loadAllData();
          }
        },
        err => {
          console.log("ERR",err);
          this.tMsg = "Transaction failed, " + err["error"]["msg"];
        }
      );
    }
  }
}
