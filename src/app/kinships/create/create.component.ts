import { TestKinship } from './../../services/services.models';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { SimplePerson, CreateKinship } from 'src/app/services/services.models';
import { PeopleService } from 'src/app/services/people.service';
import { KinshipsService } from 'src/app/services/kinships.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  firstPerson: SimplePerson;
  secondPerson: SimplePerson;
  listPeople: SimplePerson[];
  firstSearchInputControl = new FormControl();
  secondSearchInputControl = new FormControl();
  firstFilteredPeople: Observable<SimplePerson[]>;
  secondFilteredPeople: Observable<SimplePerson[]>;
  relationSelected: string;
  errors: string[] = [];
  success: string;
  createKinshipForm = new FormGroup({
    personId: new FormControl(''),
    relativeId: new FormControl(''),
    kinshipType: new FormControl()
  });
  onCreate = new EventEmitter();

  relations = [];

  constructor(
    private peopleService: PeopleService,
    private kinshipsService: KinshipsService) {
    this.firstFilteredPeople = this.firstSearchInputControl.valueChanges.pipe(
      map(key => key ? this._filterPeople(key) : this.listPeople !== undefined ? this.listPeople.slice() : [])
    );

    this.secondFilteredPeople = this.secondSearchInputControl.valueChanges.pipe(
      map(key => key ? this._filterPeople(key) : this.listPeople !== undefined ? this.listPeople.slice() : [])
    );
  }

  private _buildTestKinshipHtml(test: TestKinship): string {
    const added = test.added.length ? `Added kinships: ${test.added.join(', ')}` : '';
    const modified = test.modified.length ? `Modified kinships: ${test.modified.join(', ')}` : '';
    const deleted = test.deleted.length ? `Deleted kinships: ${test.deleted.join(', ')}` : '';
    return `${added !== '' ? added + '<br>' : ''}${modified !== '' ? modified + '<br>' : ''}${deleted !== '' ? deleted + '<br>' : ''}`;
  }

  private _filterPeople(value: string): SimplePerson[] {
    const filterValue = value.toString().toLowerCase();
    return this.listPeople.filter(item => `${item.name} ${item.lastName}`.toLowerCase().indexOf(filterValue) > -1);
  }

  ngOnInit() {
    this.kinshipsService.listKinshipTypes().subscribe(response => {
      if (response.ok) {
        this.relations = response.data;
      }
    });
    this.peopleService.listPeople().subscribe(response => {
      if (response.ok) {
        this.listPeople = response.data;
      }
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
        // Send request
        const personId = this.createKinshipForm.get('personId').value;
        const relativeId = this.createKinshipForm.get('relativeId').value;
        const kinshipType = this.createKinshipForm.get('kinshipType').value;
        const kinship = new CreateKinship();
        kinship.relativeId = relativeId;
        kinship.kinshipType = kinshipType;
        this.peopleService.createKinshipTest(personId, kinship).subscribe(response => {
          if (response.ok) {
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
              html: this._buildTestKinshipHtml(response.data),
              showCloseButton: true,
              showCancelButton: true,
              cancelButtonText: 'Cancel',
              confirmButtonText: 'Confirm'
            }).then((result) => {
              if (result.value) {
                this.peopleService.createKinship(personId, kinship).subscribe(response => {
                  if (response.ok) {
                    swalModal.fire('Success!', 'New kinship has been added', 'success');
                    this.firstPerson = new SimplePerson();
                    this.secondPerson = new SimplePerson();
                    this.createKinshipForm.reset();
                    this.onCreate.emit();
                  } else {
                    swalModal.fire('Error', response.message, 'error');
                  }
                });
              } else if (result.dismiss === Swal.DismissReason.cancel) {
                swalModal.fire('Cancelled', 'No change was made', 'error');
              }
            });
          }
        });
      } else {
        Swal.fire('Warning', 'Kinship value is required.', 'warning');
      }
    } else {
      Swal.fire('Warning', 'Person or Relative data are required.', 'warning');
    }
  }
}
