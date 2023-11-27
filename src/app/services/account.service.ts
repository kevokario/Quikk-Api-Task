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

  updateAccount(userAccount:Account, accountId:any):Observable<any> {
    return this.http.patch(`${this.url}/${accountId}`,userAccount);
  }

  getCurrentDateTime() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${year}:${month}:${date} ${hours}:${minutes}`;
  }

  getAccountTransactions(account:Account):Observable<Account>{
    const params:URLSearchParams  = new URLSearchParams();
    params.append('_embed','transactions');
    return this.http.get<Account>(`${this.url}/${account.id}?${ params.toString() }`);
  }



}
