import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../services/user.service";
import {finalize, Subject, takeUntil} from "rxjs";
import {User} from "../../models/user";
import {environment} from "../../../environments/environment";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  destroy$:Subject<boolean> = new Subject<boolean>();
  currentUser?:User;
  profileForm!:FormGroup;

  showEdit = false;
  isSubmitted = false;
  isSubmitting = false;

  constructor(private formBuilder:FormBuilder,
              private toastr:ToastrService,
              private userService:UserService) { }

  ngOnInit(): void {
    this.getCurrentUser();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  getCurrentUser(){
    this.userService.currentUser.pipe(takeUntil(this.destroy$)).subscribe({
      next:((user:User | null)=>{
        if(user){
          this.currentUser = user;
          this.initProfileForm();
        }
      })
    });
  }

  get control() {
    return this.profileForm.controls;
  }


  initProfileForm(){
    this.profileForm = this.formBuilder.group({
      name:[this.currentUser?.name, [Validators.required]],
      email:[this.currentUser?.email,[
        Validators.email,
        Validators.required]],
      phone:[this.currentUser?.phone,[
        Validators.required,
        Validators.minLength(10),
        Validators.pattern(/^[0-9]\d*$/)]
      ]
    });
  }

  initEdit(){
    this.initProfileForm();
    this.showEdit = true;
  }

  updateProfile(){

    this.isSubmitted = true;
    if(this.profileForm.invalid) return;

    //get user by email and check user not duplicate
    const user = this.profileForm.value;
    user.id = this.currentUser?.id;
    this.isSubmitting = true;

    this.userService.checkEmailExitsForUser(user.email, user.id)
      .pipe(
        takeUntil(this.destroy$),
        finalize(()=>{this.isSubmitting = false})
      )
      .subscribe({
        next:((users)=>{
          if(users.length == 0){
            //update user
            this.updateUser(user);
          } else {
            this.userService.error("That Email has been taken, use another one","Email already registered");
          }
        })
      })
  }



  updateUser(user:User){
    this.isSubmitting = true;
    this.userService.updateUser(user)
      .pipe(
        takeUntil(this.destroy$),
        finalize(()=>{this.isSubmitting = false})
      )
      .subscribe({
        next:((users)=> {
          //update user
          const token = localStorage.getItem(environment.userToken);
          if(token) {
            const userObject:User = JSON.parse(token);
            userObject.name = user.name;
            userObject.email = user.email;
            userObject.phone = user.phone;

            const newToken = JSON.stringify(userObject);

            localStorage.setItem(environment.userToken,newToken);
            this.toastr.success("Profile updated successfully!");
            this.showEdit = false;
            this.currentUser = user;
          }
        })
      })
  }

}
