import { KinshipModel } from './../../models/kinship.model';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PeopleService } from './../shared/services/people.service';
import { merge, of as observableOf } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import {
  MatDialog,
  MatTableDataSource,
  MatSort,
  MatPaginator
} from '@angular/material';
import { Kinship } from 'src/app/models/kinship.model';

@Component({
  selector: 'app-inspect',
  templateUrl: './inspect.component.html',
  styleUrls: ['./inspect.component.scss']
})
export class InspectKinshipsComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
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
      console.log(this.person);

    });
  }

  orderTable() {
    merge(this.sort.sortChange)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.orderBy = Number(this.sort.active);
          if (this.sort.direction === 'asc') {
            this.orderType = 1;
          } else {
            this.orderType = 2;
          }
          return this.peopleService.getKinshipSorted(
            this.orderBy,
            this.orderType,
            this.data
          );
        })
      )
      .subscribe(person => this.loadKinshipTable(person));
  }

  loadKinshipTable(param) {
    this.tableData = new MatTableDataSource(param);
    this.tableData.paginator = this.paginator;
    this.tableData.sort = this.sort;
  }
}
