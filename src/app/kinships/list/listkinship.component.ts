import { EditComponent } from '../edit/edit.component';
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
import { CompileMetadataResolver } from '@angular/compiler';
import Swal from 'sweetalert2';
import { SimpleKinship } from 'src/app/services/services.models';
import { KinshipsService } from 'src/app/services/kinships.service';
import { PeopleService } from 'src/app/services/people.service';

@Component({
  selector: 'app-list',
  templateUrl: './listkinship.component.html',
  styleUrls: ['./listkinship.component.scss']
})
export class ListComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  tableData: MatTableDataSource<SimpleKinship>;
  kinships: SimpleKinship[];
  temporalData: SimpleKinship[];
  sortedData: SimpleKinship[];
  displayedColumns: string[] = ['personName', 'kinshipType', 'relativeName', 'buttons'];
  orderBy: number;
  orderType: number;
  relations: [];
  value = '';
  isLoading: boolean;

  constructor(
    private kinshipsService: KinshipsService,
    private peopleService: PeopleService,
    public dialog: MatDialog,
    overlayContainer: OverlayContainer
  ) {
    overlayContainer.getContainerElement().classList.add('mat-light-theme');
  }

  ngOnInit() {
    this.loadTable();
    this.isLoading = true;
  }

  onChange(query: string) {
    const filterQuery = query.trim().toLowerCase();
    this.tableData.filter = filterQuery;
  }

  delete(personId: number, relativeId: number): void {
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
          this.loadTable();
          this.openSuccessDeleteMessage();
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
      this.loadTable();
    });
  }

  openCreate(): void {
    const dialogRef = this.dialog.open(CreateComponent, {
      panelClass: 'create-modalbox'
    });
    dialogRef.componentInstance.onCreate.subscribe(() => {
      dialogRef.close();
    });
    dialogRef.afterClosed().subscribe(() => {
      this.loadTable();
    });
  }

  loadTable() {
    this.kinshipsService.listKinships().subscribe(response => {
      this.kinships = response.data;
      this.temporalData = response.data;
      this.tableData = new MatTableDataSource(response.data);
      this.tableData.paginator = this.paginator;
      this.tableData.sort = this.sort;
      this.isLoading = false;
    });
  }

  clearSearch(value){
    this.value = '';
    this.loadTable();
  }
}
