import { NgModule } from '@angular/core';
import { PeopleRoutingModule } from './people-routing.module';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
import { InspectComponent } from './inspect/inspect.component';
import { InspectKinshipsComponent } from './inspect.kinships/inspect.component';
import { TreeComponent } from './tree/tree.component';
import { MaterialModule } from '../shared/modules/material.module';
import { CommonModule } from '@angular/common';
import {EditComponent as EditKinshipComponent} from '../kinships/edit/edit.component';
import { CreateComponent as KinshipCreateComponent } from './../kinships/create/create.component';
import { KinshipsModule } from '../kinships/kinships.module';

@NgModule({
  declarations: [
    CreateComponent,
    EditComponent,
    InspectComponent,
    InspectKinshipsComponent,
    ListComponent,
    TreeComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    PeopleRoutingModule,
    KinshipsModule
  ],
  entryComponents: [
    CreateComponent,
    EditComponent,
    InspectComponent,
    InspectKinshipsComponent,
    EditKinshipComponent,
    KinshipCreateComponent
  ]
})
export class PeopleModule { }
