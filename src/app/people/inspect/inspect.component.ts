import { Component, OnInit, Inject, Input } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from '@angular/material/dialog';
import {Person} from '../shared/components/person/person';
import { EditComponent } from '../edit/edit.component';

@Component({
  selector: 'app-inspect',
  templateUrl: './inspect.component.html',
  styleUrls: ['./inspect.component.scss']
})
export class InspectComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<InspectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Person,
    public dialog: MatDialog) { }

  ngOnInit() {
  }

  openEdit(person: Person): void {
    const dialogRef = this.dialog.open(EditComponent, {
    width: '585px',
    height: '520px',
    data: person
    });
  }
}
