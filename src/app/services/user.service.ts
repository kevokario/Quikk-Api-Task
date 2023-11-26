import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {User} from "../models/user";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url:string = environment.url;
  constructor(private http:HttpClient, private toastr:ToastrService) { }



  //login

  //get user by id

  //get user by email

  getUserByEmail(email:string):Observable<Array<User>>{
    const params:URLSearchParams  = new URLSearchParams();
    params.append('email',email);
    return this.http.get<Array<User>>(`${this.url}/users?${ params.toString() }`);
  }

  loginUser(email:string,password:string):Observable<Array<User>>{
    const params:URLSearchParams  = new URLSearchParams();
    params.append('email',email);
    params.append('password',password);
    return this.http.get<Array<User>>(`${this.url}/users?${ params.toString() }`);
  }
//add user[register]
  registerUser(user:User):Observable<any> {
    return this.http.post(`${this.url}/users`,user)
  }

  error(){
    this.toastr.error("Restart Json Server","An error occurred!")
  }


}
