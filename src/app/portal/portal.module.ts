import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PortalRoutingModule} from "./portal-routing.module";
import { PortalComponent } from './portal.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './incudes/header/header.component';
import { SideBarComponent } from './incudes/side-bar/side-bar.component';
import { DepositComponent } from './deposit/deposit.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { TransactComponent } from './transact/transact.component';
import { ProfileComponent } from './profile/profile.component';
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    PortalComponent,
    DashboardComponent,
    HeaderComponent,
    SideBarComponent,
    DepositComponent,
    TransactionsComponent,
    TransactComponent,
    ProfileComponent
  ],
    imports: [
        CommonModule,
        PortalRoutingModule,
        ReactiveFormsModule
    ]
})
export class PortalModule { }
