import { TestKinship } from './../../services/services.models';
import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import Swal from 'sweetalert2';
import { SimpleKinship, ModifyKinship } from 'src/app/services/services.models';
import { PeopleService } from 'src/app/services/people.service';
import { KinshipsService } from 'src/app/services/kinships.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  errors: string[] = [];
  success: string;
  relationSelected = this.data.kinshipTypeId;
  editkinship = new FormGroup({
    idPerson: new FormControl(''),
    idRelative: new FormControl(''),
    kinship: new FormControl('')
  });

  onEdit = new EventEmitter();

  relations = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: SimpleKinship,
    private kinshipsService: KinshipsService,
    private peopleService: PeopleService,
    public dialogRef: MatDialogRef<EditComponent>
  ) { }

  private _buildTestKinshipHtml(test: TestKinship): string {
    const added = test.added.length ? `Added kinships: ${test.added.join(', ')}` : '';
    const modified = test.modified.length ? `Modified kinships: ${test.modified.join(', ')}` : '';
    const deleted = test.deleted.length ? `Deleted kinships: ${test.deleted.join(', ')}` : '';
    return `${added !== '' ? added + '<br>' : ''}${modified !== '' ? modified + '<br>' : ''}${deleted !== '' ? deleted + '<br>' : ''}`;
  }

  ngOnInit() {
    this.kinshipsService.listKinshipTypes().subscribe(response => {
      if (response.ok) {
        this.relations = response.data;
      }
    });
  }

  onSubmit() {
    this.errors = [];
    this.success = '';
    if (this.data && this.editkinship.get('kinship').value !== null) {
      this.editkinship.patchValue({
        idPerson: this.data.personId,
        idRelative: this.data.relativeId
      });
      // Send request
      const personId = this.editkinship.get('idPerson').value;
      const relativeId = this.editkinship.get('idRelative').value;
      const kinship = new ModifyKinship();
      kinship.kinshipType = this.relationSelected;
      this.peopleService.modifyKinshipTest(personId, relativeId, kinship).subscribe(response => {
        if (response.ok) {
          const swalModal = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-success px-2 mr-3',
              cancelButton: 'btn btn-secondary px-2'
            },
            buttonsStyling: false
          });
          swalModal.fire({
            title: 'Are you sure?',
            text: 'The following changes will happen:',
            html: this._buildTestKinshipHtml(response.data),
            showCloseButton: true,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Confirm'
          }).then((result) => {
            if (result.value) {
              this.peopleService.modifyKinship(personId, relativeId, kinship).subscribe(() => {
                swalModal.fire({
                  title: 'Success!',
                  text: 'Selected kinship has been modified!',
                  type: 'success',
                  toast: true,
                  position: 'top-end',
                  width: 300,
                  backdrop: false,
                  showConfirmButton: false,
                  timer: 1750
                });
                this.data = new SimpleKinship();
                this.editkinship.reset();
                this.onEdit.emit();
                this.dialogRef.close();
              }, error => {
                if (error.status === 404) {
                  const resultError = ['An error ocurred with the server, please try again.', 'Bad Request 404'];
                  swalModal.fire('Error', resultError.join('\n'), 'error');
                } else if (error.status === 400) {
                  const resultError = error.error.data.length ? error.error.data : [error.error.message];
                  swalModal.fire('Error from Validation', resultError.join('\n'), 'error');
                }
              });
            }
          });
        } else {
          console.log(response.message);
          Swal.fire({
            text: response.message,
            type: 'error',
            backdrop: false,
            toast: true,
            position: 'top-end',
            width: 300,
            showConfirmButton: false,
            timer: 1550
          });
        }
      });
    } else {
      Swal.fire('Error', 'Kinship information is required!', 'error');
    }
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
          this.openSuccessDeleteMessage();
          this.editkinship.reset();
          this.onEdit.emit();
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

}
