import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Person } from 'src/app/models/person.model';
import { kinshipOptions } from 'src/app/shared/constants';
import { MAT_DIALOG_DATA } from '@angular/material';
import { KinshipModel } from 'src/app/models/kinship.model';

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

  relations: {type: string, value: string}[] = kinshipOptions;

  constructor(@Inject(MAT_DIALOG_DATA) public data: KinshipModel) { }

  ngOnInit() {
  }

}
