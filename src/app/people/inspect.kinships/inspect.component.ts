import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  MatDialog,
  MatTableDataSource,
  MatPaginator
} from '@angular/material';
import { PeopleService } from 'src/app/services/people.service';
import { SimplePerson, SimpleKinship } from 'src/app/services/services.models';
import { EditComponent as EditKinshipComponent} from 'src/app/kinships/edit/edit.component';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-inspect',
  templateUrl: './inspect.component.html',
  styleUrls: ['./inspect.component.scss']
})
export class InspectKinshipsComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  tableData: MatTableDataSource<SimpleKinship>;
  displayedColumns: string[] = ['1', '2', 'buttons'];
  person: SimplePerson;
  eKinship = EditKinshipComponent;

  constructor(
    private peopleService: PeopleService,
    public dialogRef: MatDialogRef<InspectKinshipsComponent>,
    @Inject(MAT_DIALOG_DATA) public personId: number,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.person = new SimplePerson();
    this.peopleService.inspectPerson(this.personId).subscribe(response => {
      if (response.ok) {
        this.person = response.data;
      }
    });
    this.peopleService.inspectPersonKinships(this.personId).subscribe(response => {
      if (response.ok) {
        this.tableData = new MatTableDataSource(response.data);
        this.tableData.paginator = this.paginator;
      }
    });
  }


  editKinship(person){
    this.dialog.open(EditKinshipComponent, {data: person});
  }

  deleteKinship(personId: number, relativeId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'btn btn-success',
      cancelButtonColor: 'btn btn-secondary',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then(result => {
      if (result.value) {
        this.peopleService.deleteKinship(personId, relativeId).subscribe(resp => {
          this.openSuccessDeleteMessage();
          this.tableData = new MatTableDataSource();
        });
      }
    });
  }

  openSuccessDeleteMessage(): void {
    Swal.fire({
      type: 'success',
      title: 'Done',
      text: 'This kinship was deleted succesfully',
      toast: true,
      position: 'top-end',
      width: 300,
      backdrop: false,
      showConfirmButton: false,
      timer: 1750
    });
  }
}
