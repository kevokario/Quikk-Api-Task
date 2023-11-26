import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
    path:'',
    loadChildren:() => import("./auth/auth.module").then(module=>module.AuthModule)
  },{
  path:'portal',
    loadChildren:()=>import("./portal/portal.module").then(module=>module.PortalModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
