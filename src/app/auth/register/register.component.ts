import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm!:FormGroup;
  isSubmitted:boolean = false;

  constructor(private formBuilder:FormBuilder) { }

  ngOnInit(): void {
    this.initRegisterForm();
  }

  initRegisterForm(): void {
    this.registerForm = this.formBuilder.group({
      name:[null,[Validators.required]],
      phoneNumber:[null,[Validators.required,Validators.minLength(10),Validators.pattern('[+0-9]')]],
      email:[null,[Validators.required, Validators.email]],
      password:[null,Validators.required],
      confirmPassword:[null,Validators.required],
    });

    this.registerForm.controls['confirmPassword'].addValidators(this.createCompareValidator(
      this.registerForm.controls['password'],
      this.registerForm.controls['confirmPassword']
    ))
  }

  createCompareValidator(controlOne: AbstractControl, controlTwo: AbstractControl) {
    return () => {
      if (controlOne.value !== controlTwo.value)
        return { match_error: 'Value does not match' };
      return null;
    };

  }

  get control() {
    return this.registerForm.controls;
  }

  register(){
    this.isSubmitted = true;
    console.log("Register evt reached");

    if(this.registerForm.invalid) return;

    console.log(this.registerForm.value);
  }

}
