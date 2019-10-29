import { CreateComponent } from './../create/create.component';
import { EditComponent } from './../edit/edit.component';
import { PeopleService } from './../shared/services/people.service';
import { Component, OnInit, Inject , ViewChild, AfterViewInit} from '@angular/core';
import { MatDialog, MatPaginator, MatTableDataSource, MatSort, MatDialogRef } from '@angular/material';
import { InspectComponent } from '../inspect/inspect.component';
import { OverlayContainer } from '@angular/cdk/overlay';
import {merge,  of as observableOf} from 'rxjs';
import {startWith, switchMap} from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Person } from 'src/app/models/person.model';
import { variableNum } from 'src/app/shared/constants';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  tableData: MatTableDataSource<Person>;
  people: Array<Person>;
  person: object;
  temporalData;
  displayedColumns: string[] = ['1', '2', '3', '4', 'buttons'];
  orderBy: number;
  orderType: number;

  constructor(private peopleService: PeopleService,
              public dialog: MatDialog,
              overlayContainer: OverlayContainer) {
              overlayContainer.getContainerElement().classList.add('mat-light-theme');
              }

  ngOnInit() {
    this.getInitialData();
  }

  getInitialData() {
    this.peopleService.getPeople().subscribe(people => {
      this.people = people;
      this.temporalData = people;
      this.loadTable(this.people);
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
        })).subscribe(person => this.loadTable(person));
  }

  onChange(value: string) {
    if (value !== '') {
      this.people = this.people.filter(
        item => {
          const fullname = `${item.name.toLowerCase()} ${item.lastName.toLowerCase()}`;
          return fullname.indexOf(value.toLowerCase()) > variableNum.n;
      });
      this.loadTable(this.people);
    } else {
      this.people = this.temporalData;
      this.loadTable(this.people);
    }
  }

  delete(person): void {
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
        this.peopleService.deletePerson(person).subscribe(resp => {
          this.people = this.people.filter(item => item.id !== person.id);
          this.loadTable(this.people);
        });
        Swal.fire({
          title: 'Deleted!',
          text: 'This person has been deleted.',
          type: 'success',
          toast: true,
          position: 'top-end',
          width: 300,
          backdrop: false,
          showConfirmButton: false,
          timer: 1750,
        }
        );
      }
    });

  }

  openEdit(row): void {
    this.peopleService.getPerson(row.id).subscribe(person => {
      this.person = person;
      this.temporalData = person;

      const dialogRef = this.dialog.open(EditComponent, {
        width: '530px',
        height: '520px',
        panelClass: 'custom-modalbox',
        data: person
       });
      dialogRef.afterClosed().subscribe(() => {
          this.getInitialData();
       });
     });

}

  openCreate(): void {
    const dialogRef = this.dialog.open(CreateComponent, {
      width: '555px',
      height: '520px'
    });
  }

loadTable(param) {
  this.tableData = new MatTableDataSource(param);
  this.tableData.paginator = this.paginator;
  this.tableData.sort = this.sort;
}

openInfo(row) {
    this.peopleService.getPerson(row.id).subscribe(person => {
    this.person = person;
    this.temporalData = person;
    const dialogRef = this.dialog.open(InspectComponent, {
      data: person
     });

   });
}

}
