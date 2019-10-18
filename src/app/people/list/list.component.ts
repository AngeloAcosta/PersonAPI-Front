import { CreateComponent } from './../create/create.component';
import { EditComponent } from './../edit/edit.component';
import { PeopleService } from './../shared/services/people.service';
import { Component, OnInit, Inject , ViewChild, AfterViewInit} from '@angular/core';
import {MatDialog, MatPaginator, MatTableDataSource, MatSort} from '@angular/material';
import { InspectComponent } from '../inspect/inspect.component';
import { OverlayContainer } from '@angular/cdk/overlay';
import {merge,  of as observableOf} from 'rxjs';
import {startWith, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  tableData: MatTableDataSource<any>;
  people;
  person;
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

    this.peopleService.getPeople().subscribe(people => {
      this.people = people;
      this.temporalData = people;
      this.loadTable(this.people);
      console.log(people);
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
            const fullname = item.name.toLowerCase() + ' ' + item.lastName.toLowerCase();
            return fullname.indexOf(value.toLowerCase()) > -1;
      });
      this.loadTable(this.people);
    } else {
      this.people = this.temporalData;
      this.loadTable(this.people);
    }
  }

  delete(person): void {
    if (confirm(`Are you sure to delete ${person.name} ?`)) {
     this.peopleService.deletePerson(person).subscribe(resp => {
      this.people = this.people.filter(item => item.id !== person.id);
      this.loadTable(this.people);
    });
    }
  }
  openEdit(person): void {
    const dialogRef = this.dialog.open(EditComponent, {
    width: '585px',
    height: '520px',
    data: person
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

openInfo(row) {

    this.peopleService.getPerson(row).subscribe(person => {
    this.person = person;
    this.temporalData = person;
    console.log(person);
    const dialogRef = this.dialog.open(InspectComponent, {
      data: person
     });

   });
}

}
