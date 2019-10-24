import { EditComponent } from '../edit/edit.component';
import { KinshipsService } from '../shared/service/kinships.service';
import { OverlayContainer } from '@angular/cdk/overlay';
import {
  MatDialog,
  MatPaginator,
  MatTableDataSource,
  MatSort
} from '@angular/material';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { startWith, switchMap } from 'rxjs/operators';
import { merge } from 'rxjs';
import { CreateComponent } from '../create/create.component';
import { Kinship, KinshipModel } from 'src/app/models/kinship.model';
import { kinshipOptions, variableNum } from 'src/app/shared/constants';

@Component({
  selector: 'app-list',
  templateUrl: './listkinship.component.html',
  styleUrls: ['./listkinship.component.scss']
})
export class ListComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  tableData: MatTableDataSource<Kinship[]>;
  kinships: KinshipModel[];
  temporalData: KinshipModel[];
  displayedColumns: string[] = [
    '1',
    '2',
    '3',
    'buttons'
  ];
  orderBy: number;
  orderType: number;
  relations: {type: string, value: string}[] = kinshipOptions;

  constructor(
    private kinshipsService: KinshipsService,
    public dialog: MatDialog,
    overlayContainer: OverlayContainer
  ) {
    overlayContainer.getContainerElement().classList.add('mat-light-theme');
  }

  ngOnInit() {
    this.kinshipsService.getKinships().subscribe(kinships => {
      this.kinships = kinships;
      this.temporalData = kinships;
      this.loadTable(this.kinships);
    });
  }

  getKinshipType(type: string) {
    const response = this.relations.find(relation => relation.value === type);
    return response.type;
  }

  orderTable() {
    merge(this.sort.sortChange)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.orderBy = parseInt(this.sort.active, 10);
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
      .subscribe(kinship => this.loadTable(kinship));
  }

  onChange(value: string) {
    if (value !== '') {
      this.kinships = this.kinships.filter(
        item => {
        const fullname =
        `${item.personName.toLowerCase()} ${item.personLastName.toLowerCase()}`;
        return fullname.indexOf(value.toLocaleLowerCase()) > variableNum.n;
      });
      this.loadTable(this.kinships);
    } else {
      this.kinships = this.temporalData;
      this.loadTable(this.kinships);
    }
  }

  delete(kinship): void {
  }

  openEdit(kinship): void {
    const dialogRef = this.dialog.open(EditComponent, {
      width: '560px',
      height: '465px',
      panelClass: 'custom-modalbox',
      data: kinship
    });
  }

  openCreate(): void {
    const dialogRef = this.dialog.open(CreateComponent, {
      width: '80%',
      height: '450px',
      panelClass: 'custom-modalbox'
    });
  }

  loadTable(param) {
    this.tableData = new MatTableDataSource(param);
    this.tableData.paginator = this.paginator;
    this.tableData.sort = this.sort;
  }

  openInfo(row) {
}
}
