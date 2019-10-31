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
import { CompileMetadataResolver } from '@angular/compiler';
import Swal from 'sweetalert2';

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
  sortedData: KinshipModel[];
  displayedColumns: string[] = ['1', '2', '3', 'buttons'];
  orderBy: number;
  orderType: number;
  relations: { type: string; value: string }[] = kinshipOptions;

  constructor(
    private kinshipsService: KinshipsService,
    public dialog: MatDialog,
    overlayContainer: OverlayContainer
  ) {
    overlayContainer.getContainerElement().classList.add('mat-light-theme');
  }

  ngOnInit() {
    this.getInitialData();
  }

  getInitialData() {
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
    const tempData = this.kinships.slice();
    if (!this.sort.active || this.sort.direction === '') {
      this.sortedData = tempData;
      return;
    }
    this.sortedData = tempData.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case '1':
          return this.compareValues(a.personName, b.personName, isAsc);
        case '2':
          return this.compareValues(a.kinshipType, b.kinshipType, isAsc);
        case '3':
          return this.compareValues(a.relativeName, b.relativeName, isAsc);
        default:
          return 0;
      }
    });
    this.loadTable(this.sortedData);
  }

  compareValues(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  onChange(value: string) {
    if (value !== '') {
      this.kinships = this.kinships.filter(item => {
        const fullname = `${item.personName.toLowerCase()} ${item.personLastName.toLowerCase()}`;
        return fullname.indexOf(value.toLocaleLowerCase()) > variableNum.n;
      });
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
    }).then(result => {
      if (result.value) {
        this.kinshipsService.deleteKinship(kinship).subscribe(resp => {
          this.kinships = this.kinships.filter(item => item !== kinship);
          this.loadTable(this.kinships);
        });
      }
      this.openSuccessDeleteMessage();
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
  openEdit(kinship): void {
    const dialogRef = this.dialog.open(EditComponent, {
      width: '65%',
      height: '77%',
      panelClass: ['edit-modalbox'],
      data: kinship
    });
    dialogRef.componentInstance.onEdit.subscribe(() => {
      dialogRef.close();
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getInitialData();
    });
  }

  openCreate(): void {
    const dialogRef = this.dialog.open(CreateComponent, {
      width: '80%',
      height: '450px',
      panelClass: 'create-modalbox'
    });
    dialogRef.componentInstance.onCreate.subscribe(() => {
      dialogRef.close();
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getInitialData();
    });
  }

  loadTable(param) {
    this.tableData = new MatTableDataSource(param);
    this.tableData.paginator = this.paginator;
    this.tableData.sort = this.sort;
  }
}
