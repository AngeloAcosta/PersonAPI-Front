import { Component, OnInit, Inject } from '@angular/core';
import { SimplePerson } from 'src/app/services/services.models';
import { PeopleService } from 'src/app/services/people.service';
import { MatSnackBar, MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { EditComponent } from '../edit/edit.component';
import Swal from 'sweetalert2';
import { InspectKinshipsComponent } from '../inspect.kinships/inspect.component';

@Component({
  selector: 'app-inspect',
  templateUrl: './inspect.component.html',
  styleUrls: ['./inspect.component.scss']
})

export class InspectComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public personId: number,
    private matDialog: MatDialog,
    private matDialogRef: MatDialogRef<InspectComponent>,
    private matSnackBar: MatSnackBar,
    private peopleService: PeopleService) { }
  isLoading: boolean;
  person: SimplePerson;

  private deletePerson(personId: number, personName: string, personLastName: string) {
    this.peopleService.deletePerson(personId).subscribe(response => {
      if (response.ok) {
        // If nothing goes wrong, show success message in a snack bar
        this.matSnackBar.open(`${personName} ${personLastName} was deleted.`);
        // And close this dialog
        this.matDialogRef.close();
      } else {
        // Else, show the error in a snack bar
        this.matSnackBar.open(response.message);
      }
    });
  }

  ngOnInit(): void {
    // Initialize properties
    this.isLoading = true;
    // Get the person
    this.peopleService.inspectPerson(this.personId).subscribe(response => {
      if (response.ok) {
        // If nothing goes wrong, save the person
        this.person = response.data;
        this.isLoading = false;
      } else {
        // Else, show the error in a snack bar
        this.matSnackBar.open(response.message);
      }
    });
  }

  openEditDialog(personId: number): void {
    // Open the edit component in a dialog, injecting the personId
    this.matDialog.open(EditComponent, { data: personId });
  }

  openInspectKinshipsDialog(personId: number): void {
    // Open the inspect kinships component in a dialog, injecting the personId
    this.matDialog.open(InspectKinshipsComponent, { data: personId });
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
