import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from '@angular/material/dialog';
import { EditComponent } from '../edit/edit.component';

@Component({
  selector: 'app-inspect',
  templateUrl: './inspect.component.html',
  styleUrls: ['./inspect.component.scss']
})
export class InspectComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<InspectComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public dialog: MatDialog) { }

  ngOnInit() {
  }

  openEdit(person): void {
    const dialogRef = this.dialog.open(EditComponent, {
    data: person
    });
  }
}
