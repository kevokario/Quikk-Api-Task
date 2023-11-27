import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from "../../models/user";
import {Subject, takeUntil} from "rxjs";
import {environment} from "../../../environments/environment";
import {Account} from "../../models/account";
import {AccountService} from "../../services/account.service";
import {UserService} from "../../services/user.service";
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit,OnDestroy {

  currentUser!:User;
  moneyOut = 0;
  moneyIn = 0;
  userAccount!:Account;
  destroy$:Subject<boolean> = new Subject<boolean>();

  moneyInChart:any = [];
  moneyOutChart:any = [];
  cashFlowChart:any = [];

  constructor(private accountService:AccountService, private userService:UserService) { }

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
        const moneyOutLabels:Array<string> = [];
        const moneyOutData:Array<number> = [];
        const moneyInLabels:Array<string> = [];
        const moneyInData:Array<number> = [];
        userAccount.transactions?.forEach((transaction)=>{
          if(transaction.action == "Money Out" ) {
            this.moneyOut += transaction.amount;
            moneyOutLabels.push(transaction.time);
            moneyOutData.push(transaction.amount);
          } else {
            this.moneyIn += transaction.amount;
            moneyInLabels.push(transaction.time);
            moneyInData.push(transaction.amount);
          }

        });

        this.moneyInChart = new Chart('money_in', {
          type: 'bar',
          data: {
            labels: moneyInLabels,
            datasets: [
              {
                label: 'Money In',
                data: moneyInData,
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
        this.moneyOutChart = new Chart('money_out', {
          type: 'bar',
          data: {
            labels: moneyOutLabels,
            datasets: [
              {
                label: 'Money Out',
                data: moneyOutData,
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
        this.cashFlowChart = new Chart('cash_flow', {
          type: 'pie',
          data: {
            labels: ["Money In","Money Out"],
            datasets: [
              {
                label: 'Cash Flow',
                data: [this.moneyIn,this.moneyOut],
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      }),
      error:(()=>{this.userService.error()})
    })
  }

}
