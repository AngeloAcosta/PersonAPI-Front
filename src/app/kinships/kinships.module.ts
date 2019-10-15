import { MaterialModule } from './../shared/modules/material.module';
import { KinshipsRoutingModule } from './kinships-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';



@NgModule({
  declarations: [
    ListComponent
  ],
  imports: [
    CommonModule,
    KinshipsRoutingModule,
    MaterialModule,
  ],
  entryComponents: [
  ],
})
export class KinshipsModule { }
