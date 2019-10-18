

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PeopleRoutingModule } from './people-routing.module';
import { HomeComponent } from './home/home.component';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
import { PersonComponent } from './shared/components/person/person.component';
import { MaterialModule } from '../shared/modules/material.module';
import { InspectComponent } from './inspect/inspect.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpErrorInterceptor } from './shared/services/people.interceptor';
@NgModule({
  declarations: [
    HomeComponent,
    ListComponent,
    PersonComponent,
    InspectComponent,
    EditComponent,
    CreateComponent
    ],
  imports: [
    CommonModule,
    PeopleRoutingModule,
    MaterialModule,
  ],
  entryComponents: [
    InspectComponent,
    EditComponent,
    CreateComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    }
  ]
})
export class PeopleModule { }
