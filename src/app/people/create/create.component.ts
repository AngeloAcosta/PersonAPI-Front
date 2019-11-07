import { StorageService } from './../../services/storage.service';
import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
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
import { MatDialogRef } from '@angular/material';
import Swal from 'sweetalert2';
import { PeopleService } from 'src/app/services/people.service';
import { CreatePerson } from 'src/app/services/services.models';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreateComponent implements OnInit {
  constructor(
    private peopleService: PeopleService,
    private commonService: CommonService,
    public dialogRef: MatDialogRef<CreateComponent>,
    private storageService: StorageService
  ) { }

  public static NEW_PERSON_ID_STORAGE_KEY: string = 'NEW_PERSON_ID';

  showEmail = true;
  showPhone = false;
  showEmail2 = true;
  showPhone2 = false;
  showDni = true;
  showPass = false;
  required = false;
  registro: CreatePerson;
  dateFormat: DatePipe;
  errors: string[] = [];
  success: string;

  user: FormGroup;
  minDate = new Date(1900, 0, 1);

  maxDate = new Date();
  countries = [];
  genderIds = [];
  documents = [];
  contacts = [];

  ngOnInit() {
    // Initialize common data
    this.commonService.listContactTypes().subscribe(response => {
      if (response.ok) {
        this.contacts = response.data;
      }
    });
    this.commonService.listCountries().subscribe(response => {
      if (response.ok) {
        this.countries = response.data;
      }
    });
    this.commonService.listDocumentTypes().subscribe(response => {
      if (response.ok) {
        this.documents = response.data;
      }
    });
    this.commonService.listGenders().subscribe(response => {
      if (response.ok) {
        this.genderIds = response.data;
      }
    });
    // Initialize form data
    this.registro = new CreatePerson();
    this.user = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('[a-zA-Z^\' ]*')
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('[a-zA-Z^\'ñÑáéíóúÁÉÍÓÚ ]*')
      ]),
      birthdate: new FormControl('', [Validators.required]),
      documentTypeId: new FormControl('', [Validators.required]),
      document: new FormControl(null, [Validators.pattern('[0-9]{8}')]),
      document2: new FormControl(null, [Validators.pattern('[a-zA-Z0-9]{12}')]),
      genderId: new FormControl('', Validators.required),
      countryId: new FormControl('', [Validators.required]),
      contactType1Id: new FormControl(null),

      email: new FormControl(null, [Validators.email]),
      phone: new FormControl(null, [Validators.pattern('[0-9]{7,9}')]),
      email2: new FormControl(null, [Validators.email]),
      phone2: new FormControl('', [Validators.pattern('[0-9]{7,9}')]),
      contactType2Id: new FormControl(null)
    });
  }

  showInputContact(event) {
    const selectedValue = event.value;
    if (selectedValue === 1) {
      this.showEmail = false;
      this.showPhone = true;
    } else {
      this.showEmail = true;
      this.showPhone = false;
    }
  }

  showInputSecondContact(event) {
    const selectedValue = event.value;
    if (selectedValue === 1) {
      this.showEmail2 = false;
      this.showPhone2 = true;
    } else {
      this.showEmail2 = true;
      this.showPhone2 = false;
    }
  }
  showInputDocument(event) {
    const selectedValue = event.value;
    if (selectedValue === 1) {
      this.showDni = true;
      this.showPass = false;
    } else {
      this.showDni = false;
      this.showPass = true;
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
  getEmptyError(param) {

    return this.user.get(param).hasError('minlenght')
      ? 'You must enter a value'
      : '';
  }

  public setContact() {
    if (
      this.registro.contact1 === undefined &&
      this.registro.contactType1Id === undefined
    ) {
      this.registro.contactType1Id = null;
      this.registro.contact1 = null;
    }

    if (
      this.registro.contact2 === undefined &&
      this.registro.contactType2Id === undefined
    ) {
      this.registro.contactType2Id = null;
      this.registro.contact2 = null;
    }
  }
  public verifyEmptyDocument() {
    if (this.registro.document === undefined || this.registro.document === '') {
      return true;
    }
    return false;
  }

  onSubmit(): void {
    this.setContact();
    const verify = this.verifyEmptyDocument();

    this.registro.birthdate = moment(this.registro.birthdate).format(
      'YYYY-MM-DD'
    );
    if (verify === true) {
      Swal.fire({
        type: 'error',
        title: 'Register Denied',
        text: ' This document ID is empty or alredy exits '

      });

    } else {
      this.peopleService.createPerson(this.registro).subscribe(
        response => {
          if (response.ok) {
            // Save the new person id
            this.storageService.setValue<number>(CreateComponent.NEW_PERSON_ID_STORAGE_KEY, response.data.id);
            // Show success swal
            this.dialogRef.close();
            Swal.fire({
              title: 'Done',
              text: ' Person was registered satisfactory',
              type: 'success',
              toast: true,
              position: 'top-end',
              width: 300,
              backdrop: false,
              showConfirmButton: false,
              timer: 1750
            });
          } else {
            Swal.fire({
              type: 'error',
              title: 'Register Denied',
              html: response.data
            });
          }
        }
      );
    }
  }
}
