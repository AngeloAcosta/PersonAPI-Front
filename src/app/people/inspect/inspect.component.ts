import { Component, OnInit, Inject, Input } from '@angular/core';
import {MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';
import {Person} from '../shared/components/person/person';

@Component({
  selector: 'app-inspect',
  templateUrl: './inspect.component.html',
  styleUrls: ['./inspect.component.scss']
})
export class InspectComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<InspectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Person) { }

  ngOnInit() {
  }

}
