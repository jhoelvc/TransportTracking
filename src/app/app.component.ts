import { Component } from '@angular/core';
import { DecodeToken, Credential } from './interfaces';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';

import * as jwt_decode from 'jwt-decode';
import { MatDialog } from '@angular/material';
import { ChangePasswordComponent } from './dialogs/changePassword/changePassword.component';
import { TrackService } from './services/track.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public hideElement = false;
  route: string;
  credential: Credential = {
    alias: "", 
    password: "",
    name: "",
    contactPhoneNumber: "",
    providerCode : 0,
    userRoleCode : 0
  };

  constructor(private router: Router, public dialog: MatDialog, private track: TrackService) { 
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url == '/login') {
          this.hideElement = true;
          this.getStatus() ? this.router.navigate(['']) : this.router.navigate(['login']);
        } else if (event.url != '/login') {
          this.hideElement = false;
          this.getStatus() ? null : this.router.navigate(['login']);
        }
      }
      else if (event instanceof NavigationStart)
      {
        this.route = event.url;
      }
    });
  }

  public isLogged;
  jwtDecoded: DecodeToken;
  
  ngOnInit() {
    this.jwtDecoded = jwt_decode(localStorage.getItem("accessToken"));
  }

  onLogout(): void {
    this.track.messages.complete();
    localStorage.removeItem("accessToken");
    this.router.navigate(['login']);
  }

  getUserRole() {
    //this.jwtDecoded = jwt_decode(localStorage.getItem("accessToken"));
    return this.jwtDecoded.auth.userRoleCode;
  }

  getStatus() {
    if (localStorage.getItem("accessToken")) {
      return true;
    }
    else {
      return false;
    }
  }

  changePassword() {
    const dialogRef = this.dialog.open(ChangePasswordComponent, { });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.onLogout();
        //this.refreshTable();
      }
    });
  }

  onCheckUser() {
    const idToken = localStorage.getItem("accessToken");
    if (idToken) {
      this.isLogged = true;
    } else {
      this.isLogged = false;
    }
    console.log(this.isLogged);
  }
}
