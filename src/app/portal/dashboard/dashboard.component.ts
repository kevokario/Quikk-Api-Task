import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {TransactionService} from "../../services/transaction.service";
import {environment} from "../../../environments/environment";
import {User} from "../../models/user";
import {Account} from "../../models/account";
import {finalize, Subject, takeUntil} from "rxjs";
import {AccountService} from "../../services/account.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit,OnDestroy {

  currentUser!:User;
  userAccount!:Account;
  moneyOut = 0;
  moneyIn = 0;
  destroy$:Subject<boolean> = new Subject<boolean>();
  constructor(private userService:UserService, private accountService:AccountService) { }

  ngOnInit(): void {
    this.initCurrentUser();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  initCurrentUser(){
    const token = localStorage.getItem(environment.userToken);
    if(token){
      this.currentUser = JSON.parse(token);
      if(this.currentUser && this.currentUser.accounts ) this.initAccountTransactions(this.currentUser.accounts[0])
    }
  }

  initAccountTransactions(account:Account){
    this.accountService.getAccountTransactions(account).pipe(
      takeUntil(this.destroy$),
    ).subscribe({
      next:((userAccount)=>{
        this.userAccount = userAccount;

        userAccount.transactions?.forEach((transaction)=>{
          transaction.action == "Money Out" ? this.moneyOut+=transaction.amount : this.moneyIn+=transaction.amount
        });
      }),
      error:(()=>{this.userService.error()})
    })
  }

}
