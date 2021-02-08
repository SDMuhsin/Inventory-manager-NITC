import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/unrestricted/home/home.component';
import { StartPageComponent } from './components/startpage/startpage.component';
import {ProfileComponent} from './components/restricted/profile/profile.component';
import {LabsListComponent} from './components/restricted/labs_list/labs-list/labs-list.component';
import {LabInventoryComponent} from './components/restricted/lab-inventory/lab-inventory.component';
import {TemplateGeneratorComponent} from './components/restricted/template-generator/template-generator.component';
import {ComponentCreationComponent} from './components/restricted/component-creation/component-creation.component';
import {ComponentEditorComponent} from './components/restricted/comonent-editor/comonent-editor.component';
import {LinksPageComponent} from './components/restricted/links-page/links-page.component';
import {TransactionsComponent} from './components/restricted/transactions/transactions.component';
import { AccountsManagerComponent } from './components/restricted/accounts-manager/accounts-manager.component';
import {AuthGuardService} from './services/guard/auth-guard.service';
const routes: Routes = [
	{path:'', component : HomeComponent},
	{path:'restricted/profile',component : ProfileComponent},
	{path:'restricted/labs',component : LabsListComponent,canActivate: [AuthGuardService], // accessRequired = verificationRequired
        data: {roles: ['Student','Staff','Admin'],accessRequired:true}},
	{path:'restricted/lab/inventory/:labid',component : LabInventoryComponent,canActivate: [AuthGuardService],
        data: {roles: ['Student','Staff','Admin'],accessRequired:true}},
	{path:'restricted/template/generator',component : TemplateGeneratorComponent,canActivate: [AuthGuardService],
        data: {roles: ['Admin'],accessRequired:true}},
	{path:'restricted/component/creation',component : ComponentCreationComponent,canActivate: [AuthGuardService],
        data: {roles: ['Staff','Admin'],accessRequired:true}},
	{path:'restricted/component/editor',component : ComponentEditorComponent,canActivate: [AuthGuardService],
        data: {roles: ['Staff','Admin'],accessRequired:true}},
	{path:'restricted/transactions',component : TransactionsComponent,canActivate: [AuthGuardService],
        data: {roles: ['Staff','Admin'],accessRequired:true}},
	{path:'restricted/accounts',component : AccountsManagerComponent,canActivate: [AuthGuardService],
        data: {roles: ['Admin'],accessRequired:true}},
	
	{path:'restricted/links-page',component : LinksPageComponent,canActivate: [AuthGuardService],
        data: {roles: [],accessRequired:true}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
