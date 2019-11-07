import { MaterialModule } from './../shared/modules/material.module';
import { KinshipsRoutingModule } from './kinships-routing.module';
import { NgModule } from '@angular/core';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/listkinship.component';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    ListComponent,
    CreateComponent,
    EditComponent
  ],
  imports: [
    CommonModule,
    KinshipsRoutingModule,
    MaterialModule
  ],
})
export class KinshipsModule { }
