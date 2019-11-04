import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  MatDialog,
  MatTableDataSource,
  MatPaginator
} from '@angular/material';
import { PeopleService } from 'src/app/services/people.service';
import { SimplePerson, SimpleKinship } from 'src/app/services/services.models';

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
}
