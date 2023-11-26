import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!:FormGroup;

  submitted = false;

  @Output() resetPasswordEvt:EventEmitter<void> = new EventEmitter<void>();

  constructor(private formBuilder:FormBuilder) { }

  ngOnInit(): void {
    this.initLoginForm();
  }

  initLoginForm():void {
    this.loginForm = this.formBuilder.group({
      email:[null,[Validators.required, Validators.email]],
      password:[null,[Validators.required]]
    })
  }

  get control() {
    return this.loginForm.controls;
  }

  login(): void{
    this.submitted = true;
    if(this.loginForm.invalid) return;

    console.log(this.loginForm.value)
  }

  recoverPassword() {
    this.resetPasswordEvt.emit();
  }
}
