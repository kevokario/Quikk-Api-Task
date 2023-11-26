import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TransactComponent} from "./transact.component";

const routes: Routes = [{
  path:'',
  component:TransactComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactRoutingModule { }
