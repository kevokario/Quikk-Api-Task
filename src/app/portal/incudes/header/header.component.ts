import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {UserService} from "../../../services/user.service";
import {Subject, takeUntil} from "rxjs";
import {User} from "../../../models/user";
import {Router} from "@angular/router";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss','./../../portal.component.scss']
})
export class HeaderComponent implements OnInit,OnDestroy {

  destroy$:Subject<boolean> = new Subject<boolean>();

  currentUser!:User;

  @Input() showSidebar = false;
  @Input() title = '';
  @Output() toggleSidebarEvt:EventEmitter<void> = new EventEmitter<void>();

  constructor(private userService:UserService,
              private router:Router) { }

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
          }
  }

  toggleSidebar() : void {
    this.toggleSidebarEvt.emit();
  }

  logout(){
    this.userService
      .logout()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({
        next:(()=>{

          this.router.navigateByUrl("")
        })
      })
  }

}
