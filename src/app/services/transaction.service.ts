import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  url:string = `${environment.url}/transactions`;
  constructor() { }


}
