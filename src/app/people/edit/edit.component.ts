import { Component, OnInit, Inject } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import {
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material';
import Swal from 'sweetalert2';
import { PeopleService } from 'src/app/services/people.service';
import { ModifyPerson, SimplePerson } from 'src/app/services/services.models';
import { CommonService } from 'src/app/services/common.service';
import { swalProviderToken } from '@sweetalert2/ngx-sweetalert2/lib/di';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditComponent implements OnInit {
  constructor(
    private commonService: CommonService,
    private peopleService: PeopleService,
    public dialogRef: MatDialogRef<EditComponent>,
    @Inject(MAT_DIALOG_DATA) public personId: number
  ) { }
  selectedDoc: string;
  showEmail = true;
  showPhone = false;
  showEmail2 = true;
  showPhone2 = false;
  showDni = true;
  showPass = false;
  registro: ModifyPerson;
  dateFormat: DatePipe;
  errors: string[] = [];
  success: string;
  succesfullsubmit = false;
  person: SimplePerson;
  user: FormGroup;
  minDate = new Date(1900, 0, 1);

  maxDate = new Date();
  countries = [];
  genderIds = [];
  documents = [];
  contacts = [];

  documentTypeIdSelected: number;
  genderIdSelected: number;
  countryIdSelected: number;
  contactType1IdSelected: number;
  contactType2IdSelected: number;
  private deletePerson(personId: number, personName: string, personLastName: string) {
    this.peopleService.deletePerson(personId).subscribe(respons => {
      if (respons.ok) {
        // If nothing goes wrong, show success message in swal
        this.openSuccessDeleteMessage();
      } else {
        // Else, show the error in a swal
        Swal.fire({
          text: respons.message,
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
  }
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
    this.person = new SimplePerson();
    this.registro = new SimplePerson();
    this.peopleService.inspectPerson(this.personId).subscribe(response => {
      if (response.ok) {
        this.countryIdSelected = response.data.countryId;
        this.contactType1IdSelected = response.data.contactType1Id;
        this.contactType2IdSelected = response.data.contactType2Id;
        this.documentTypeIdSelected = response.data.documentTypeId;
        this.genderIdSelected = response.data.genderId;
        this.showInputSecondContact(this.contactType2IdSelected);
        this.showInputContact(this.contactType1IdSelected);
        this.showInputDocument(this.documentTypeIdSelected);
        this.registro = response.data;
        this.person = response.data;
      }
    });
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
  delete(personId: number, personName: string, personLastName: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'btn btn-success',
      cancelButtonColor: 'btn btn-secondary',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {

      if (result.value) {
        this.deletePerson(personId, personName, personLastName);
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

      this.peopleService.modifyPerson(this.personId, this.registro).subscribe(
        response => {
          if (response.ok) {
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
          } else {
            Swal.fire({
              type: 'error',
              title: 'Register Denied',
              text: response.message
            });
          }
        }
      );
    }
  }

  openSuccessDeleteMessage(): void {
    Swal.fire({
      type: 'success',
      title: 'Done',
      text: 'This person was deleted succesfully',
      toast: true,
      position: 'top-end',
      width: 300,
      backdrop: false,
      showConfirmButton: false,
      timer: 1750
    });
  }
}
