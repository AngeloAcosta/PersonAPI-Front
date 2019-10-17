import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from '@angular/material/dialog';
import { PeopleService } from './../shared/services/people.service';
// import { EditComponent } from '../edit/edit.component';

@Component({
  selector: 'app-inspect',
  templateUrl: './inspect.component.html',
  styleUrls: ['./inspect.component.scss']
})
export class InspectKinshipsComponent implements OnInit {
  kinship;
  constructor(
    private peopleService: PeopleService,
    public dialogRef: MatDialogRef<InspectKinshipsComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.peopleService.getPersonKinships(this.data).subscribe(kinship => {
      // this.kinship = kinship.data;
      // this.temporalData = people.data;
      // this.loadTable(this.people);
    });
  }

  /*openEdit(person): void {
    const dialogRef = this.dialog.open(EditComponent, {
    data: person
    });
  }*/

}
