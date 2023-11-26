import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url:string = environment.url;
  constructor(private http:HttpClient) { }

  //add user[register]

  //login

  //get user
}
