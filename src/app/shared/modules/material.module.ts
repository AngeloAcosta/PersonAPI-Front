import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatDialogModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatIconModule,
  MatTooltipModule} from '@angular/material'; 
import { InspectComponent } from 'src/app/people/inspect/inspect.component';
import { EditComponent } from 'src/app/people/edit/edit.component';
import { CreateComponent } from 'src/app/people/create/create.component';
import { ReactiveFormsModule , FormsModule} from '@angular/forms';

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
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    MatTooltipModule
  ],
  exports: [
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    MatTooltipModule
  ],
  entryComponents: [
    InspectComponent,
    EditComponent,
    CreateComponent
  ]
})
export class MaterialModule { }

