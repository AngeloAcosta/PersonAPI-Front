import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Person } from 'src/app/models/person.model';
import { kinshipOptions } from 'src/app/shared/constants';
import { MAT_DIALOG_DATA } from '@angular/material';
import { KinshipModel } from 'src/app/models/kinship.model';
import Swal from 'sweetalert2';
import { KinshipsService } from '../shared/service/kinships.service';

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

  relations: {type: string, value: string}[] = kinshipOptions;

  constructor(@Inject(MAT_DIALOG_DATA) public data: KinshipModel, private kinshipService: KinshipsService) { }

  ngOnInit() {
  }

  onSubmit() {
    this.errors = [];
    this.success = '';
    if (this.data && this.editkinship.get('kinship').value !== null) {
      this.editkinship.patchValue({
        idPerson: this.data.personId,
        idRelative: this.data.relativeId
      });
      this.kinshipService.tryEditKinship(this.editkinship.value).subscribe(res => {
          if (res.added.length || res.modified.length || res.deleted.length) {
            const added = res.added.length ? `Added kinships: ${res.added.join(', ')}` : '' ;
            const modified = res.modified.length ? `Modified kinships: ${res.modified.join(', ')}` : '' ;
            const deleted = res.deleted.length ? `Deleted kinships: ${res.deleted.join(', ')}` : '' ;
            const htmlResponse = `${added !== '' ? added + '<br>' : '' }${modified !== '' ? modified + '<br>' : '' }${deleted !== '' ? deleted + '<br>' : '' }`;
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
              html: htmlResponse,
              showCloseButton: true,
              showCancelButton: true,
              cancelButtonText: 'Cancel',
              confirmButtonText: 'Confirm'
            }).then((result) => {
              if (result.value) {
                this.kinshipService.editKinship(this.editkinship.value).subscribe(() => {
                  swalModal.fire('Success!', 'Selected kinship has been modified!', 'success').then(() => {
                    this.data = new KinshipModel();
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
          }
        }, (error) => {
          Swal.fire('Error', 'An error ocurred trying to retrieve kinship changes data, try again!', 'error');
        });
    } else {
      Swal.fire('Error', 'Kinship information is required!', 'error');
    }
  }

}
