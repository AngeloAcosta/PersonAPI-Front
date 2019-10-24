import { Component, OnInit } from '@angular/core';
import { Person } from 'src/app/models/person.model';
import { PeopleService } from 'src/app/people/shared/services/people.service';
import { KinshipsService } from 'src/app/kinships/shared/service/kinships.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { kinshipOptions, variableNum } from '../../shared/constants';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  firstPerson: Person;
  secondPerson: Person;
  listPeople: any[]; // TODO: Need to change to Person class when corrected
  firstSearchInputControl = new FormControl();
  secondSearchInputControl = new FormControl();
  firstFilteredPeople: Observable<Person[]>;
  secondFilteredPeople: Observable<Person[]>;
  relationSelected: string;
  errors: string[] = [];
  success: string;
  createKinshipForm = new FormGroup({
    idPerson: new FormControl(''),
    idRelative: new FormControl(''),
    kinship: new FormControl()
  });

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
    return this.listPeople.filter(item => item.document.toLowerCase().indexOf(filterValue) > variableNum.n);
  }

  ngOnInit() {
    this.peopleService.getPeople().subscribe(people => {
      this.listPeople = people;
    });
  }

  SetInfoFirstPerson(value: string) {
    const res = this.listPeople.find(item => item.id === value);
    if (res) {
      this.firstPerson = res;
    }
  }

  SetInfoSecondPerson(value: string) {
    const res = this.listPeople.find(item => item.id === value);
    if (res) {
      this.secondPerson = res;
    }
  }

  onSubmit() {
    this.errors = [];
    this.success = '';
    if (this.firstPerson && this.secondPerson) {
      if (this.createKinshipForm.get('kinship').value !== null) {
        this.createKinshipForm.patchValue({
          idPerson: this.firstPerson.id,
          idRelative: this.secondPerson.id
        });
        this.kinshipService.addKinship(this.createKinshipForm.value).subscribe(res => {
          this.success = 'New Kinship created successfully!';
          this.firstPerson = new Person();
          this.secondPerson = new Person();
          this.createKinshipForm.reset();
        }, error => {
          // TODO: Adecuate error handle and display according to Backend (error.data);
          if (error.status === 404) {
            this.errors = ['An error ocurred with the server, please try again.', 'Bad Request 404'];
          } else if (error.status === 400) {
            this.errors = error.error.data.length ? error.error.data : [error.error.message];
          }
        });

      } else {
        this.errors.push('Kinship value is required.');
      }
    } else {
      this.errors.push('Person or Relative data are required.');
    }
  }
}
