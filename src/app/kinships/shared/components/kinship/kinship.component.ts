import { Person } from './../../../../people/shared/components/person/person';
import { Component, OnInit } from '@angular/core';
import { Kinship } from './kinship';

@Component({
  selector: 'app-kinship',
  templateUrl: './kinship.component.html',
  styleUrls: ['./kinship.component.css']
})
export class KinshipComponent implements OnInit {

  constructor(kinship: Kinship, person: Person) { }

  ngOnInit() {
  }

}
