import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  displayLogin:boolean = true;
  displayPasswordSection:boolean = false;
  appTitle:string = "Quikk Api Money App";

  constructor() { }

  ngOnInit(): void {
  }

  showLogin() {
    this.displayLogin = true;
    this.displayPasswordSection = false;
  }

  showRegister() {
    this.displayLogin = false;
    this.displayPasswordSection = false;
  }

  showResetPassword() {
    this.displayPasswordSection = true;
  }



}
