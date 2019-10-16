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
  displayedColumns: string[] = [
    'namePerson',
    'documentPerson',
    'kinshipType',
    'nameRelative',
    'documentRelative',
    'buttons'
  ];
  orderBy: string;
  orderType: any;

  constructor(
    private kinshipsService: KinshipsService,
    public dialog: MatDialog,
    overlayContainer: OverlayContainer
  ) {
    overlayContainer.getContainerElement().classList.add('mat-light-theme');
  }

  ngOnInit() {
    this.kinshipsService.getKinship().subscribe(kinships => {
      this.kinships = kinships;
      this.temporalData = kinships;
      this.loadTable(this.kinships);
    });
  }

  orderTable() {
    merge(this.sort.sortChange)
      .pipe(
        startWith({}),
        switchMap(() => {
          // tslint:disable-next-line: radix
          this.orderBy = this.sort.active;
          /*if (this.sort.direction === 'asc') {
            this.orderType = 1;
          } else {
            this.orderType = 2;
          }*/
          return this.kinshipsService.getKinshipsSorted(
            this.orderBy,
            this.orderType
          );
        })
      )
      .subscribe(kinship => this.loadTable(kinship)); // Agregar.data cuando se lo ponga en la API
  }

  onChange(value: string) {
    if (value !== '') {
      this.kinships = this.kinships.filter(
        (item: {
          namePerson: { toLowerCase: () => string };
          lastNamePerson: { toLowerCase: () => string };
        }) => {
          const fullname =
            item.namePerson.toLowerCase() +
            ' ' +
            item.lastNamePerson.toLowerCase();
          return fullname.indexOf(value.toLocaleLowerCase()) > -1;
        }
      );
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
