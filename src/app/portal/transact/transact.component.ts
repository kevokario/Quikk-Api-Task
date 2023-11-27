import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from "../../models/user";
import {finalize, forkJoin, Observable, Subject, takeUntil} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AccountService} from "../../services/account.service";
import {TransactionsService} from "../../services/transactions.service";
import {ToastrService} from "ngx-toastr";
import {environment} from "../../../environments/environment";
import {UserService} from "../../services/user.service";
import Swal from "sweetalert2";
import {Account} from "../../models/account";
import {Transaction} from "../../models/transaction";

@Component({
  selector: 'app-transact',
  templateUrl: './transact.component.html',
  styleUrls: ['./transact.component.scss']
})
export class TransactComponent implements OnInit,OnDestroy {

  transactForm!:FormGroup;

  currentUser!:User;
  submitted = false;
  submitting = false;
  users:Array<User> = [];
  usersMap = new Map();
  destroy$:Subject<boolean> = new Subject<boolean>();

  constructor(private formBuilder:FormBuilder,
  private userService:UserService,
  private accountService:AccountService,
  private transactionService:TransactionsService,
  private toastr:ToastrService) { }

  ngOnInit(): void {
    this.initTransactForm();
    this.initCurrentUser();
    this.loadAllUsers();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  initCurrentUser(){
    const token = localStorage.getItem(environment.userToken);
    if(token){
      this.currentUser = JSON.parse(token);

      if (this.currentUser && this.currentUser.accounts && this.currentUser.accounts[0])
        this.updateMoneyValidator(this.currentUser.accounts[0].amount)
    }
  }
  updateMoneyValidator(amount:number){
    this.control['amount'].addValidators(Validators.max(amount));
    this.transactForm.updateValueAndValidity();
  }


  loadAllUsers() {
    if(this.currentUser && this.currentUser.id)   {
      this.userService.getRecipients(this.currentUser.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next:((users)=>{
            this.users = users;
            users.forEach((user)=>this.usersMap.set(user.id,user))
          })
        })
    }
  }

  initTransactForm(){
    this.transactForm = this.formBuilder.group({
      recipient:[null,[Validators.required]],
      amount:[null,[Validators.required, Validators.min(100)]]
    })
  }

  resetForm(){
    this.transactForm.reset();
  }

  get control(){
    return this.transactForm.controls;
  }

  async sendMoney(){
    this.submitted = true;

    if(this.transactForm.invalid) return;

    const formData = this.transactForm.value;
    const sendTo:User = this.usersMap.get(Number(formData.recipient));

    const option = await Swal.fire({
      title:"Make Transaction",
      icon:"question",
      text:`You are about to send ${this.formatCurrency(formData.amount)} to  ${sendTo.name}. Proceed with action ?`,
      showCancelButton:true,
      cancelButtonText:'Cancel',
      confirmButtonText:'Proceed',
      reverseButtons:true
    });

    if(option.isDenied) return;

    const senderAccount:Account = {
      id:this.currentUser.accounts?.[0]?.id,
      amount:Number(this.currentUser.accounts?.[0]?.amount) - Number(formData.amount),
      userId:this.currentUser.id
    };

    const senderTransaction:Transaction = {
      accountId:senderAccount.id,
      amount:formData.amount,
      beforeAmount:this.currentUser.accounts?.[0]?.amount || 0,
      action:"Money Out",
      otherParty:formData.source+' '+formData.agent,
      time:this.accountService.getCurrentDateTime(),
      afterAmount:senderAccount.amount
    }

    const recordSenderTransactionApi$:Observable<any> = this.transactionService.recordTransaction(senderTransaction);
    const updateSenderAccountApi$:Observable<any> = this.accountService.updateAccount(senderAccount,senderAccount.id);

    forkJoin([recordSenderTransactionApi$,updateSenderAccountApi$])
      .pipe(
        takeUntil(this.destroy$),
        finalize(()=>{this.submitting = false})
      )
      .subscribe({
        next:((response)=>{
          this.submitting = false;
          this.submitted = false;
          this.resetForm();
          this.updateCurrentUser(senderAccount.amount)
        })
      })

    this.updateRecipientAccount(formData);
  }

  updateRecipientAccount(formData:{recipient:number,amount:number}) {
    this.userService.getUserByid(formData.recipient).pipe(takeUntil(this.destroy$)).subscribe(
      {
        next:((user)=>{

          const recipientAccount:Account = {
            id:Number(formData.recipient),
            amount:Number(user.accounts?.[0]?.amount) + Number(formData.amount),
            userId:user.id
          };


          const recipientTransaction:Transaction = {
            accountId:user.accounts?.[0]?.id,
            amount:formData.amount,
            beforeAmount:user.accounts?.[0]?.amount || 0,
            action:"Money In",
            otherParty:user.name+' - '+user.phone,
            time:this.accountService.getCurrentDateTime(),
            afterAmount:recipientAccount.amount
          }

          const recordRecipientTransactionApi$:Observable<any> = this.transactionService.recordTransaction(recipientTransaction);
          const updateRecipientAccountApi$:Observable<any> = this.accountService.updateAccount(recipientAccount,recipientAccount.id);

          forkJoin([recordRecipientTransactionApi$,updateRecipientAccountApi$])
            .pipe(
              takeUntil(this.destroy$),
              finalize(()=>{this.submitting = false})
            )
            .subscribe({
              next:((response)=>{
                this.submitting = false;
                this.submitted = false;
                this.toastr.success("Amount Successfully sent! ","Transaction Success");
              })
            })
        })
      }
    );



  }

  updateCurrentUser(amount:number){
    if (this.currentUser && this.currentUser.accounts && this.currentUser.accounts[0]) {
      this.currentUser.accounts[0].amount = amount;

      localStorage.setItem(environment.userToken,JSON.stringify(this.currentUser));
    }
  }


  formatCurrency(amount: number, locale: string = 'en-KE', currency: string = 'KSh'): string {
    return amount.toLocaleString(locale, { style: 'currency', currency: currency });
  }
}
