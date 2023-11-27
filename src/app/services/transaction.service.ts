import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import {Account} from "../models/account";
import {Observable} from "rxjs";
import {User} from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  url:string = `${environment.url}/transactions`;
  constructor(private http:HttpClient) { }


}
