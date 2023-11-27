import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactRoutingModule } from './transact-routing.module';
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TransactRoutingModule,
    ReactiveFormsModule
  ]
})
export class TransactModule { }
