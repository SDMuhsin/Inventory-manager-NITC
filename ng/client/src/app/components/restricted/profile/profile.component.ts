import { Component, OnInit } from '@angular/core';
import { UserProfile } from '../../../models/user/user-profile.model';
import { DataService } from '../../../services/data/data.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  
  user:UserProfile;
  constructor(private dataService:DataService) {
	this.user = new UserProfile();
	this.dataService.getProfile().subscribe( (data:UserProfile)=>{this.user = data;console.log(this.user);});
  }

  ngOnInit(): void {
  }

}
