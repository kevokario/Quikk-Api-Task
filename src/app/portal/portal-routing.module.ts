import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PortalComponent} from "./portal.component";
import {DashboardComponent} from "./dashboard/dashboard.component";

const routes: Routes = [
  {
    path:'', redirectTo:'dash', pathMatch:'full'
  },{
    path:'',
    component:PortalComponent,
    children:[
      {
        path:'dash',
        component:DashboardComponent
      },
      {
      path:'deposit',
        loadChildren:()=>import('./deposit/deposit.module').then(m=>m.DepositModule)
      },
      {
        path:'transact',
        loadChildren:()=>import('./transact/transact.module').then(m=>m.TransactModule)
      },{
        path:'transactions',
        loadChildren:()=>import('./transactions/transactions.module').then(m=>m.TransactionsModule)
      },{
        path:'profile',
        loadChildren:()=>import('./profile/profile.module').then(m=>m.ProfileModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortalRoutingModule { }
