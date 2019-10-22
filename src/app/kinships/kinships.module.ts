import { MaterialModule } from './../shared/modules/material.module';
import { KinshipsRoutingModule } from './kinships-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { CreateComponent } from './create/create.component';
// import { InspectComponent } from './inspect.kinships/inspect.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KinshipComponent } from './shared/components/kinship/kinship.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpErrorInterceptor } from './shared/service/kinships.interceptor';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/listkinship.component';


@NgModule({
  declarations: [
    ListComponent,
    CreateComponent,
    KinshipComponent,
    EditComponent
  ],
  imports: [
    CommonModule,
    KinshipsRoutingModule,
    MaterialModule,
    MatCardModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    }
  ]
})
export class KinshipsModule { }
