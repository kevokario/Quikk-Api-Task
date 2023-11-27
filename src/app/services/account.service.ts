import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Account} from "../models/account";
import {Transaction} from "../models/transaction";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  url:string = `${environment.url}/accounts`;

  constructor(private http:HttpClient) { }

  initUserAccount(userAccount:Account):Observable<any>{
    return this.http.post(this.url,userAccount);
  }

  updateAccount(userAccount:Account, accountId:any):Observable<any> {
    return this.http.patch(`${this.url}/${accountId}`,userAccount);
  }



}
