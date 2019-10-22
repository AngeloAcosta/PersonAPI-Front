import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Person } from 'src/app/models/person.model';
import { Observable } from 'rxjs';
import { kinshipOptions } from 'src/app/shared/constants';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  firstPerson: Person;
  secondPerson: Person;
  listPeople: any[];
  relationSelected: string;
  errors: string[] = [];
  success: string;

  editkinship = new FormGroup({
    idPerson: new FormControl(''),
    idRelative: new FormControl(''),
    kinship: new FormControl('')
  });

  relations: {type: string, value: string}[] = kinshipOptions;

  constructor() { }

  ngOnInit() {
  }

}
