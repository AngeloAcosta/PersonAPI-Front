import { OverlayContainer } from '@angular/cdk/overlay';
import { KinshipsService } from '../shared/service/kinships.service';
import {
  MatDialog,
  MatPaginator,
  MatTableDataSource,
  MatSort
} from '@angular/material';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { startWith, switchMap } from 'rxjs/operators';
import { merge } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  tableData: MatTableDataSource<any>;
  kinships;
  temporalData;
  displayedColumns: string[] = ['1', '2', '3', '4', '5', 'buttons'];
  orderBy: number;
  orderType: number;

  constructor(
    private kinshipsService: KinshipsService,
    public dialog: MatDialog,
    overlayContainer: OverlayContainer
  ) {
    overlayContainer.getContainerElement().classList.add('mat-light-theme');
  }

  ngOnInit() {
    this.kinshipsService.getKinship().subscribe(kinships => {
      this.kinships = kinships.data;
      this.temporalData = kinships.data;
      this.loadTable(this.kinships);
    });
  }

  orderTable() {
    merge(this.sort.sortChange)
      .pipe(
        startWith({}),
        switchMap(() => {
          // tslint:disable-next-line: radix
          this.orderBy = parseInt(this.sort.active);
          if (this.sort.direction === 'asc') {
            this.orderType = 1;
          } else {
            this.orderType = 2;
          }
          return this.kinshipsService.getKinshipsSorted(
            this.orderBy,
            this.orderType
          );
        })
      )
      .subscribe(kinship => this.loadTable(kinship.data));
  }

  onChange(value: string) {
    if (value !== '') {
      this.kinships = this.kinships.filter(item => {
        const fullname =
          item.namePerson.toLowerCase() +
          ' ' +
          item.lasName.toLowerCase();
        return fullname.indexOf(value.toLocaleLowerCase()) > -1;
      });
      this.loadTable(this.kinships);
    } else {
      this.kinships = this.temporalData;
      this.loadTable(this.kinships);
    }
  }

  loadTable(param) {
    this.tableData = new MatTableDataSource(param);
    this.tableData.paginator = this.paginator;
    this.tableData.sort = this.sort;
  }
}
