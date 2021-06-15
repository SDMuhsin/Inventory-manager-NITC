import { Component, OnInit } from '@angular/core';
import {DataService} from '../../../services/data/data.service';
import {MatTableDataSource} from '@angular/material/table';
import { utf8Encode } from '@angular/compiler/src/util';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {

  pages:string[] = ['create','edit'];
  currentPage:string = 'create';
  
  labs:any[];
  currentLabId:string = "None";
  currentComponents:any[] = [];
  currentComponentsDisplayed;
  
  displayedColumnsComponents: string[] = ['name', 'in_inventory_count'];
  displayedColumnsCart: string[] = ['name', 'quantity'];
  displayedColumnsUsers: string[] = ['user_registration_number'];
  
  componentsFilterString:string = "";
  currentFocusedComponent;
  currentFocusedComponentKeys;
  cartToGo:any[] = [];
  cartToDisplay:any[] = [];
  cartToDisplayMatSource;
  
  activeUsers;
  currentLendee:string;
  currentLendeeUserName:string = "NONE";
  currentLender:string;
  
  transactionCreationStatusMessage:string = "";
  transactionApprovalStatusMessage:string = "";
  constructor(private dataService:DataService) {
	  
	  // Get Labs
	  this.dataService.getAllLabs().subscribe(data=>{
		console.log("labs data : ", data );
		this.labs = data;
	  },err=>{console.log(err);});
	  
	  // Get users
	  this.dataService.getActiveUsers().subscribe(data=>{
		  console.log("user data :",data);
		  this.activeUsers = new MatTableDataSource(data);
	  });
	  
	  //Get current lender
  }
  
  findUserNameFromId(id:string){
	  for(let i = 0; i < this.activeUsers.length; i++){
		  if(id == this.activeUsers._id){
			  console.log("ACTIVE USERS", this.activeUsers);
		  }
	  }
  }
  changeCurrentLab(){
	  if(this.currentLabId != "None"){
		  console.log("[changeCurrentLab()] this.currentLab",this.currentLabId);
		  //console.log(this.currentLab);
		  this.dataService.getLabInventory(this.currentLabId).subscribe(data=>{
			console.log("components data : ", data );
			this.currentComponents = data;
			this.currentComponentsDisplayed = new MatTableDataSource(data);
		  },err=>{console.log(err);});
	  }
  }
  
  applyComponentsFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.currentComponentsDisplayed.filter = filterValue.trim().toLowerCase();
  }
  applyUsersFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.activeUsers.filter = filterValue.trim().toLowerCase();
  }
  
  changeFocus(a){
	  
	  let flag = 0;
	  //Check if item is already in cart
	  for(let i = 0; i < this.cartToDisplay.length; i+=1){
		  if(this.cartToDisplay[i]._id == a._id){
			  flag = 1;
			  break;
			  console.log("Item already in cart");
		  }
	  }
	  
	  if(!flag){
		  // Add to cart(s)

		  a.quantity = 0;
		  this.cartToDisplay.push(a);


		  this.cartToDisplayMatSource = new MatTableDataSource(this.cartToDisplay);
		  console.log("cart",this.cartToDisplay);
	  }
	  	  this.currentFocusedComponent = a;
		  this.currentFocusedComponentKeys = Object.keys(a); // Details to display
		  
		  console.log(["_id","_rev","lab_id","template_id"].includes(this.currentFocusedComponentKeys[2]));
		  this.currentFocusedComponentKeys = this.currentFocusedComponentKeys.filter((e)=>!["_id","_rev","lab_id","template_id"].includes(e));
		  console.log(this.currentFocusedComponentKeys);
  }
  ngOnInit(): void {
  }
  
  changeCartQuantity(cartIndex,oprn){
	  console.log("Cart index",cartIndex);
	  if(oprn == "+" && this.cartToDisplay[cartIndex].quantity < this.cartToDisplay[cartIndex].in_inventory_count){
		  this.cartToDisplay[cartIndex].quantity += 1;
	  }else if(oprn == "-" && this.cartToDisplay[cartIndex].quantity > 0){
		  this.cartToDisplay[cartIndex].quantity -= 1;
	  }
  }
  removeCartItem(cartIndex){
	  this.cartToDisplay.splice(cartIndex,cartIndex+1);
	  console.log("New cart",this.cartToDisplay);
	  this.cartToDisplayMatSource = new MatTableDataSource(this.cartToDisplay);
  }
  
  changeLendee(row){
	  console.log("Changing Lendee", row);
	  this.currentLendee = row._id;
	  this.currentLendeeUserName = row.user_registration_number;
  }
  
  createTransaction(){
	this.transactionCreationStatusMessage = "Creating transaction ....";
	if(!this.currentLendee || this.currentLendee == 'NONE'){
		this.transactionCreationStatusMessage = "CHOOSE LENDEE";
	}else{
		
		const cartToGo = this.cartToDisplay.map( function(e) {return {"component_id":e._id,"quantity":e.quantity};});
		const transaction = {
			"type":"LEND",
			"customer":this.currentLendee,
			"cart":cartToGo
		};
		this.dataService.postTransaction(transaction).subscribe(data=>{
			console.log("Transaction sent, response", data);
			if(data.status){
				this.transactionCreationStatusMessage = "Transaction Success";
				this.changeEditMode();
			}
		}); 
	}
  }
  
  //Utility
  dateToString(a:string){
	  var d = new Date(a).toLocaleDateString();
	  return d;
  }
  /*
		Exclusively edit transaction functions and variables
		TODO
		1. Make switchcase tabs : DONE 03/01/2021
		2. Get Transaction data : DONE 03/01/2021
		3. Display transasactions ( date, customer ) : DONE 04/01/2021
		4. Focus a transaction  : DONE 11/01/2021
		5. Modify edit transaction cart : DONE 11/01/2021
		6. Create transaction + approve transaction : DONE 13/01/2021
		7. Deny transaction : DONE 14/01/2021
		8. Close transaction : DONE 19/01/2021
		
		
  */
  editModes:string[] = ['PENDING','APPROVED','DENIED','CLOSED'];
  currentEditMode:string = "-1";
  currentTransactions = [];
  currentTransactionsDisplayed;
  displayedColumnsTransactions:string[] = ["openedDate","customerName"];
  editErrorMessage:string = "";
  
  currentEditFocus;
  currentEditCart;
  currentEditReturnCart;
  currentEditCartIdsBodyObject;
  currentEditCartToDisplay;
  currentEditReturnCartToDisplay;
  
  currentEditCloseTransactionsFocus;
  currentEditCloseTransactionsFocusReturnCart;
  currentEditCloseTransactionsFocusReturnCartMatSource;
  closeCartDisplayedColumns = ['name','quantity','returned'];
  editCloseReturnTypes:string[] = ["FULL","PARTIAL","FAILED"];
  currentEditCloseReturnType:string = "FULL";

  changeEditMode(){
		//this.refreshCarts();
	  	// Print the current edit mode
		console.log(this.currentEditMode);

		// Get users
		this.dataService.getActiveUsers().subscribe(data=>{
		  console.log("user data :",data);
		  this.activeUsers = data;
		  this.dataService.getTransactions( this.currentEditMode.toLowerCase() + "_transactions").subscribe( 
			data =>{
			this.currentTransactions = data["rows"];
			console.log(this.currentTransactions.length,this.activeUsers.length);
			this.currentTransactions = this.currentTransactions.map(function(e){ console.log(e.value); e.value.openedDate = e.value.dates.opened;return e.value;} )
			for(let j = 0; j < this.currentTransactions.length; j += 1){
				for(let i = 0; i < this.activeUsers.length; i += 1){
					console.log(this.activeUsers[i]._id , this.currentTransactions[j].customer);
					if(this.activeUsers[i]._id == this.currentTransactions[j].customer){
						this.currentTransactions[j].customerName = this.activeUsers[i].user_registration_number;
					}
				}
			}
			this.currentTransactionsDisplayed = new MatTableDataSource(this.currentTransactions);
			console.log(this.currentTransactions);
			
			//Refresh carts 
			this.refreshCarts();

			
	  	}, err => {this.editErrorMessage = "Something went wrong, couldn't load";});
		});		
  }
  
  refreshCarts(){
	this.currentEditFocus = {};
	this.currentEditCart = {};
	this.currentEditReturnCart = {};
	this.currentEditCartToDisplay = new MatTableDataSource(this.currentEditCart);
	this.currentEditReturnCartToDisplay = new MatTableDataSource(this.currentEditReturnCart);
	this.currentEditCloseReturnType = "";
	this.currentEditCloseTransactionsFocusReturnCart = [];
	this.currentEditCloseTransactionsFocusReturnCartMatSource = new MatTableDataSource(this.currentEditCloseTransactionsFocusReturnCart);
	
  }
  changeEditFocus(rd = {"_id":'NONE'}){
	  //console.log(r);
	  //this.currentEditFocus = rd;  Must take from this.currentTransactions
	  var r:any = {};
	  for(let i = 0; i < this.currentTransactions.length; i+=1){
		  if(this.currentTransactions[i]._id == rd._id){
			  r = this.currentTransactions[i];
			  console.log("FOUND TRANSACTION");
			  console.log(this.currentTransactions[i].cart);
		  }
	  }
	  this.currentEditFocus = Object.assign({}, r);
	  this.currentEditCart = Object.assign({}, r).cart;
	  this.currentEditReturnCart = Object.assign({}, r).cart;
	  
	  console.log("[changeEditFocus(rd)] this.currentEditFocus,this.currentEditReturnCart:" ,this.currentEditFocus,this.currentEditReturnCart);
	  console.log("Current cart",r.cart);
	  this.currentEditCartIdsBodyObject = {"component_ids": r.cart.map(e=>{ return e.component_id; }) };
	  console.log("ids obj", this.currentEditCartIdsBodyObject);
	  
	  var items;
	  this.dataService.getComponentsByIds(this.currentEditCartIdsBodyObject).subscribe(data=>{console.log("components",data);items = data;
	  
	  // For each item in cart, get details of those components from inventory and update in_inventory_count, name, 
	  
	  for(let i = 0; i < this.currentEditCart.length; i = i + 1){
		  for(let j = 0; j < items.length; j+=1){
			  if(items[j]._id == this.currentEditCart[i].component_id){
				  this.currentEditCart[i].in_inventory_count = items[j].in_inventory_count;
				  this.currentEditCart[i].name = items[j].name;
				  this.currentEditReturnCart[i].name = items[j].name;
			  }
		  } 
	  }
	  console.log(this.currentEditCart);
	  this.currentEditCartToDisplay = new MatTableDataSource(this.currentEditCart);
	  this.currentEditReturnCartToDisplay = new MatTableDataSource(this.currentEditReturnCart);
	  
	  //If APPROVED, then we need one DEEP copy of focus
	  if(this.currentEditMode == 'APPROVED'){
		  this.currentEditCloseReturnType = "FULL";
		  this.currentEditCloseTransactionsFocusReturnCart = this.currentEditFocus.cart.map( x => Object.assign({}, x));
		  
		  this.currentEditCloseTransactionsFocusReturnCart.forEach( x => {x.returned = x.quantity; return x;});
		  console.log("[changeEditFocus][return cart] " , this.currentEditCloseTransactionsFocusReturnCart);
		  this.currentEditCloseTransactionsFocusReturnCartMatSource = new MatTableDataSource(this.currentEditCloseTransactionsFocusReturnCart);
		  
	  }}
	  );
  }
  changeEditCartQuantity(cartIndex,oprn){
	  console.log("Cart index",cartIndex,this.currentEditCart[cartIndex]);
	  if(oprn == "+"  &&  this.currentEditCart[cartIndex].quantity < this.currentEditCart[cartIndex].in_inventory_count){ // this.currentEditCart[cartIndex].quantity < this.cartToDisplay[cartIndex].in_inventory_count
		  
		  this.currentEditCart[cartIndex].quantity += 1;
		  this.currentEditCartToDisplay = new MatTableDataSource(this.currentEditCart);
		  
	  }else if(oprn == "-" && this.currentEditCart[cartIndex].quantity > 0){//&& this.cartToDisplay[cartIndex].quantity > 0){
		  this.currentEditCart[cartIndex].quantity -= 1;
	  }
  }
  changeEditReturnCartQuantity(cartIndex,oprn){
	  console.log("[Change edit return cart]");
	  console.log("[Change edit return cart] r,q,returned < quantity",this.currentEditCloseTransactionsFocusReturnCart[cartIndex].returned ,this.currentEditCloseTransactionsFocusReturnCart[cartIndex].quantity ,this.currentEditCloseTransactionsFocusReturnCart[cartIndex].returned < this.currentEditCloseTransactionsFocusReturnCart[cartIndex].quantity );
	  if(oprn == "+"  &&  this.currentEditCloseTransactionsFocusReturnCart[cartIndex].returned < this.currentEditCloseTransactionsFocusReturnCart[cartIndex].quantity ){ // this.currentEditCart[cartIndex].quantity < this.cartToDisplay[cartIndex].in_inventory_count
		  console.log("[Change edit return cart] [+]");
		  
		  
		  this.currentEditCloseTransactionsFocusReturnCart[cartIndex].returned += 1;
		  
		  console.log("After, reverse(return, true)", this.currentEditCloseTransactionsFocusReturnCart[cartIndex].returned, this.currentEditCloseTransactionsFocusReturnCart[cartIndex].quantity);
		  
		  
		  
	  }else if(oprn == "-" && this.currentEditCloseTransactionsFocusReturnCart[cartIndex].returned > 0){//&& this.cartToDisplay[cartIndex].quantity > 0){
		  console.log("[Change edit return cart] [-]",);
		  this.currentEditCloseTransactionsFocusReturnCart[cartIndex].returned -= 1;
		  console.log("[change dit return cart]", this.currentEditCloseTransactionsFocusReturnCart[cartIndex].returned);
	  }
	  this.currentEditCloseTransactionsFocusReturnCartMatSource = new MatTableDataSource(this.currentEditCloseTransactionsFocusReturnCart);
	  //console.log("Current edit focus", this.currentEditFocus);
	  
	  //Identify the return type
	  this.currentEditCloseReturnType = "FULL";
	  
	  var flag1 = 1; // 1 => check if partial 
	  var flag2 = 1; // 1 at the end of loop => FAILED_RETURN
	  //If all the returns are 0, then type is FAILED return
	  for(let i = 0; i < this.currentEditCloseTransactionsFocusReturnCart.length; i+=1){
			console.log("RETURNED : ",this.currentEditCloseTransactionsFocusReturnCart[0].returned);
			if( flag1 && this.currentEditCloseTransactionsFocusReturnCart[i].returned != this.currentEditCloseTransactionsFocusReturnCart[i].quantity ){
			  flag1 = 0;// No need to check if PARTIAL return anymore
			  this.currentEditCloseReturnType = "PARTIAL";
		  }
		  if( this.currentEditCloseTransactionsFocusReturnCart[i].returned != 0){
			  flag2 = 0;
			  console.log("NOT FAILED");
			  
		  }
	  }
	  if(flag2){this.currentEditCloseReturnType = "FAILED";}
	  
  }
  
  removeEditCartItem(cartIndex){
	  this.currentEditCart.splice(cartIndex,cartIndex+1);
	  
	  this.currentEditCartToDisplay = new MatTableDataSource(this.currentEditCart);
  }  
  removeEditReturnCartItem(cartIndex){
	  this.currentEditReturnCart.splice(cartIndex,cartIndex+1);
	  
	  this.currentEditReturnCartToDisplay = new MatTableDataSource(this.currentEditReturnCart);
  }  
  
  approveTransactionMessage:string = "";
  approveTransaction(approval_status){
	this.approveTransactionMessage = "IDLE";
	  console.log(this.currentEditFocus._id,this.currentEditFocus._rev);
	  this.dataService.approveTransaction( {"_id":this.currentEditFocus._id,"_rev":this.currentEditFocus._rev,"approval_status":approval_status}).subscribe(
		  data=>{
		  console.log(data);
		  if(data["status"]){
			this.approveTransactionMessage = "Transaction success";
		  }else{
			this.approveTransactionMessage = "Transaction failed";
		  }

		  this.changeEditMode();
	},
	err =>{
		console.log(err);
		this.approveTransactionMessage = "Transaction failed";
		this.changeEditMode();
	}
	);
  }


  closeTransaction(){
	this.approveTransactionMessage = "IDLE";
	  var o = {"transaction_id":this.currentEditFocus._id, 
	  "return_cart": this.currentEditCloseTransactionsFocusReturnCart.map( e=> {return {"_id":e._id, "quantity" : e.returned};})
	  };
	  this.dataService.closeTransaction(o).subscribe( data=>{
		  console.log(data);
		  if(data["status"]){
		  	this.approveTransactionMessage = "Transaction success";
		  }else{
			this.approveTransactionMessage = "Transaction failed";
		  }
		  this.changeEditMode();
		  
	},err=>{
		console.log(err);
		this.approveTransactionMessage = "Failed to close transaction";
		this.changeEditMode();
	});
  }
  
}
