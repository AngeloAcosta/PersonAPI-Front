import { EditComponent } from "./../edit/edit.component";
import { PeopleService } from "./../shared/services/people.service";
import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  AfterViewInit
} from "@angular/core";
import { Person } from "../shared/components/person/person";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatPaginator,
  MatTableDataSource,
  PageEvent,
  MatIcon
} from "@angular/material";
import { InspectComponent } from "../inspect/inspect.component";
import { OverlayContainer } from "@angular/cdk/overlay";

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"]
})
export class ListComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  dataSource: MatTableDataSource<Person>;
  people: Person[];
  displayedColumns: string[] = [
    "Nombre",
    "Documento",
    "Tipo Documento",
    "Buttons"
  ];
  person: Person;
  selected;

  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  pageEvent: PageEvent;

  selectedRowIndex: number = -1;

  constructor(
    private peopleService: PeopleService,
    public dialog: MatDialog,
    overlayContainer: OverlayContainer
  ) {
    overlayContainer.getContainerElement().classList.add("mat-light-theme");
  }

  ngOnInit() {
    this.peopleService.getPeople().subscribe(people => {
      this.people = people;
      console.log(this.people);
      this.dataSource = new MatTableDataSource(this.people);
      this.dataSource.paginator = this.paginator;
    });
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(",").map(str => +str);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openInfo(person: Person): void {
    const dialogRef = this.dialog.open(EditComponent, {
      width: "585px",
      height: "520px",
      data: person
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
    });
  }

  delete(person: Person): void {
    console.log(person.id);
    console.log(this.selected);
  }

  highlight(row) {
    this.selectedRowIndex = row.id;
    console.log(this.paginator.pageIndex, this.paginator.pageSize);
    const dialogRef = this.dialog.open(InspectComponent, {
      width: "585px",
      height: "520px",
      data: row
    });
  }
}
