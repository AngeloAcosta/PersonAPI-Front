import { InspectKinshipsComponent } from '../inspect.kinships/inspect.component';
import { Person } from './../create/create.models';
import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from '@angular/material/dialog';
import { PeopleService } from './../shared/services/people.service';
import { EditComponent } from '../edit/edit.component';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-inspect',
    templateUrl: './inspect.component.html',
    styleUrls: ['./inspect.component.scss']
})

export class InspectComponent implements OnInit {
  constructor(private peopleService: PeopleService,
              public dialogRef: MatDialogRef<InspectComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              public dialog: MatDialog) { }
    people: Array<Person>;
    person: object;

  ngOnInit() {
  }
  delete(person): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.peopleService.deletePerson(person).subscribe(resp => {
          this.people = this.people.filter(item => item.id !== person.id);
        });
        Swal.fire(
          'Deleted!',
          'This person has been deleted.',
          'success'
        );
      }
    });

  }
  openEdit(person): void {
    const dialogRef = this.dialog.open(EditComponent, {
      width: '585px',
      height: '520px',
    data: person
    });
  }
  openKinship(data): void {
    const dialogRef = this.dialog.open(InspectKinshipsComponent, {
      data: data.person
    });
  }
}
