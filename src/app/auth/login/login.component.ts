import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../services/user.service";
import {ToastrService} from "ngx-toastr";
import {User} from "../../models/user";
import {finalize, Subject, takeUntil} from "rxjs";
import {Router} from "@angular/router";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit,OnDestroy {

  loginForm!:FormGroup;

  submitted = false;
  isSubmitting = false;

  destroy$:Subject<boolean> = new Subject<boolean>();

  @Output() resetPasswordEvt:EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private formBuilder:FormBuilder,
    private userService:UserService,
    private toastr:ToastrService,
    private router:Router) { }

  ngOnInit(): void {
    this.initLoginForm();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
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

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.isSubmitting = true;

    this.userService.loginUser(email,password)
      .pipe(
        takeUntil(this.destroy$),
        finalize(()=>{this.isSubmitting = false})
      )
      .subscribe({
        next:((users:Array<User>)=>{
          //No user found
          if(users.length== 0){
            this.toastr.warning("Invalid username or password", "Invalid Credentials")
            return;
          }

          //user found
          const user:User = users[0];

          //remove password
          delete user.password;

          //make token
          const token = JSON.stringify(user);


          //store in localStorage
          localStorage.setItem(environment.userToken,token);

          //redirect to portal
          this.router.navigate(['/portal'])


        }),
        error:(()=>{this.userService.error();}),
      })

  }

  recoverPassword() {
    this.resetPasswordEvt.emit();
  }
}
