import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders,HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import { SessionManagementService } from '../session/sessionmanagement.service';
import ipData from "../../../assets/backend-ip.json";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true, 
};  

@Injectable({
  providedIn: 'root'
})
export class DataService {

  li:string = ipData["ip"]; //"http://localhost:9876/";//"http://192.168.18.4:9876/"; // local ip
  
  getUserProfileUrl:string = this.li + 'restricted/Student/profile';
  getActiveUsersUrl:string = this.li + 'guarded/accounts/users/all/active';
  getAllLabsUrl:string = this.li + 'restricted/Student/labs';
  getLabInventoryUrlBase:string = this.li + 'restricted/Student/labs/inventory/';
  getComponentsByIdsUrl:string = this.li + 'restricted/Student/labs/inventory/components/by_ids';
  postComponentTemplateUrl:string = this.li + 'restricted/Student/labs/template';
  postComponentUrl:string = this.li + 'restricted/Student/labs/inventory/component';
  getTemplatesUrl:string = this.li + 'restricted/Student/labs/template/all';

  postLabUrl:string = this.li + 'restricted/Admin/labs/create';
  deleteLabUrl:string = this.li + 'restricted/Admin/labs/delete';

  putComponentUrl:string = this.li + 'restricted/Student/labs/inventory/component';
  deleteComponentUrl:string = this.li + 'restricted/Student/labs/inventory/component/delete';
  
  postTransactionUrl:string = this.li + 'guarded/transactions/create2';
  approveTransactionUrl:string = this.li + 'guarded/transactions/approve';
  closeTransactionUrl:string = this.li + 'guarded/transactions/close';
  getTransactionsUrl:string =  this.li + 'guarded/transactions/view/'; // URL BASE
  
  getAccountsByStatRoleUrl: string = this.li + 'guarded/accounts/users/'; // URL BASE
  approveAccountsUrl: string = this.li + 'guarded/accounts/users/approve'; 
  deactivateAccountsUrl: string = this.li + 'guarded/accounts/users/deactivate'; 
  
  getDBsUrl:string = this.li + 'guarded/dbs/check';
  putDBsUrl:string = this.li + 'guarded/dbs/make/';

  getPublicTransactionsUrl:string = this.li + 'public/transactions/';
  getAllComponentsPublicUrl:string = this.li + 'public/inventory/all';
  getAllLabsPublicUrl:string = this.li + 'public/labs/all';
  postPublicTransactionsUrl:string = this.li + 'public/create/transactions';
  constructor(private http:HttpClient, private sesh:SessionManagementService) {
	  this.li = ipData["ip"];
    console.log("Setting backend IP : ", this.li);
  }
  getProfile():Observable<any>{
    console.log("WINDOW : ", window.location.hostname);
    console.log("GETTING PROFILE, first getting token ", this.sesh.getToken(), this.sesh.getVerified(), this.sesh.getAccessLevel());
    let s:string = "token=" + this.sesh.getToken() + "; access-level=" + this.sesh.getAccessLevel() + '; verified=' + this.sesh.getVerified();
    console.log(s);
    console.log('Headers ', httpOptions.headers);
    const httpOptions2 = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Cookie':s }),
      withCredentials: true, 
    };  
    console.log('Headers 2 : ', httpOptions.headers);
	  return this.http.get(this.getUserProfileUrl,httpOptions);
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

  getPublicTransactions(b){
    return this.http.post(this.getPublicTransactionsUrl, b,{withCredentials:true});
  }
  getPublicAllComponents(b){
    return this.http.post(this.getAllComponentsPublicUrl, b, {withCredentials:true});
  }
  getPublicAllLabs(b){
    return this.http.post(this.getAllLabsPublicUrl, b, {withCredentials:true});
  }
  postPublicTransactions(b){
    return this.http.post(this.postPublicTransactionsUrl, b, {withCredentials:true});
  }
}