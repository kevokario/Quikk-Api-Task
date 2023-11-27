import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Transaction} from "../models/transaction";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  url:string = `${environment.url}/transactions`;

  constructor(private http:HttpClient) { }

  recordTransaction(transaction:Transaction):Observable<any> {
    return this.http.post(this.url,transaction);
  }

  getTransactions():Observable<Array<Transaction>>{
    return this.http.get<Array<Transaction>>(this.url);
  }
}
