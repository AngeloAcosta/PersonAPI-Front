import { CreateComponent } from './../create/create.component';
import { EditComponent } from './../edit/edit.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTableDataSource, MatSort, MatSnackBar, MatPaginator } from '@angular/material';
import { InspectComponent } from '../inspect/inspect.component';
import Swal from 'sweetalert2';
import { PeopleService } from 'src/app/services/people.service';
import { SimplePerson } from 'src/app/services/services.models';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  private readonly MAX_LISTED_PEOPLE = 420;

  columnsToDisplay: string[];
  isLoading: boolean;
  peopleDataSource: MatTableDataSource<SimplePerson>;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private matDialog: MatDialog,
    private matSnackBar: MatSnackBar,
    private peopleService: PeopleService
  ) { }

  private deletePerson(personId: number, personName: string, personLastName: string) {
    this.peopleService.deletePerson(personId).subscribe(response => {
      if (response.ok) {
        // If nothing goes wrong, show success message in a snack bar
        this.matSnackBar.open(`${personName} ${personLastName} was deleted.`);
        // And refresh the table
        this.refreshTable();
      } else {
        // Else, show the error in a snack bar
        this.matSnackBar.open(response.message);
      }
    });
  }

  private refreshTable(): void {
    // List people
    this.peopleService.listPeople(this.MAX_LISTED_PEOPLE).subscribe(response => {
      if (response.ok) {
        // If nothing goes wrong, save the people list
        this.peopleDataSource = new MatTableDataSource(response.data);
        this.peopleDataSource.sort = this.sort;
        // Set the loading state
        this.isLoading = false;
      } else {
        // Else, show the error in a snack bar
        this.matSnackBar.open(response.message);
      }
    });
  }

  ngOnInit(): void {
    // Initialize properties
    this.columnsToDisplay = ['name', 'document', 'documentType', 'country', 'actions'];
    this.isLoading = true;
    // Perform initial refresh of the table
    this.refreshTable();
  }

  filterTableData(query: string): void {
    // Trim and format the query
    const filterQuery = query.trim().toLowerCase();
    // Apply filter to the table
    this.peopleDataSource.filter = filterQuery;
  }

  openCreateDialog(): void {
    // Open the create component in a dialog
    const createDialog = this.matDialog.open(CreateComponent);
    // When the dialog closes, update the table
    createDialog.beforeClose().subscribe(_ => {
      this.refreshTable();
    });
  }

  openEditDialog(personId: number): void {
    // Open the edit component in a dialog, injecting the personId
    const editDialog = this.matDialog.open(EditComponent, { data: personId });
    // When the dialog closes, update the table
    editDialog.beforeClose().subscribe(_ => {
      this.refreshTable();
    });
  }

  openInspectDialog(personId: number): void {
    // Open the inspect component in a dialog, injecting the personId
    this.matDialog.open(InspectComponent, { data: personId });
  }

  promptDeletePerson(personId: number, personName: string, personLastName: string): void {
    // Show a sweet alert to prompt for confirmation
    Swal
      .fire({
        title: `Delete ${personName} ${personLastName}`,
        text: 'Are you sure you want to delete this person?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Yes',
        cancelButtonColor: '#d33',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) {
          this.deletePerson(personId, personName, personLastName);
        }
      });
  }
}
