import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {BehaviorSubject, Observable} from "rxjs";
import {User} from "../models/user";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUser$:BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

  url:string = `${environment.url}/users`;
  constructor(private http:HttpClient, private toastr:ToastrService) { }

  getUserByEmail(email:string):Observable<Array<User>>{
    const params:URLSearchParams  = new URLSearchParams();
    params.append('email',email);
    return this.http.get<Array<User>>(`${this.url}?${ params.toString() }`);
  }
  checkEmailExitsForUser(email:string,userId:number):Observable<Array<User>>{
    const params:URLSearchParams  = new URLSearchParams();
    params.append('email',email);
    params.append('id_ne',userId.toString());
    return this.http.get<Array<User>>(`${this.url}?${ params.toString() }`);
  }

  loginUser(email:string,password:string):Observable<Array<User>>{
    const params:URLSearchParams  = new URLSearchParams();
    params.append('email',email);
    params.append('password',password);
    params.append('_embed','accounts');
    return this.http.get<Array<User>>(`${this.url}?${ params.toString() }`);
  }
//add user[register]
  registerUser(user:User):Observable<any> {
    return this.http.post(`${this.url}`,user)
  }
  updateUser(user:User):Observable<any> {
    return this.http.patch(`${this.url}/${user.id}`,user)
  }

  setCurrentUser(user:User):void{
    this.currentUser$.next(user);
  }

  get currentUser():Observable<User | null> {
    return new Observable<User | null>(subscriber => {
      const token = localStorage.getItem(environment.userToken);
      if(token) subscriber.next(JSON.parse(token));
      else subscriber.next(null)
    })
  }

  error(message:string = "Restart Json Server", title:string="An error occurred!"){
    this.toastr.error(message,title)
  }

  logout(){
    return new Observable(subscriber => {
      this.currentUser$.next(null);
      localStorage.removeItem(environment.userToken);
      subscriber.next("success");
    });
  }

}
