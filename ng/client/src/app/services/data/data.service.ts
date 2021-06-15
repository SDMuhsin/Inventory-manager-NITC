import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders,HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
 
withCredentials: true, 
//observe: 'response' as 'response'
};  

@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  getUserProfileUrl:string = 'http://localhost:9876/restricted/Student/profile';
  getActiveUsersUrl:string = 'http://localhost:9876/guarded/accounts/users/all/active';
  getAllLabsUrl:string = 'http://localhost:9876/restricted/Student/labs';
  getLabInventoryUrlBase:string = 'http://localhost:9876/restricted/Student/labs/inventory/';
  getComponentsByIdsUrl:string = 'http://localhost:9876/restricted/Student/labs/inventory/components/by_ids';
  postComponentTemplateUrl:string = 'http://localhost:9876/restricted/Student/labs/template';
  postComponentUrl:string = 'http://localhost:9876/restricted/Student/labs/inventory/component';
  getTemplatesUrl:string = 'http://localhost:9876/restricted/Student/labs/template/all';

  postLabUrl:string = "http://localhost:9876/restricted/Admin/labs/create";
  deleteLabUrl:string = "http://localhost:9876/restricted/Admin/labs/delete";

  putComponentUrl:string = 'http://localhost:9876/restricted/Student/labs/inventory/component';
  deleteComponentUrl:string = 'http://localhost:9876/restricted/Student/labs/inventory/component/delete';
  
  postTransactionUrl:string = 'http://localhost:9876/guarded/transactions/create2';
  approveTransactionUrl:string = 'http://localhost:9876/guarded/transactions/approve';
  closeTransactionUrl:string = 'http://localhost:9876/guarded/transactions/close';
  getTransactionsUrl:string =  'http://localhost:9876/guarded/transactions/view/'; // URL BASE
  
  getAccountsByStatRoleUrl: string = 'http://localhost:9876/guarded/accounts/users/'; // URL BASE
  approveAccountsUrl: string = 'http://localhost:9876/guarded/accounts/users/approve'; 
  deactivateAccountsUrl: string = 'http://localhost:9876/guarded/accounts/users/deactivate'; 
  
  getDBsUrl:string = "http://localhost:9876/guarded/dbs/check";
  putDBsUrl:string = "http://localhost:9876/guarded/dbs/make/";
  constructor(private http:HttpClient) {
	  
  }
  getProfile():Observable<any>{
	  return this.http.get(this.getUserProfileUrl,{withCredentials:true});
  }  
  getActiveUsers():Observable<any>{
	  return this.http.get(this.getActiveUsersUrl,{withCredentials:true});
  }
  getAllLabs():Observable<any>{
	  return this.http.get(this.getAllLabsUrl,{withCredentials:true});
  }
  
  getLabInventory(labId:string):Observable<any>{
	  return this.http.get(this.getLabInventoryUrlBase + labId,{withCredentials:true});
  }
  getComponentsByIds(obj):Observable<any>{
	  return this.http.post(this.getComponentsByIdsUrl, obj, {withCredentials:true} );
  }
  postComponentTemplate(obj:any){
	   return this.http.post(this.postComponentTemplateUrl,obj,{withCredentials:true});
  }
  
  postComponent(obj:any){
    console.log("POSTING COMPONENT");
	  return this.http.post(this.postComponentUrl,obj,{withCredentials:true});
  }
  
  getTemplates(){
	  return this.http.get(this.getTemplatesUrl,{withCredentials:true});
  }
  putComponent(obj:any){
	  return this.http.put(this.putComponentUrl,obj,{withCredentials:true});
  }
  deleteComponent(obj:any){
	  return this.http.post(this.deleteComponentUrl,obj,{withCredentials:true});
  }
  
  postTransaction(obj:any):Observable<any>{
	  return this.http.post(this.postTransactionUrl,obj,{withCredentials:true});
  }
  getTransactions(approvalStatus){
	  return this.http.get(this.getTransactionsUrl + approvalStatus,{withCredentials:true});
  }
  approveTransaction(ob){
	  return this.http.post(this.approveTransactionUrl, ob,{withCredentials:true});
  }
  closeTransaction(o){
	  return this.http.post(this.closeTransactionUrl,o,{withCredentials:true});
  }
  
  getAccounts(stat,role){
	  return this.http.get(this.getAccountsByStatRoleUrl + stat + '/' + role, {withCredentials:true});
  }
  approveAccounts(o){
	  return this.http.post(this.approveAccountsUrl,o,{withCredentials:true});
  }
  deactivateAccounts(o){
	  return this.http.post(this.deactivateAccountsUrl,o,{withCredentials:true});
  }

  getDBs(){
    return this.http.get(this.getDBsUrl, {withCredentials:true} );
  }
  
  putDb(dbname){
    return this.http.put(this.putDBsUrl + dbname, {},{withCredentials:true} );
  }

  postLab(o){
    return this.http.post(this.postLabUrl, o, {withCredentials:true});
  }
  deleteLab(o){
    return this.http.post(this.deleteLabUrl, o, {withCredentials:true});
  }
}