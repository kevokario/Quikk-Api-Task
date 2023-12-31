import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User} from "../../models/user";
import {ToastrService} from "ngx-toastr";
import {UserService} from "../../services/user.service";
import {finalize, Subject, takeUntil} from "rxjs";
import {AccountService} from "../../services/account.service";
import {Account} from "../../models/account";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

  registerForm!:FormGroup;
  isSubmitted:boolean = false;
  isRegistering = false;

  destroy$:Subject<boolean> = new Subject();

  @Output() registerEvt:EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private formBuilder:FormBuilder,
    private toastr:ToastrService,
    private userService:UserService,
    private accountService:AccountService
    ) { }

  ngOnInit(): void {
    this.initRegisterForm();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.subscribe();
  }

  initRegisterForm(): void {
    this.registerForm = this.formBuilder.group({
      name:[null,[Validators.required]],
      phoneNumber:[null,[Validators.required,
        Validators.pattern(/^[0-9]\d*$/),
        Validators.minLength(10)
      ]],
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
    if(this.registerForm.invalid) return;

    const formData = this.registerForm.value;

    const newUser:User = {
      name:formData.name,
      email:formData.email,
      phone:formData.phoneNumber,
      password:formData.password
    }

    this.checkUserEmail(newUser);
  }

  checkUserEmail(newUser:User){
    const email = newUser.email;

    this.isRegistering = true;
    this.userService.getUserByEmail(email)
      .pipe(
        takeUntil(this.destroy$),
        finalize(()=>{this.isRegistering = false;})
      ).subscribe(
      {
        next:(response:Array<User>)=>{
          if(response.length > 0) {
            this.toastr.warning("There is an account with that email address!", "Email address Taken")
            return;
          }
          this.registerUser(newUser)

        },
        error:()=>{
          this.userService.error();
        },
      }
    )
  }

  registerUser(newUser:User){
    this.isRegistering = true;

    this.userService.registerUser(newUser)
      .pipe(
        takeUntil(this.destroy$),
        finalize(()=>{this.isRegistering = false;})
      ).subscribe({
      next:((user)=>{

        this.getRegisteredUser(newUser);
      }),
      error:(()=>{
       this.userService.error();
      }),
    });
  }


  getRegisteredUser(newUser:User){
    const email = newUser.email;
    this.userService.getUserByEmail(email).pipe(takeUntil(this.destroy$)).subscribe({
      next:((user :Array<User>)=>{
        if(user.length>0){
          this.registerAccount(user[0]);
        }
      }), error:(()=>{
        this.userService.error();
      })
    })
  }

  registerAccount(newUser:User){
    const newUserAccount:Account = {
      userId:newUser.id,
      amount:0,
    };

    this.accountService.initUserAccount(newUserAccount).pipe(takeUntil(this.destroy$)).subscribe({
      next:(res=>{
        this.toastr.success("Account Created successfully, Login into your new account!","Registration Successful");
        this.registerEvt.emit();
      }), error:(()=>{
        this.userService.error();
      })
    });
  }

}
