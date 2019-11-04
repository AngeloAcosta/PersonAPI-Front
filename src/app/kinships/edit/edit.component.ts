import { TestKinship } from './../../services/services.models';
import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';
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
  relationSelected = this.data.kinshipType;
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
    private peopleService: PeopleService
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
      const kinshipType = this.editkinship.get('kinship').value;
      const kinship = new ModifyKinship();
      kinship.kinshipType = kinshipType;
      this.peopleService.modifyKinshipTest(personId, relativeId, kinship).subscribe(response => {
        if (response.ok) {
          const swalModal = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-success',
              cancelButton: 'btn btn-danger'
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
                swalModal.fire('Success!', 'Selected kinship has been modified!', 'success').then(() => {
                  this.data = new SimpleKinship();
                  this.editkinship.reset();
                  this.onEdit.emit();
                });
              }, error => {
                if (error.status === 404) {
                  const resultError = ['An error ocurred with the server, please try again.', 'Bad Request 404'];
                  swalModal.fire('Error', resultError.join('\n'), 'error');
                } else if (error.status === 400) {
                  const resultError = error.error.data.length ? error.error.data : [error.error.message];
                  swalModal.fire('Error from Validation', resultError.join('\n'), 'error');
                }
              });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              swalModal.fire('Cancelled', 'No change was made', 'error');
            }
          });
        } else {

        }
      });
    } else {
      Swal.fire('Error', 'Kinship information is required!', 'error');
    }
  }

}
