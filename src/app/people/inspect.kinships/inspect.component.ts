import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { PeopleService } from './../shared/services/people.service';
import {merge,  of as observableOf} from 'rxjs';
import {startWith, switchMap} from 'rxjs/operators';
// import { EditComponent } from '../edit/edit.component';
import {MatDialog, MatTableDataSource, MatSort , MatPaginator} from '@angular/material';

@Component({
  selector: 'app-inspect',
  templateUrl: './inspect.component.html',
  styleUrls: ['./inspect.component.scss']
})
export class InspectKinshipsComponent implements OnInit {
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  tableData: MatTableDataSource<any>;
  kinship;
  displayedColumns: string[] = ['1', '2', '3', 'buttons'];
  orderBy: number;
  orderType: number;
  constructor(
    private peopleService: PeopleService,
    public dialogRef: MatDialogRef<InspectKinshipsComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.peopleService.getPersonKinships(this.data).subscribe(kinships => {
      this.data = kinships;
      this.loadKinshipTable(this.data);
      console.log(this.data);
      // this.kinship = kinship.data;
      // this.temporalData = people.data;
      // this.loadTable(this.people);
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
          } else { this.orderType = 2; }
          return this.peopleService.getPeopleSorted(
            this.orderBy, this.orderType);
        })).subscribe(person => this.loadKinshipTable(person));
  }

  loadKinshipTable(param){
    this.tableData = new MatTableDataSource(param);
  }

  /*openEdit(person): void {
    const dialogRef = this.dialog.open(EditComponent, {
    data: person
    });
  }*/

}
