import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from "./utils/auth.guard";

const routes: Routes = [{
    path:'',
    loadChildren:() => import("./auth/auth.module").then(module=>module.AuthModule)
  },{
  path:'portal',
    loadChildren:()=>import("./portal/portal.module").then(module=>module.PortalModule),
  canActivate:[AuthGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
