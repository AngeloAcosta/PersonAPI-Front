import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatDialogModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatIconModule} from '@angular/material';
import { InspectComponent } from 'src/app/people/inspect/inspect.component';
import { EditComponent } from 'src/app/people/edit/edit.component';
import { CreateComponent } from 'src/app/people/create/create.component';


// Agregar en declarations y en entrycomponents los componentes que entraran en los modals
@NgModule({
  declarations: [
    InspectComponent,
    EditComponent,
    CreateComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule
  ],
  exports: [
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule
  ],
  entryComponents: [
    InspectComponent,
    EditComponent,
    CreateComponent
  ]
})
export class MaterialModule { }

