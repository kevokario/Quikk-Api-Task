import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Account} from "../models/account";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  url:string = `${environment.url}/accounts`;

  constructor(private http:HttpClient) { }

  initUserAccount(userAccount:Account):Observable<any>{
    return this.http.post(this.url,userAccount);
  }

}
