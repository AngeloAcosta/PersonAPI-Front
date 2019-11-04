import { Component, OnInit, Inject } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { PeopleService } from './../shared/services/people.service';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

import {
  FormControl,
  FormGroup,
  Validators,
  PatternValidator,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatFormFieldControl,
  MatFormField,
  MatDialog
} from '@angular/material';
import Swal from 'sweetalert2';
import { isNgTemplate } from '@angular/compiler';
import { InspectModel, Person } from '../../people/inspect/inspect.models';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditComponent implements OnInit {
  constructor(
    private peopleService: PeopleService,
    public dialogRef: MatDialogRef<EditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InspectModel
  ) {}
  editPerson = this.data;
  people: Array<Person>;
  selectedDoc: string;
  showEmail = true;
  showPhone = false;
  showEmail2 = true;
  showPhone2 = false;
  showDni = true;
  showPass = false;
  registro: Person;
  dateFormat: DatePipe;
  errors: string[] = [];
  success: string;
  succesfullsubmit = false;
  originPerson: Person;
  user: FormGroup;
  minDate = new Date(1900, 0, 1);

  maxDate = new Date();
  countries = [...this.data.countries];
  genderIds = [...this.data.genders];
  documents = [...this.data.documentTypes];
  contacts = [...this.data.contactTypes];

  documentTypeIdSelected: number;
  genderIdSelected: number;
  countryIdSelected: number;
  contactType1IdSelected: number;
  contactType2IdSelected: number;

  ngOnInit() {
    this.registro = this.data.person;
    this.originPerson = { ...this.data.person };
    this.countryIdSelected = this.data.person.countryId;
    this.contactType1IdSelected = this.data.person.contactType1Id;
    this.contactType2IdSelected = this.data.person.contactType2Id;
    this.documentTypeIdSelected = this.data.person.documentTypeId;
    this.genderIdSelected = this.data.person.genderId;
    this.user = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('[a-zA-Z ]*')
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*')
      ]),
      birthdate: new FormControl('', [Validators.required]),
      documentTypeId: new FormControl('', [Validators.required]),
      document: new FormControl('', [Validators.pattern('[0-9]{8}')]),
      document2: new FormControl('', [Validators.pattern('[a-zA-Z0-9]{12}')]),
      genderId: new FormControl('', Validators.required),
      countryId: new FormControl('', [Validators.required]),
      contactType1Id: new FormControl(),

      email: new FormControl(null, [
        Validators.email,
        Validators.pattern(
          '[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{1,5}'
        )
      ]),
      phone: new FormControl(null, [Validators.pattern('[0-9]{7,9}')]),
      email2: new FormControl(null, [
        Validators.email,
        Validators.pattern(
          '[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{1,5}'
        )
      ]),
      phone2: new FormControl('', [Validators.pattern('[0-9]{7,9}')]),
      contactType2Id: new FormControl()
    });
    this.showInputSecondContact(this.contactType2IdSelected);
    this.showInputContact(this.contactType1IdSelected);
    this.showInputDocument(this.documentTypeIdSelected);
  }

  changeInputContact(event) {
    const selectedValue = event.value;
    this.showInputContact(selectedValue);
  }

  private showInputContact(selectedValue: any) {
    if (selectedValue === 1) {
      this.showEmail = false;
      this.showPhone = true;
      this.user.get('email').setValue('');
    } else {
      this.showEmail = true;
      this.showPhone = false;
      this.user.get('phone').setValue('');
    }
  }

  changeInputSecondContact(event) {
    const selectedValue = event.value;
    this.showInputSecondContact(selectedValue);
  }
  private showInputSecondContact(selectedValue: any) {
    if (selectedValue === 1) {
      this.showEmail2 = false;
      this.showPhone2 = true;
      this.user.get('email2').setValue('');
    } else {
      this.showEmail2 = true;
      this.showPhone2 = false;
      this.user.get('phone2').setValue('');
    }
  }

  changeInputDocument(event) {
    const selectedValue = event.value;
    this.showInputDocument(selectedValue);
  }

  private showInputDocument(selectedValue: any) {
    if (selectedValue === 1) {
      this.showDni = true;
      this.showPass = false;
      this.user.get('document2').setValue('');
    } else {
      this.showDni = false;
      this.showPass = true;
      this.user.get('document').setValue('');
    }
  }

  getErrorMessage(param) {
    return this.user.get(param).hasError('required')
      ? 'You must enter a value'
      : this.user.get(param).hasError('pattern')
      ? 'Please insert only letters'
      : this.user.get(param).hasError('minlength')
      ? `${param} must be greater than 2 characters`
      : '';
  }

  public setContact() {
    if (
      this.registro.contact1 === undefined &&
      this.registro.contactType1 === undefined
    ) {
      this.registro.contactType1 = null;
      this.registro.contact1 = null;
    }

    if (
      this.registro.contact2 === undefined &&
      this.registro.contactType2 === undefined
    ) {
      this.registro.contactType2 = null;
      this.registro.contact2 = null;
    }
  }

  public verifyEmptyDocument() {
    if (this.registro.document === undefined || this.registro.document === '') {
      return true;
    }
    return false;
  }

  delete(person): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.value) {
        this.peopleService.deletePerson(person).subscribe(resp => {
          this.people = this.people.filter(item => item.id !== person.id);
        });
        this.dialogRef.close();
        Swal.fire({
          title: 'Deleted!',
          text: 'This person has been deleted.',
          type: 'success',
          toast: true,
          position: 'top-end',
          width: 300,
          backdrop: false,
          showConfirmButton: false,
          timer: 1750
        });
      }
    });
  }

  onSubmit(): void {
    this.setContact();
    const errors = [];

    this.registro.birthdate = moment(this.registro.birthdate).format(
      'YYYY-MM-DD'
    );
    const verify = this.verifyEmptyDocument();

    if (verify === true) {
      Swal.fire({
        type: 'error',
        title: 'Register Denied',
        text: ' This document ID is empty or alredy exits '
      });
    } else {
      this.registro.countryId = this.countryIdSelected;
      this.registro.contactType1Id = this.contactType1IdSelected;
      this.registro.contactType2Id = this.contactType2IdSelected;
      this.registro.documentTypeId = this.documentTypeIdSelected;

      this.peopleService.editPerson(this.registro).subscribe(
        res => {
          this.dialogRef.close();
          Swal.fire({
            type: 'success',
            title: 'Done',
            text: ' Person was update satisfactory',
            toast: true,
            position: 'top-end',
            width: 300,
            backdrop: false,
            showConfirmButton: false,
            timer: 1750
          });
          this.succesfullsubmit = true;
          this.dialogRef.close();
        },
        error => {
          if (error.status === 400) {
            this.errors = [];
            Swal.fire({
              type: 'error',
              title: 'Register Denied',
              text: error.error.message
            });
          } else if (error.status === 500) {
            this.errors = error.data;
          }
        }
      );
    }
  }
}
