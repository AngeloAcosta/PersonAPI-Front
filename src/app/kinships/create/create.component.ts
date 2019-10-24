import { Component, OnInit, EventEmitter } from '@angular/core';
import { Person } from 'src/app/models/person.model';
import { PeopleService } from 'src/app/people/shared/services/people.service';
import { KinshipsService } from 'src/app/kinships/shared/service/kinships.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { kinshipOptions, variableNum } from '../../shared/constants';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  firstPerson: Person;
  secondPerson: Person;
  listPeople: Person[];
  firstSearchInputControl = new FormControl();
  secondSearchInputControl = new FormControl();
  firstFilteredPeople: Observable<Person[]>;
  secondFilteredPeople: Observable<Person[]>;
  relationSelected: string;
  errors: string[] = [];
  success: string;
  createKinshipForm = new FormGroup({
    personId: new FormControl(''),
    relativeId: new FormControl(''),
    kinshipType: new FormControl()
  });
  onCreate = new EventEmitter();

  relations: {type: string, value: string}[] = kinshipOptions;

  constructor(private peopleService: PeopleService, private kinshipService: KinshipsService) {
    this.firstFilteredPeople = this.firstSearchInputControl.valueChanges.pipe(
      map(key => key ? this._filterPeople(key) : this.listPeople !== undefined ? this.listPeople.slice() : [] )
    );

    this.secondFilteredPeople = this.secondSearchInputControl.valueChanges.pipe(
      map(key => key ? this._filterPeople(key) : this.listPeople !== undefined ? this.listPeople.slice() : [] )
    );
  }

  private _filterPeople(value: string): Person[] {
    const filterValue = value.toString().toLowerCase();
    return this.listPeople.filter(item => `${item.name} ${item.lastName}`.toLowerCase().indexOf(filterValue) > variableNum.n);
  }

  ngOnInit() {
    this.peopleService.getPeople().subscribe(people => {
      this.listPeople = people;
    });
  }

  SetInfoFirstPerson(value: number) {
    const res = this.listPeople.find(item => item.id === value);
    if (res) {
      this.firstPerson = res;
    }
  }

  SetInfoSecondPerson(value: number) {
    const res = this.listPeople.find(item => item.id === value);
    if (res) {
      this.secondPerson = res;
    }
  }

  onSubmit() {
    this.errors = [];
    this.success = '';
    if (this.firstPerson && this.secondPerson) {
      if (this.createKinshipForm.get('kinshipType').value !== null) {
        this.createKinshipForm.patchValue({
          personId: this.firstPerson.id,
          relativeId: this.secondPerson.id
        });
        this.kinshipService.tryAddKinship(this.createKinshipForm.value).subscribe(res => {
          if (res.added.length || res.modified.length || res.deleted.length) {
            const added = res.added.length ? `Added kinships: ${res.added.join(', ')}` : '' ;
            const modified = res.modified.length ? `Modified kinships: ${res.modified.join(', ')}` : '' ;
            const deleted = res.deleted.length ? `Deleted kinships: ${res.deleted.join(', ')}` : '' ;
            const htmlResponse = `${added !== '' ? added + '<br>' : '' }${modified !== '' ? modified + '<br>' : '' }${deleted !== '' ? deleted + '<br>' : '' }`;
            const swalModal = Swal.mixin({
              customClass: {
                confirmButton: 'btn btn-success px-2',
                cancelButton: 'btn btn-danger px-2'
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
                this.kinshipService.addKinship(this.createKinshipForm.value).subscribe(() => {
                  swalModal.fire('Success!', 'New kinship has been added', 'success');
                  this.firstPerson = new Person();
                  this.secondPerson = new Person();
                  this.createKinshipForm.reset();
                  this.onCreate.emit();
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
          Swal.fire('Error', error.error ? error.error.message : 'Internal Error', 'error');
        });
      } else {
         Swal.fire('Warning', 'Kinship value is required.', 'warning');
      }
    } else {
      Swal.fire('Warning', 'Person or Relative data are required.', 'warning');
    }
  }
}
