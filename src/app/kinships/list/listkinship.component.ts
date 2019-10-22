import { EditComponent } from '../edit/edit.component';
import { KinshipsService } from '../shared/service/kinships.service';
import Swal from 'sweetalert2';
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
import { Kinship } from 'src/app/models/kinship.model';

@Component({
  selector: 'app-list',
  templateUrl: './listkinship.component.html',
  styleUrls: ['./listkinship.component.scss']
})
export class ListComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  tableData: MatTableDataSource<Kinship[]>;
  kinships: Kinship[];
  temporalData: Kinship[];
  displayedColumns: string[] = [
    '1',
    '2',
    '3',
    'buttons'
  ];
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
        (item: {
          namePerson: { toLowerCase: () => string };
          lastNamePerson: { toLowerCase: () => string };
        }) => {
          const fullname =
          `${item.namePerson.toLowerCase()} ${item.lastNamePerson.toLowerCase()}`;
          return fullname.indexOf(value.toLocaleLowerCase()) > -1;
        }
      );
      this.loadTable(this.kinships);
    } else {
      this.kinships = this.temporalData;
      this.loadTable(this.kinships);
    }
  }

  delete(kinship): void {
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
        this.kinshipsService.deleteKinship(kinship).subscribe(resp => {
          this.kinships = this.kinships.filter(item => item.id !== kinship.id);
          this.loadTable(this.kinships);
        });
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        );
      }
    });
  }

  openEdit(kinship): void {
    const dialogRef = this.dialog.open(EditComponent, {
      width: '585px',
      height: '520px',
      panelClass: 'custom-modalbox',
      data: kinship
    });
  }

  openCreate(): void {
    const dialogRef = this.dialog.open(CreateComponent, {
      width: '585px',
      height: '520px'
    });
  }

  loadTable(param) {
    this.tableData = new MatTableDataSource(param);
    this.tableData.paginator = this.paginator;
    this.tableData.sort = this.sort;
  }
}
