import { MaterialModule } from './../shared/modules/material.module';
import { KinshipsRoutingModule } from './kinships-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
// import { InspectComponent } from './inspect.kinships/inspect.component';



@NgModule({
  declarations: [
    ListComponent,
    CreateComponent,
    // InspectComponent
  ],
  imports: [
    CommonModule,
    KinshipsRoutingModule,
    MaterialModule,
    MatCardModule
  ],
  entryComponents: [
  ],
})
export class KinshipsModule { }
