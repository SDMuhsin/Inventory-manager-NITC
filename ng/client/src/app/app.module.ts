import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {AuthenticationService} from './services/authentication/authentication.service';
import {SessionManagementService} from './services/session/sessionmanagement.service';
import {AuthGuardService} from './services/guard/auth-guard.service';
//Material modules
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import {MatTableModule} from '@angular/material/table';

import { HomeComponent } from './components/unrestricted/home/home.component';
import { RegisterComponent } from './components/unrestricted/register/register.component';
import { LoginComponent } from './components/unrestricted/login/login.component';
import { StartPageComponent } from './components/startpage/startpage.component';
import { ProfileComponent } from './components/restricted/profile/profile.component';
import { LabsListComponent } from './components/restricted/labs_list/labs-list/labs-list.component';
import { LabInventoryComponent } from './components/restricted/lab-inventory/lab-inventory.component';
import { TemplateGeneratorComponent } from './components/restricted/template-generator/template-generator.component';
import { ComponentCreationComponent } from './components/restricted/component-creation/component-creation.component';
import { ComponentEditorComponent } from './components/restricted/comonent-editor/comonent-editor.component';
import { LinksPageComponent } from './components/restricted/links-page/links-page.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    StartPageComponent,
    ProfileComponent,
    LabsListComponent,
    LabInventoryComponent,
    TemplateGeneratorComponent,
    ComponentCreationComponent,
    ComponentEditorComponent,
    LinksPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
	FormsModule,
	HttpClientModule,
	//Observable,
	
	MatToolbarModule,
	MatIconModule,
	MatTabsModule,
	MatFormFieldModule,
	MatSelectModule,
	MatInputModule,
	MatButtonModule,
	MatListModule,
	MatTableModule,
	
  ],
  providers: [AuthenticationService,SessionManagementService,CookieService,AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
