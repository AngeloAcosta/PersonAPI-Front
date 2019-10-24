import { KinshipModel } from './../../models/kinship.model';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PeopleService } from './../shared/services/people.service';
import {
  MatDialog,
  MatTableDataSource,
  MatPaginator
} from '@angular/material';

@Component({
  selector: 'app-inspect',
  templateUrl: './inspect.component.html',
  styleUrls: ['./inspect.component.scss']
})
export class InspectKinshipsComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  tableData: MatTableDataSource<KinshipModel>;
  displayedColumns: string[] = ['1', '2', 'buttons'];
  orderBy: number;
  orderType: number;
  person;

  constructor(
    private peopleService: PeopleService,
    public dialogRef: MatDialogRef<InspectKinshipsComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public dialog: MatDialog
  ) {}

  ngOnInit() {

    this.peopleService.getPersonKinships(this.data).subscribe(kinships => {
      this.person = kinships;
      this.loadKinshipTable(this.person);
    });
  }

  loadKinshipTable(param) {
    this.tableData = new MatTableDataSource(param);
    this.tableData.paginator = this.paginator;
  }
}
