import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {finalize, forkJoin, Observable, Subject, takeUntil} from "rxjs";
import {environment} from "../../../environments/environment";
import {User} from "../../models/user";
import Swal from "sweetalert2";
import {AccountService} from "../../services/account.service";
import {Account} from "../../models/account";
import {Transaction} from "../../models/transaction";
import {TransactionsService} from "../../services/transactions.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.scss']
})
export class DepositComponent implements OnInit,OnDestroy {

  depositForm!:FormGroup;
  currentUser!:User;
  submitted = false;
  submitting = false;
  destroy$:Subject<boolean> = new Subject<boolean>();

  sources:Array<string> = new Array<string>();

  constructor(private formBuilder:FormBuilder,
              private accountService:AccountService,
              private transactionService:TransactionsService,
              private toastr:ToastrService) { }

  ngOnInit(): void {
    this.initForm();
    this.initSources();
    this.initCurrentUser();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  initForm(){
    this.depositForm = this.formBuilder.group({
      source:[null,[Validators.required]],
      agent:[null,[Validators.required]],
      amount:[null,[
        Validators.required,
        Validators.pattern(/^[0-9]\d*$/),
        Validators.min(100),
        Validators.max(300000)]]
    });
  }

  initSources(){
    this.sources = ["M-Pesa","Bank"];
  }

  initCurrentUser(){
    const token = localStorage.getItem(environment.userToken);
    if(token){
      this.currentUser = JSON.parse(token);
    }
  }

  resetForm(){
    this.depositForm.reset();
  }

  get control(){
    return this.depositForm.controls;
  }

  formatCurrency(amount: number, locale: string = 'en-KE', currency: string = 'KSh'): string {
    return amount.toLocaleString(locale, { style: 'currency', currency: currency });
  }

  async deposit(){
    this.submitted = true;

    if(this.depositForm.invalid) return;

    const formData = this.depositForm.value;

    const option = await Swal.fire({
      title:"Make Transaction",
      icon:"question",
      text:`You are about to deposit ${this.formatCurrency(formData.amount)} to account ${this.currentUser.name}. Proceed with action ?`,
      showCancelButton:true,
      cancelButtonText:'Cancel',
      confirmButtonText:'Proceed',
      reverseButtons:true
    })

    if(option.isDenied) return;

    //make deposit.
    //record in transactions table.
    //update in accounts table
    //update localstorage

    const account:Account = {
      id:this.currentUser.accounts?.[0]?.id,
      amount:Number(this.currentUser.accounts?.[0]?.amount) + Number(formData.amount),
      userId:this.currentUser.id
    };

    const transaction:Transaction = {
      accountId:account.id,
      amount:formData.amount,
      beforeAmount:this.currentUser.accounts?.[0]?.amount || 0,
      action:"Money In",
      otherParty:formData.source+' '+formData.agent,
      time:this.accountService.getCurrentDateTime(),
      afterAmount:account.amount
    }

    const recordTransactionApi$:Observable<any> = this.transactionService.recordTransaction(transaction);
    const updateAccountApi$:Observable<any> = this.accountService.updateAccount(account,account.id);

    this.submitting = true;

    forkJoin([recordTransactionApi$,updateAccountApi$])
      .pipe(
        takeUntil(this.destroy$),
        finalize(()=>{this.submitting = false})
      )
      .subscribe({
        next:((response)=>{
          this.submitting = false;
          this.submitted = false;
          this.resetForm();
          this.updateCurrentUser(account.amount)
          this.toastr.success("Account Successfully Deposited with amount "+this.formatCurrency(formData.amount),"Deposit Success");
        })
      })
  }

  updateCurrentUser(amount:number){
    if (this.currentUser && this.currentUser.accounts && this.currentUser.accounts[0]) {
      this.currentUser.accounts[0].amount = amount;

      localStorage.setItem(environment.userToken,JSON.stringify(this.currentUser));
    }
  }



}
