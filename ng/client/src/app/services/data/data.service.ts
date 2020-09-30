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
  getAllLabsUrl:string = 'http://localhost:9876/restricted/Student/labs';
  getLabInventoryUrlBase:string = 'http://localhost:9876/restricted/Student/labs/inventory/';
  postComponentTemplateUrl:string = 'http://localhost:9876/restricted/Student/labs/template';
  postComponentUrl:string = 'http://localhost:9876/restricted/Student/labs/inventory/component';
  getTemplatesUrl:string = 'http://localhost:9876/restricted/Student/labs/template/all';
  
  putComponentUrl:string = 'http://localhost:9876/restricted/Student/labs/inventory/component';
  deleteComponentUrl:string = 'http://localhost:9876/restricted/Student/labs/inventory/component/delete';
  constructor(private http:HttpClient) {
	  
  }
  getProfile():Observable<any>{
	  return this.http.get(this.getUserProfileUrl,{withCredentials:true});
  }  
  
  getAllLabs():Observable<any>{
	  return this.http.get(this.getAllLabsUrl,{withCredentials:true});
  }
  
  getLabInventory(labId:string):Observable<any>{
	  return this.http.get(this.getLabInventoryUrlBase + labId,{withCredentials:true});
  }
  
  postComponentTemplate(obj:any){
	   return this.http.post(this.postComponentTemplateUrl,obj,{withCredentials:true});
  }
  
  postComponent(obj:any){
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
}
