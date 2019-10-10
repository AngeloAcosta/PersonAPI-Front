import { EditComponent } from './../edit/edit.component';
import { PeopleService } from './../shared/services/people.service';
import { Component, OnInit, Inject , ViewChild, AfterViewInit} from '@angular/core';
import { Person } from '../shared/components/person/person';
import {MatDialog,MatPaginator, MatTableDataSource, MatSort} from '@angular/material';
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
  tableData: MatTableDataSource<Person>;
  people: Person[];
  temporalData:Person[];
  displayedColumns: string[] = ['name', 'docID', 'docType','country', 'buttons'];
  field:string = 'name'
  order:string = 'asc'
  person: Person ={
    id:30,
    name:'Paulo',
    lastName:'Flores',
    birth:'18/05/1994',
    docID:'87412547',
    docType:'DNI',
    gender:'male',
    country:'Spain'
  };

  constructor(private peopleService: PeopleService,
              public dialog: MatDialog,
              overlayContainer: OverlayContainer) {
              overlayContainer.getContainerElement().classList.add('mat-light-theme');
              }

  ngOnInit() {

    this.peopleService.getPeople(this.field, this.order).subscribe(people => {
      this.people = people;
      this.temporalData = people;
      this.loadTable(this.people);
    });
  }

  orderTable(){
    merge(this.sort.sortChange)
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.peopleService.getPeople(
            this.sort.active, this.sort.direction);
        })).subscribe(data => this.loadTable(data))
  }

  onChange(value: string) {
    if (value !== '') {
      this.people = this.people.filter(
        item => {
            let fullname = item.name.toLowerCase()+' '+item.lastName.toLowerCase();
            return fullname.indexOf(value.toLowerCase())> -1
      });
      this.loadTable(this.people)
    } else {
      this.people = this.temporalData;
      this.loadTable(this.people)
    }
  }

  delete(person: Person): void {
    if(confirm(`Are you sure to delete ${person.name} ?`)){
     this.peopleService.deletePerson(person).subscribe(resp =>{
      this.people = this.people.filter(t => t.id !==person.id);
      this.loadTable(this.people)
    });
    }
  }
  openEdit(person: Person): void {
    const dialogRef = this.dialog.open(EditComponent, {
    width: '585px',
    height: '520px',
    data: person
  });

}

loadTable(param){
  this.tableData = new MatTableDataSource(param);
  this.tableData.paginator = this.paginator;
  this.tableData.sort = this.sort;
}

openInfo(row){
    const dialogRef = this.dialog.open(InspectComponent, {
     data: row
   });
}

add(){
  this.peopleService.addPerson(this.person).subscribe(resp=>{
    this.people.push(resp);
    this.loadTable(this.people)
  });
}
}



